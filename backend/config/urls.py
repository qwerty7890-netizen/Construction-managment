from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # API modules
    path('api/', include('users.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/logs/', include('logs.urls')),
    path('api/equipment/', include('equipment.urls')),
    path('api/warehouse/', include('warehouse.urls')),
    path('api/personnel/', include('personnel.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/accounting/', include('accounting.urls')),
    path('api/admin/', include('administration.urls')),
    # Dashboard
    path('api/dashboard/', include('config.dashboard_urls')),
    # API docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
