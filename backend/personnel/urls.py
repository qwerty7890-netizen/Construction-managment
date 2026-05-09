from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, PositionViewSet, EmployeeViewSet, EmployeeDocumentViewSet

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('positions', PositionViewSet, basename='position')
router.register('employees', EmployeeViewSet, basename='employee')
router.register('employee-documents', EmployeeDocumentViewSet, basename='employee-document')
urlpatterns = router.urls
