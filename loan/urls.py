from django.urls import path, include
from rest_framework import routers
from .api import GenerateLoanValueAPI
from .api import BankAccountValidateAPI, LoanApplicationViewSet, LoanResolverAPI


# to keep all loan related api within the Loan app
# LoanResolverAPI != ResolveLoanAPI
"""
LoanResolverAPI updates Loan Status and checks to see if repayment_even is true

        Whereas,

ResolveLoanAPI charges the user on loan repayment or due date. Creates and update wallet activity:
crediting user wallet balance before debiting owed amount
"""
from wallet.api import ResolveLoanAPI

router = routers.DefaultRouter()
router.register('api/loan/application', LoanApplicationViewSet, 'applications')

urlpatterns = [
    path('api/loan/bank/validate', BankAccountValidateAPI.as_view()),
    path('api/loan/getvalue', GenerateLoanValueAPI.as_view()),
    path('api/loan/resolve', LoanResolverAPI.as_view()),
    path('api/loan/repayment/charge', ResolveLoanAPI.as_view())

]
urlpatterns += router.urls
