from .models import LittleDrops, Rentplus, TargetSaving, FixedDeposit
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RentplusSerializer, TargetSavingSerializer, FixedDepositSerializer
from .serializers import LittleDropsSerializer, PlanLiquidateSerializer
from .models import LittleDrops
from wallet.models import Wallet

from datetime import datetime
from datetime import timedelta

from decimal import Decimal


# Rentplus Viewset


class RentplusViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = RentplusSerializer

    def get_queryset(self):
        return self.request.user.rentplus.all()

    def perform_create(self, serializer):
        startDate = serializer.validated_data["start_date"]
        serializer.save(owner=self.request.user,
                        next_deduction_date=startDate)


# Target Savings ViewSet
class TargetSavingViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = TargetSavingSerializer

    def get_queryset(self):
        return self.request.user.targetsavings.all()

    def perform_create(self, serializer):
        startDate = serializer.validated_data["start_date"]
        serializer.save(owner=self.request.user,
                        next_deduction_date=startDate)

# Fixed Deposit Viewset


class FixedDepositViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = FixedDepositSerializer

    def get_queryset(self):
        return self.request.user.fixds.all()

    def perform_create(self, serializer):
        startDate = serializer.validated_data["start_date"]
        serializer.save(owner=self.request.user,
                        next_deduction_date=startDate)


# Little Drops ViewSet
class LittleDropsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = LittleDropsSerializer

    def get_queryset(self):
        return LittleDrops.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# VAULTFLEX SETTINGS
class AllUserPlansAPI(APIView):
    """
    API returning all plans a user currently has
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, format=None):
        user = self.request.user
        allplans = []
        try:
            littledrops = LittleDrops.objects.filter(owner=user).values()
        except LittleDrops.DoesNotExitst:
            littledrops = []

        try:
            rentplus = Rentplus.objects.filter(owner=user).values()
        except Rentplus.DoesNotExitst:
            rentplus = []
        try:
            targetsavings = TargetSaving.objects.filter(owner=user).values()
        except TargetSaving.DoesNotExitst:
            targetsavings = []
        try:
            fixeddeposit = FixedDeposit.objects.filter(owner=user).values()
        except FixedDeposit.DoesNotExitst:
            fixeddeposit = []

        allplans.extend(littledrops)
        allplans.extend(rentplus)
        allplans.extend(targetsavings)
        allplans.extend(fixeddeposit)

        return Response(allplans)

    def post(self, request, *args, **kwargs):
        serializer = PlanLiquidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        plan = data_bank["plan_name"]
        if plan == "littledrops":
            return Response({
                "status": "success",
                "message": "User can opt for withdraw in Drops'dashboard",
                "errros": serializer.errors
            }, status=status.HTTP_200_OK

            )
        elif plan == "rentplus":
            ref = data_bank["ref_number"]
            user_plan = Rentplus.objects.get(owner=user, ref_number=ref)
            print(user_plan)
            amount = user_plan.amount_saved
            if user_plan.locked == "NO" and user_plan.tenor_ended == False:
                user_plan.amount_saved = Decimal("{:.2f}".format(0.00))
                user_plan.locked = "YES"
                user_plan.tenor_ended = True
                user_plan.next_deduction_date = None

                user_plan.save(update_fields=[
                    "amount_saved",
                    "locked",
                    "tenor_ended",
                    "next_deduction_date"
                ])
                # Wallet
                action2 = Wallet.rentp_cr(
                    wallet_id=wallet,
                    received_by=user,
                    amount=amount,
                    asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                )

                return Response({
                    "status": "success",
                    "message": "Plan dissolved success",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK

                )
            else:
                return Response({
                    "status": "failed",
                    "message": "dissolve option not available",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        elif plan == "targetsavings":
            ref = data_bank["ref_number"]
            user_plan = TargetSaving.objects.get(owner=user, ref_number=ref)
            amount = user_plan.amount_saved
            if user_plan.locked == "NO" and user_plan.tenor_ended == False:
                user_plan.amount_saved = Decimal("{:.2f}".format(0.00))
                user_plan.locked = "YES"
                user_plan.tenor_ended = True
                user_plan.next_deduction_date = None

                user_plan.save(update_fields=[
                    "amount_saved",
                    "locked",
                    "tenor_ended",
                    "next_deduction_date"
                ])

                # Wallet
                action2 = Wallet.target_cr(
                    wallet_id=wallet,
                    received_by=user,
                    amount=amount,
                    asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                )

                return Response({
                    "status": "success",
                    "message": "Plan dissolved success",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK

                )
            else:
                return Response({
                    "status": "failed",
                    "message": "dissolve option not available",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        elif plan == "fixds":
            return Response({
                "status": "failed",
                "message": "dissolve option not available",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
