from rest_framework import viewsets
from .models import Client, Contractor, Contract, ContractAddendum
from .serializers import ClientSerializer, ContractorSerializer, ContractSerializer, ContractAddendumSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    search_fields = ['name', 'nit', 'contact_person']
    filterset_fields = ['client_type', 'is_active', 'city']
    serializer_class = ClientSerializer


class ContractorViewSet(viewsets.ModelViewSet):
    queryset = Contractor.objects.all()
    search_fields = ['name', 'nit', 'contact_person']
    filterset_fields = ['specialty', 'is_active', 'city']
    serializer_class = ContractorSerializer


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().select_related('project', 'client', 'contractor')
    search_fields = ['contract_number', 'client__name', 'contractor__name']
    filterset_fields = ['contract_type', 'status', 'project', 'client', 'contractor']
    ordering_fields = ['start_date', 'value']
    serializer_class = ContractSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ContractAddendumViewSet(viewsets.ModelViewSet):
    queryset = ContractAddendum.objects.all()
    filterset_fields = ['contract']
    serializer_class = ContractAddendumSerializer
