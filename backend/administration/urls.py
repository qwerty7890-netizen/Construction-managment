from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ContractorViewSet, ContractViewSet, ContractAddendumViewSet

router = DefaultRouter()
router.register('clients', ClientViewSet, basename='client')
router.register('contractors', ContractorViewSet, basename='contractor')
router.register('contracts', ContractViewSet, basename='contract')
router.register('addenda', ContractAddendumViewSet, basename='addendum')
urlpatterns = router.urls
