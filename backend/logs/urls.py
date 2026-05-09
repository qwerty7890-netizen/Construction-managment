from rest_framework.routers import DefaultRouter
from .views import DailyLogViewSet, LogActivityViewSet, LogPersonnelViewSet, LogEquipmentViewSet, LogMaterialViewSet, LogIncidentViewSet

router = DefaultRouter()
router.register('daily-logs', DailyLogViewSet, basename='daily-log')
router.register('activities', LogActivityViewSet, basename='log-activity')
router.register('log-personnel', LogPersonnelViewSet, basename='log-personnel')
router.register('log-equipment', LogEquipmentViewSet, basename='log-equipment')
router.register('log-materials', LogMaterialViewSet, basename='log-material')
router.register('incidents', LogIncidentViewSet, basename='incident')
urlpatterns = router.urls
