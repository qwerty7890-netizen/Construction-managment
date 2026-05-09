from rest_framework.routers import DefaultRouter
from .views import PayrollPeriodViewSet, PayrollEntryViewSet, SalaryAdvanceViewSet

router = DefaultRouter()
router.register('periods', PayrollPeriodViewSet, basename='payroll-period')
router.register('entries', PayrollEntryViewSet, basename='payroll-entry')
router.register('advances', SalaryAdvanceViewSet, basename='salary-advance')
urlpatterns = router.urls
