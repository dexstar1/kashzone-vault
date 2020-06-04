from django.urls import path
from rest_framework import routers
from .api import WalletViewSet, ActionViewSet, DepositAPI  # , WalletViewSet
from .api import WithdrawalAPI, SmartTransferAPI

router = routers.DefaultRouter()

router.register('api/wallet/actions', ActionViewSet, 'actions')

router.register('api/wallet', WalletViewSet, 'wallets')

urlpatterns = router.urls

urlpatterns += [
    path('api/user/card/charge', DepositAPI.as_view()),
    path('api/user/bank/withdraw', WithdrawalAPI.as_view()),
    path('api/user/fund/transfer', SmartTransferAPI.as_view())
]
