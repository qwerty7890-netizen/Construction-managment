from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import MaterialCategory, Material, Supplier, PurchaseOrder, PurchaseOrderItem, MaterialEntry, MaterialExit
from .serializers import (MaterialCategorySerializer, MaterialSerializer, SupplierSerializer,
                          PurchaseOrderSerializer, PurchaseOrderItemSerializer,
                          MaterialEntrySerializer, MaterialExitSerializer)


class MaterialCategoryViewSet(viewsets.ModelViewSet):
    queryset = MaterialCategory.objects.all()
    serializer_class = MaterialCategorySerializer
    search_fields = ['name']


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all().select_related('category')
    search_fields = ['code', 'name', 'description']
    filterset_fields = ['category', 'is_active']
    ordering_fields = ['code', 'name', 'current_stock']
    serializer_class = MaterialSerializer

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        materials = Material.objects.filter(is_active=True).extra(
            where=['current_stock <= minimum_stock']
        )
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    search_fields = ['name', 'nit', 'contact_person']
    filterset_fields = ['is_active', 'city']
    serializer_class = SupplierSerializer


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().select_related('supplier', 'project')
    search_fields = ['order_number', 'supplier__name']
    filterset_fields = ['status', 'supplier', 'project']
    ordering_fields = ['order_date', 'total']
    serializer_class = PurchaseOrderSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MaterialEntryViewSet(viewsets.ModelViewSet):
    queryset = MaterialEntry.objects.all().select_related('material', 'supplier')
    filterset_fields = ['material', 'supplier', 'date']
    ordering_fields = ['date']
    serializer_class = MaterialEntrySerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            entry = serializer.save(received_by=self.request.user)
            material = entry.material
            material.current_stock += entry.quantity
            material.save()


class MaterialExitViewSet(viewsets.ModelViewSet):
    queryset = MaterialExit.objects.all().select_related('material', 'project')
    filterset_fields = ['material', 'project', 'date']
    ordering_fields = ['date']
    serializer_class = MaterialExitSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            exit_entry = serializer.save(authorized_by=self.request.user)
            material = exit_entry.material
            material.current_stock -= exit_entry.quantity
            material.save()
