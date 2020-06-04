from django.urls import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, CardAPI, ProfileAPI  # ,ChargeTokenAPI,
from .api import TxrefAPI, OTPAPI, LinkedCardViewSet, EmailAuthAPI, AuthCodeAPI
from .api import PhonenumberValidateAPI, LinkedBankAPI, VaultFullnameAPI
from knox import views as knox_views
from rest_framework import routers


router = routers.DefaultRouter()
router.register('api/user/cards', LinkedCardViewSet, 'cards')


urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name="knox_logout"),
    path('api/user/mainprofile/update', ProfileAPI.as_view()),
    path('api/user/addcard', CardAPI.as_view()),
    path('api/user/card/verify', TxrefAPI.as_view()),
    path('api/user/card/otp', OTPAPI.as_view()),
    # path('api/user/card/token', ChargeTokenAPI.as_view()), not available to public
    path('api/phonenumber/verify', PhonenumberValidateAPI.as_view()),
    path('api/email/verify', EmailAuthAPI.as_view()),
    path('api/email/authchecker', AuthCodeAPI.as_view()),
    path('api/user/banks', LinkedBankAPI.as_view()),
    path('api/user/fund/recipient/verify', VaultFullnameAPI.as_view())
]

urlpatterns += router.urls
