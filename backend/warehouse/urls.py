from rest_framework.routers import DefaultRouter
from .views import (MaterialCategoryViewSet, MaterialViewSet, SupplierViewSet,
                    PurchaseOrderViewSet, MaterialEntryViewSet, MaterialExitViewSet)

router = DefaultRouter()
router.register('categories', MaterialCategoryViewSet, basename='material-category')
router.register('materials', MaterialViewSet, basename='material')
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register('entries', MaterialEntryViewSet, basename='material-entry')
router.register('exits', MaterialExitViewSet, basename='material-exit')
urlpatterns = router.urls
