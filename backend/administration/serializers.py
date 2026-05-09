from rest_framework import serializers
from .models import Client, Contractor, Contract, ContractAddendum


class ClientSerializer(serializers.ModelSerializer):
    client_type_display = serializers.CharField(source='get_client_type_display', read_only=True)

    class Meta:
        model = Client
        fields = '__all__'


class ContractorSerializer(serializers.ModelSerializer):
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)

    class Meta:
        model = Contractor
        fields = '__all__'


class ContractAddendumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractAddendum
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):
    addenda = ContractAddendumSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    contractor_name = serializers.CharField(source='contractor.name', read_only=True)

    class Meta:
        model = Contract
        fields = '__all__'
