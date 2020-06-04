from django.urls import path
from .api import RentplusViewSet, TargetSavingViewSet, FixedDepositViewSet
from .api import LittleDropsViewSet, AllUserPlansAPI
from rest_framework import routers

from wallet.api import RentPlusContribAPI, TargetSavingContribAPI, FixedDepositAPI
from wallet.api import LittleDropsWithdrawAPI, LittleDripDropAPI

router = routers.DefaultRouter()
router.register('api/product/rentplus', RentplusViewSet, 'rentplus')
router.register('api/product/targetsavings',
                TargetSavingViewSet, 'targetsavings')
router.register('api/product/fixds', FixedDepositViewSet, 'fixds')
router.register('api/product/littledrops', LittleDropsViewSet, 'littledrops')


urlpatterns = router.urls
# placing all vaultflex/ Vault Products in the same .url file
urlpatterns += [
    path('api/product/rentplus/new/charge', RentPlusContribAPI.as_view()),
    path('api/product/targetsavings/new/charge',
         TargetSavingContribAPI.as_view()),
    path('api/product/fixds/new/charge', FixedDepositAPI.as_view()),
    path('api/product/littled/withdraw', LittleDropsWithdrawAPI.as_view()),
    path('api/product/littled/drop', LittleDripDropAPI.as_view()),
    path('api/user/allplans', AllUserPlansAPI.as_view())

]
