from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectPhaseViewSet, ProjectDocumentViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('phases', ProjectPhaseViewSet, basename='phase')
router.register('documents', ProjectDocumentViewSet, basename='project-document')
urlpatterns = router.urls
