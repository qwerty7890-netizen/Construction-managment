from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, EquipmentAssignmentViewSet, EquipmentMaintenanceViewSet, FuelLogViewSet

router = DefaultRouter()
router.register('equipment', EquipmentViewSet, basename='equipment')
router.register('assignments', EquipmentAssignmentViewSet, basename='equipment-assignment')
router.register('maintenance', EquipmentMaintenanceViewSet, basename='maintenance')
router.register('fuel-logs', FuelLogViewSet, basename='fuel-log')
urlpatterns = router.urls
