from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, JournalViewSet, InvoiceViewSet, ExpenseViewSet, BudgetViewSet

router = DefaultRouter()
router.register('accounts', AccountViewSet, basename='account')
router.register('journals', JournalViewSet, basename='journal')
router.register('invoices', InvoiceViewSet, basename='invoice')
router.register('expenses', ExpenseViewSet, basename='expense')
router.register('budgets', BudgetViewSet, basename='budget')
urlpatterns = router.urls
