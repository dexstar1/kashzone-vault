"""vault URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Vault24 Administration"
admin.site.site_title = "Vault24 Administration"

urlpatterns = [
    path('itdept-adsr/admin/', admin.site.urls),
    path('', include('base.urls')),
    path('', include('frontend.urls')),
    path('', include('wallet.urls')),
    path('', include('acctmang.urls')),
    path('', include('vaultflex.urls')),
    path('', include('loan.urls')),
    path('', include('administrator.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

handler404 = 'base.views.handler404'
handler500 = 'base.views.handler500'
