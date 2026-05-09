from rest_framework import viewsets
from .models import Department, Position, Employee, EmployeeDocument
from .serializers import (DepartmentSerializer, PositionSerializer,
                          EmployeeSerializer, EmployeeListSerializer, EmployeeDocumentSerializer)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    search_fields = ['name']


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all().select_related('department')
    filterset_fields = ['department']
    search_fields = ['name']
    serializer_class = PositionSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related('department', 'position')
    search_fields = ['employee_code', 'first_name', 'last_name', 'id_number']
    filterset_fields = ['department', 'position', 'status', 'salary_type']
    ordering_fields = ['last_name', 'first_name', 'hire_date', 'base_salary']

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        return EmployeeSerializer


class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    filterset_fields = ['employee', 'doc_type']
    serializer_class = EmployeeDocumentSerializer
