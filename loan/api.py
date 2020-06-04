from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BankAccountValidateSerializer, LoanApplicationSerializer
from .serializers import LoanResolverSerializer
from .models import Applications
from .paystack import PaystacksApiChecker

from acctmang.models import Profile
from wallet.models import Wallet
from datetime import datetime
from decimal import *
from vaultflex.models import Rentplus, TargetSaving, FixedDeposit
from django.db.models import Sum
import decimal


class GenerateLoanValueAPI(APIView):
    """
    Generating possible requestable loan value for user, based
    on savings worth that are locked in.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, format=None):
        user = self.request.user
        # for RentPlus
        rentplus_locked = Rentplus.objects.filter(owner=user, locked='YES')
        rp_locked_sum = rentplus_locked.aggregate(Sum('amount_saved'))[
            "amount_saved__sum"]
        try:
            format_rp_locked_sum = decimal.Decimal(
                "{:.2f}".format(rp_locked_sum))
        except BaseException:
            format_rp_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # for TargetSavings
        target_locked = TargetSaving.objects.filter(owner=user, locked='YES')
        target_locked_sum = target_locked.aggregate(Sum('amount_saved'))[
            "amount_saved__sum"]
        try:
            format_target_locked_sum = decimal.Decimal(
                "{:.2f}".format(target_locked_sum))
        except BaseException:
            format_target_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # for FixedDeposit
        fixed = FixedDeposit.objects.filter(owner=user)
        fixed_sum = fixed.aggregate(Sum('amount_received'))[
            "amount_received__sum"]
        try:
            format_fixed_sum = decimal.Decimal("{:.2f}".format(fixed_sum))
        except BaseException:
            format_fixed_sum = decimal.Decimal("{:.2f}".format(0.00))

        # Total
        total_value = format_rp_locked_sum + format_target_locked_sum + format_fixed_sum

        # Loan Value
        max_percentage = decimal.Decimal("{:.2f}".format(0.30))
        calc_value = total_value * max_percentage
        loan_value = int(calc_value)

        return Response({"requestable": loan_value})


class BankAccountValidateAPI(APIView):
    """
    Validates Bank account with Paystack.py

    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = BankAccountValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        bank_code = serializer.data["bankName"]
        account_number = serializer.data["bankAccount"]
        link = "https://api.paystack.co/bank/resolve?account_number={}&bank_code={}".format(
            account_number, bank_code)
        result = PaystacksApiChecker(link).validate_account()

        return Response(result)


# LOAN APPLICATION VIEWSET
class LoanApplicationViewSet(viewsets.ModelViewSet):
    """
    Registers a new Loan application and Credits user with loan offer-amount

    """
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        return self.request.user.applications.all()[::-1][:10]

    def perform_create(self, serializer):
        user = self.request.user
        running_loan_applications = len(
            Applications.objects.filter(owner=user, status="running"))
        #############################################
        # for RentPlus
        rentplus_locked = Rentplus.objects.filter(owner=user, locked='YES')
        rp_locked_sum = rentplus_locked.aggregate(Sum('amount_saved'))[
            "amount_saved__sum"]
        try:
            format_rp_locked_sum = decimal.Decimal(
                "{:.2f}".format(rp_locked_sum))
        except BaseException:
            format_rp_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # for TargetSavings
        target_locked = TargetSaving.objects.filter(owner=user, locked='YES')
        target_locked_sum = target_locked.aggregate(Sum('amount_saved'))[
            "amount_saved__sum"]
        try:
            format_target_locked_sum = decimal.Decimal(
                "{:.2f}".format(target_locked_sum))
        except BaseException:
            format_target_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # for FixedDeposit
        fixed = FixedDeposit.objects.filter(owner=user)
        fixed_sum = fixed.aggregate(Sum('amount_received'))[
            "amount_received__sum"]
        try:
            format_fixed_sum = decimal.Decimal("{:.2f}".format(fixed_sum))
        except BaseException:
            format_fixed_sum = decimal.Decimal("{:.2f}".format(0.00))

        # Total
        total_value = format_rp_locked_sum + format_target_locked_sum + format_fixed_sum

        # Loan Value
        max_percentage = decimal.Decimal("{:.2f}".format(0.30))
        calc_value = total_value * max_percentage
        loan_value = int(calc_value)
        ###############################################
        wallet = self.request.user.wallets.wallet_id
        serializer.save(owner=user)
        latest_application = Applications.objects.filter(owner=user).last()
        amount = latest_application.loan_amount

        if float(amount) <= loan_value and running_loan_applications == 0:
            action2 = Wallet().loan_cr(
                wallet_id=wallet,
                received_by=user,
                amount=Decimal(amount),
                asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            )
        else:
            latest_application.status = "failed"
            latest_application.repayment_amount = 0
            latest_application.repayment_even = True
            latest_application.save(update_fields=[
                "status",
                "repayment_amount",
                "repayment_even"
            ])


# Loan Resolver: Provoke current loan status change
class LoanResolverAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = LoanResolverSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        even_value = serializer.data["repayment_even"]
        loan_status = serializer.data["status"]

        try:
            application = Applications.objects.filter(
                owner=user, status="running").last()
        except Applications.DoesNotExist:
            application = None

        if application:
            application.status = loan_status
            application.repayment_even = even_value
            application.save(update_fields=[
                "status",
                "repayment_even"
            ])

            return Response({
                "status": "success",
                "message": "Loan update success"
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": "failed",
                "message": "Unable to process request",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
