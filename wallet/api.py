from .models import Wallet, Action
from rest_framework import viewsets, permissions, generics, status
from .serializers import WalletSerializer, ActionSerializer, DepositSerializer
from .serializers import ResolveLoanSerializer, RentPlusContribSerializer
from .serializers import TargetSavingContribSerializer, FixedDepositSerializer
from .serializers import WithdrawalSerializer, SmartTransferSerializer
from .serializers import LittleDropsWithdrawSerializer, LittleDripDropSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

from acctmang.models import Token, Profile
from .models import Wallet
from loan.models import Applications
from vaultflex.models import Rentplus, TargetSaving, FixedDeposit, LittleDrops
from datetime import datetime, timedelta
from acctmang.flutterwave import FlutterWorkerAPII, rave, FlutterWorkerAPIII
import json
from django.core.serializers.json import DjangoJSONEncoder
from decimal import Decimal
from .errors import Error, InvalidAmount, InsufficientFunds, ExceedsLimit, UserDoesNotExist

from .calc import little_drops_average

"""
# Wallet Viewset


class WalletViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = WalletSerializer

    def get_queryset(self):
        # self.request.user.wallet...
        return Wallet.objects.all()
"""
# Wallet Balance ViewSet


class WalletViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = WalletSerializer

    def get_queryset(self):
        wallet = Wallet.objects.filter(user=self.request.user)

        return wallet


# Action viewset

class ActionViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ActionSerializer

    def get_queryset(self):
        """
        returning a last 10 actions
        """
        return self.request.user.actions.all()[::-1][:10]


class DepositAPI(APIView):
    """
    Trigers Rave Charge-With-Token
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = DepositSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        country = 'NG'
        currency = 'NGN'
        amount = details["amount"]
        try:
            token = Token.objects.filter(user=user).last()
        except Token.DoesNotExist:
            token = None
        if token:
            fore_action = FlutterWorkerAPII(
                token=str(token),
                email=str(user),
                currency=currency,
                country=country,
                amount=amount
            )
            action = fore_action.directCardCharge()
            print(action)
            then = rave.Card.verify(action)
            if then["transactionComplete"]:
                action = Wallet().deposit(
                    wallet_id=wallet,
                    deposited_by=user,
                    amount=Decimal("{:.2f}".format(then["amount"])),
                    asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

                )
                return Response({
                    "status": "success",
                    "message": "Card Charged",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    "status": "failed",
                    "message": "Error validating transaction",
                    "errros": serializer.errors
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                "status": "failed",
                "message": "No card available",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class ResolveLoanAPI(APIView):
    """
    Trigers Rave Charge-With-Token and Charges/Resolve current loan
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = ResolveLoanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        country = 'NG'
        currency = 'NGN'
        #amount = details["amount"]-- disregard
        #to double check we will be disregarding the amount sent from the fronted
        #as the same is avialable in the backend, hence;
        #we call the Application filter status..to figure out the last running loan- repayment amount
        last_running_loan = Applications.objects.filter(owner=user, status="running").last()
        amount = last_running_loan.repayment_amount

        try:
            token = Token.objects.filter(user=user).last()
        except Token.DoesNotExist:
            token = None
        if token:
            fore_action = FlutterWorkerAPII(
                token=str(token),
                email=str(user),
                currency=currency,
                country=country,
                amount=amount
            )
            action = fore_action.directCardCharge()
            print(action)
            then = rave.Card.verify(action)
            if then["transactionComplete"]:
                action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                action_amount = Decimal("{:.2f}".format(then["amount"]))
                
                action = Wallet().deposit(
                    wallet_id=wallet,
                    deposited_by=user,
                    amount=action_amount,
                    asof=action_time

                )
                action2 = Wallet().loan_dr(
                    wallet_id=wallet,
                    debited_from=user,
                    amount=action_amount,
                    asof=action_time
                )
                return Response({
                    "status": "success",
                    "message": "Loan Resolved",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    "status": "failed",
                    "message": "Error validating transaction",
                    "errros": serializer.errors
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                "status": "failed",
                "message": "No card available",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class RentPlusContribAPI(APIView):
    """
    Trigers Rave Charge-With-Token(amount = user preferred) 
    for savings towards  RentPlus target amount
    
    This api is basically called when a new plan is created checking
    if startdate is datetime.now().date() to make initial debit otherwise
    routine jobs is used to debit subsequently
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = RentPlusContribSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        country = 'NG'
        currency = 'NGN'
        amount = details["amount"]

        
        plan = Rentplus.objects.filter(owner=user).last()
        if plan:
            charge_date = plan.next_deduction_date
            target_amount = plan.target
            amount_sofar =plan.amount_saved
            debit_frequency = plan.autodebit

            if datetime.now().date() == charge_date.date():
                try:
                    token = Token.objects.filter(user=user).last()
                except Token.DoesNotExist:
                    token = None
                if token:
                    fore_action = FlutterWorkerAPII(
                        token=str(token),
                        email=str(user),
                        currency=currency,
                        country=country,
                        amount=amount
                    )
                    action = fore_action.directCardCharge()
                    print(action)
                    then = rave.Card.verify(action)
                    if then["transactionComplete"]:
                        action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        action_amount = Decimal("{:.2f}".format(then["amount"]))
                        action = Wallet().deposit(
                            wallet_id=wallet,
                            deposited_by=user,
                            amount=action_amount,
                            asof=action_time

                        )
                        action2 = Wallet().rentp_dr(
                            wallet_id=wallet,
                            debited_from=user,
                            amount=action_amount,
                            asof=action_time
                        )
                        plan.amount_saved = amount_sofar + action_amount
                        plan.percentage_completion = ((amount_sofar + action_amount)/target_amount)*100
                        if debit_frequency == "Daily":
                            plan.next_deduction_date = charge_date + timedelta(days=1)
                        if debit_frequency == "Weekly":
                            plan.next_deduction_date = charge_date + timedelta(days=7)
                        if debit_frequency == "Monthly":
                            plan.next_deduction_date = charge_date + timedelta(days=30)

                        plan.save(update_fields=[
                            "amount_saved",
                            "percentage_completion",
                            "next_deduction_date"
                        ])


                        return Response({
                            "status": "success",
                            "message": "Payment successful",
                            "errros": serializer.errors
                        }, status=status.HTTP_200_OK)

                    else:
                        return Response({
                            "status": "failed",
                            "message": "Error validating transaction",
                            "errros": serializer.errors
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({
                        "status": "failed",
                        "message": "No card available",
                        "errros": serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "status": "success",
                    "message": "Start date in future",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK)

        else:
            return Response({
                "status": "failed",
                "message": "No Plan found",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)



class TargetSavingContribAPI(APIView):
    """
    Trigers Rave Charge-With-Token(amount = user preferred) 
    for savings towards  Target savings target amount
    
    This api is basically called when a new plan is created checking
    if startdate is datetime.now().date() to make initial debit otherwise
    routine jobs is used to debit subsequently
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = TargetSavingContribSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        country = 'NG'
        currency = 'NGN'
        amount = details["amount"]

        
        plan = TargetSaving.objects.filter(owner=user).last()
        if plan:
            charge_date = plan.next_deduction_date
            target_amount = plan.target
            amount_sofar =plan.amount_saved
            debit_frequency = plan.autodebit

            if datetime.now().date() == charge_date.date():
                try:
                    token = Token.objects.filter(user=user).last()
                except Token.DoesNotExist:
                    token = None
                if token:
                    fore_action = FlutterWorkerAPII(
                        token=str(token),
                        email=str(user),
                        currency=currency,
                        country=country,
                        amount=amount
                    )
                    action = fore_action.directCardCharge()
                    #
                    then = rave.Card.verify(action)
                    if then["transactionComplete"]:
                        action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        action_amount = Decimal("{:.2f}".format(then["amount"]))
                        action = Wallet().deposit(
                            wallet_id=wallet,
                            deposited_by=user,
                            amount=action_amount,
                            asof=action_time

                        )
                        action2 = Wallet().target_dr(
                            wallet_id=wallet,
                            debited_from=user,
                            amount=action_amount,
                            asof=action_time
                        )
                        plan.amount_saved = amount_sofar + action_amount
                        plan.percentage_completion = ((amount_sofar + action_amount)/target_amount)*100
                        if debit_frequency == "Daily":
                            plan.next_deduction_date = charge_date + timedelta(days=1)
                        if debit_frequency == "Weekly":
                            plan.next_deduction_date = charge_date + timedelta(days=7)
                        if debit_frequency == "Monthly":
                            plan.next_deduction_date = charge_date + timedelta(days=30)

                        plan.save(update_fields=[
                            "amount_saved",
                            "percentage_completion",
                            "next_deduction_date"
                        ])


                        return Response({
                            "status": "success",
                            "message": "Payment successful",
                            "errros": serializer.errors
                        }, status=status.HTTP_200_OK)

                    else:
                        return Response({
                            "status": "failed",
                            "message": "Error validating transaction",
                            "errros": serializer.errors
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({
                        "status": "failed",
                        "message": "No card available",
                        "errros": serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "status": "success",
                    "message": "Start date in future",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK)

        else:
            return Response({
                "status": "failed",
                "message": "No Plan found",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)



class FixedDepositAPI(APIView):
    """
    Trigers Rave Charge-With-Token(amount = user preferred) 
    for fixed deposit amount
    
    This api is basically called when a new plan is created. 
    Checks if  debit/startdate is datetime.now.date() and debits
    amount to be fixed and sets next deduction date to none
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = FixedDepositSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        country = 'NG'
        currency = 'NGN'
        amount = details["amount"]

        #why not 'try and except' instead of an aftermath 'if' condition
        plan = FixedDeposit.objects.filter(owner=user).last()
        if plan:
            charge_date = plan.next_deduction_date
            plan_amount = plan.amount_planned
            amount_deposited =plan.amount_received

            if datetime.now().date() == charge_date.date():
                try:
                    token = Token.objects.filter(user=user).last()
                except Token.DoesNotExist:
                    token = None
                if token:
                    fore_action = FlutterWorkerAPII(
                        token=str(token),
                        email=str(user),
                        currency=currency,
                        country=country,
                        amount=amount
                    )
                    action = fore_action.directCardCharge()
                    #
                    print(action)
                    then = rave.Card.verify(action)
                    if then["transactionComplete"]:
                        print(then["amount"])
                        action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        action_amount = Decimal("{:.2f}".format(then["amount"]))
                        print(action_amount)
                        action = Wallet().deposit(
                            wallet_id=wallet,
                            deposited_by=user,
                            amount=action_amount,
                            asof=action_time

                        )
                        action2 = Wallet().fixed_dr(
                            wallet_id=wallet,
                            debited_from=user,
                            amount=action_amount,
                            asof=action_time
                        )
                        plan.amount_received = amount_deposited + action_amount
                        plan.next_deduction_date = ""
                       
                        plan.save(update_fields=[
                            "amount_received",
                            "next_deduction_date"
                        ])


                        return Response({
                            "status": "success",
                            "message": "Payment successful",
                            "errros": serializer.errors
                        }, status=status.HTTP_200_OK)

                    else:
                        return Response({
                            "status": "failed",
                            "message": "Error validating transaction",
                            "errros": serializer.errors
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({
                        "status": "failed",
                        "message": "No card available",
                        "errros": serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "status": "success",
                    "message": "Start date in future",
                    "errros": serializer.errors
                }, status=status.HTTP_200_OK)

        else:
            return Response({
                "status": "failed",
                "message": "No Fixed/Investment plan found",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class WithdrawalAPI(APIView):
    """
    Get bank details from profile
    Get data from serializer
    Call worker api III
    withdraw
    .fetch to verify sent. 
    Deduct from user account
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        serializer = WithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank  = serializer.data

        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = None
        if profile:
            fore_action = FlutterWorkerAPIII(profile.bank_name, profile.bank_account, data_bank["amount"], profile.full_name)
            action = fore_action.withdraw()
            if action["error"] == False:
                then = rave.Transfer.fetch(action["data"]["reference"])
                if then["error"] == False and action["data"]["status"] != "FAILED":
                    action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                    action_amount = Decimal("{:.2f}".format(float(data_bank["amount"])))
                    action2 = Wallet().withdraw(
                        wallet_id=wallet,
                        withdrawn_by=user,
                        amount=action_amount,
                        asof=action_time
                    )
                    return Response({
                                "status": "success",
                                "message": "Withdraw successful",
                                "errros": serializer.errors
                            }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "status": "failed",
                        "message": "Error validating transaction",
                        "errros": serializer.errors
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                            "status": "failed",
                            "message": "Error processing request",
                            "errors": serializer.errors
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        else:
            return Response({
                "status": "failed",
                "message": "No bank profile available",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            



class SmartTransferAPI(APIView):
    """
    Send money from one user wallet to another wallet or request a
    transfer to bank
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = SmartTransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data

        if data_bank["destination"] == "Vault":
            user = self.request.user
            wallet1 = self.request.user.wallets.wallet_id
            receiver = data_bank["wallet_id"]
            amount = data_bank["amount"]
            source = data_bank["source"]
            try:
                wallet2 = Wallet.objects.get(wallet_id=receiver)
            except Wallet.DoesNotExist:
                return Response({
                    "status": "failed",
                    "message": "Receiver details error",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            wallet2_user = wallet2.user

            if data_bank["source"] == "Vault Wallet":
                try:
                    action = Wallet.smart_transfer(
                        wallet_id1=wallet1,
                        transferred_by=user,
                        wallet_id2=wallet2,
                        received_by=wallet2_user,
                        amount= Decimal("{:.2f}".format(float(amount))),
                        asof= str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                    )
                except UserDoesNotExist:
                    action = None
                    return Response({
                    "status": "failed",
                    "message": "User ID not registered",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

                except InsufficientFunds:
                    action = None

                    return Response({
                    "status": "failed",
                    "message": "Insufficient Funds, Transfer Cannot be completed",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

                except InvalidAmount:
                    action = None

                    return Response({
                    "status": "failed",
                    "message": "Intended transfer not processable",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

                if action:
                    return Response({
                        "status": "success",
                        "message": "Smart transfer successful",
                        "errros": serializer.errors
                    }, status=status.HTTP_200_OK)

            elif data_bank["source"]  == "Debit Card":
                country = 'NG'
                currency = 'NGN'
                try:
                    token = Token.objects.filter(user=user).last()
                except Token.DoesNotExist:
                    token = None
                if token:
                    fore_action = FlutterWorkerAPII(
                        token=str(token),
                        email=str(user),
                        currency=currency,
                        country=country,
                        amount=amount
                    )
                    action = fore_action.directCardCharge()
                    #
                    then = rave.Card.verify(action)
                    if then["transactionComplete"]:
                        action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        action_amount = Decimal("{:.2f}".format(then["amount"]))
                        action = Wallet().deposit(
                            wallet_id=wallet1,
                            deposited_by=user,
                            amount=action_amount,
                            asof=action_time

                        )
                        try:
                            action2 = Wallet().smart_transfer(
                                wallet_id1=wallet1,
                                transferred_by=user,
                                wallet_id2=wallet2,
                                received_by=wallet2_user,
                                amount= Decimal("{:.2f}".format(float(amount))),
                                asof= str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                            )
                        except UserDoesNotExist:
                            action2 = None
                            return Response({
                            "status": "failed",
                            "message": "User ID not registered",
                            "errors": serializer.errors
                        }, status=status.HTTP_400_BAD_REQUEST)

                        except InvalidAmount:
                            action2 = None

                            return Response({
                            "status": "failed",
                            "message": "Intended transfer not processable",
                            "errors": serializer.errors
                        }, status=status.HTTP_400_BAD_REQUEST)

                        if action2:
                            return Response({
                                "status": "success",
                                "message": "Smart transfer successful",
                                "errros": serializer.errors
                            }, status=status.HTTP_200_OK)

        elif data_bank["destination"] == "Bank":
            user = self.request.user
            wallet = self.request.user.wallets.wallet_id
            balance = self.request.user.wallets.balance
            receiver_bank_name = data_bank["bank_name"]
            receiver_bank_account = data_bank["bank_account"]
            receiver_fullname = data_bank["full_name"]
            amount = data_bank["amount"]
            source = data_bank["source"]

            if source == "Vault Wallet":
                if Decimal("{:.2f}".format(float(data_bank["amount"]))) <= balance:
                    fore_action = FlutterWorkerAPIII(receiver_bank_name, receiver_bank_account, amount, receiver_fullname)
                    action = fore_action.withdraw()
                    print(action)
                    if action["error"] == False:
                        then = rave.Transfer.fetch(action["data"]["reference"])
                        #print(action)
                        #print(then)
                        if then["error"] == False and action["data"]["status"] != "FAILED":
                            action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                            action_amount = Decimal("{:.2f}".format(float(data_bank["amount"])))
                            action2 = Wallet().transfer_bank(
                                wallet_id=wallet,
                                transferred_by=user,
                                amount=action_amount,
                                asof=action_time,
                                meta_info= "A wallet to bank transfer:: From {}, transferred by {} to bank details: Bank Name: {}, Bank Account: {}, Account Holder name: {}".format(str(wallet),str(user), receiver_bank_name, receiver_bank_account, receiver_fullname)

                            )
                            return Response({
                                        "status": "success",
                                        "message": "Withdraw successful",
                                        "errros": serializer.errors
                                    }, status=status.HTTP_200_OK)
                        else:
                            return Response({
                                "status": "failed",
                                "message": "Error validating transaction",
                                "errros": serializer.errors
                            }, status=status.HTTP_404_NOT_FOUND)
                    else:
                        return Response({
                            "status": "failed",
                            "message": "Error processing request",
                            "errors": serializer.errors
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({
                        "status": "failed",
                        "message": "Insufficient funds",
                        "errors": serializer.errors
                    }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

            elif source == "Debit Card":
                country = 'NG'
                currency = 'NGN'
                try:
                    token = Token.objects.filter(user=user).last()
                except Token.DoesNotExist:
                    token = None
                if token:
                    fore_action = FlutterWorkerAPII(
                        token=str(token),
                        email=str(user),
                        currency=currency,
                        country=country,
                        amount=amount
                    )
                    action = fore_action.directCardCharge()
                    #
                    then = rave.Card.verify(action)
                    if then["transactionComplete"]:
                        action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                        action_amount = Decimal("{:.2f}".format(then["amount"]))
                        action = Wallet().deposit(
                            wallet_id=wallet1,
                            deposited_by=user,
                            amount=action_amount,
                            asof=action_time

                        )

                        fore_action2= FlutterWorkerAPIII(receiver_bank_name, receiver_bank_account, amount, receiver_fullname)
                        action3 = fore_action2.withdraw()
                        then2 = rave.Transfer.fetch(action3)
                        if then2["error"] == False and  action3["data"]["status"] != "FAILED":
                            action4 = Wallet.transfer_bank(
                                wallet_id=wallet,
                                transferred_by=user,
                                amount=action_amount,
                                asof=action_time,
                                meta_info= "A wallet to bank transfer:: From {}, transferred by {} to bank details: Bank Name: {}, Bank Account: {}, Account Holder name: {}".format(str(wallet),str(user), receiver_bank_name, receiver_bank_account, receiver_fullname)
                            )
                            return Response({
                                "status": "success",
                                "message": "Smart transfer successful",
                                "errros": serializer.errors
                            }, status=status.HTTP_200_OK)
                        else:
                            return Response({
                                "status": "failed",
                                "message": "Error validating transaction",
                                "errros": serializer.errors
                            }, status=status.HTTP_404_NOT_FOUND)
                    else:
                        return Response({
                            "status": "failed",
                            "message": "Error validating transaction",
                            "errros": serializer.errors
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({
                        "status": "failed",
                        "message": "No linked Card found",
                        "errros": serializer.errors
                    }, status=status.HTTP_404_NOT_FOUND)
                
                


class LittleDropsWithdrawAPI(APIView):
    """
    Transfers from little drops savings amount to Wallet Balance
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = LittleDropsWithdrawSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data

        transfer_request_amount  = Decimal("{:.2f}".format(float(data_bank["amount"])))
        user = self.request.user
        wallet = self.request.user.wallets.wallet_id
        user_plan = LittleDrops.objects.get(owner=user)
        amount_sofar = user_plan.amount_saved
        #
        #on Little Drops: "Action1"
        new_balance = amount_sofar - transfer_request_amount
        user_plan.amount_saved = new_balance
        user_plan.last_action = "down"
        user_plan.save(update_fields = [
            "amount_saved",
            "last_action"
        ])

        #on Wallet: "Action2"
        action2 = Wallet.little_cr(
            wallet_id=wallet,
            received_by=user,
            amount=transfer_request_amount,
            asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),

        )

        return Response({
          "status": "success",
          "message": "Withdraw to Wallet success"
        }, status=status.HTTP_200_OK)


class LittleDripDropAPI(APIView):
    """
    Add to Little drop balance from wallet or card

    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = LittleDripDropSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data

        drop_request_amount = Decimal("{:.2f}".format(float(data_bank["amount"])))
        user = self.request.user
        user_plan = LittleDrops.objects.get(owner=user)
        amount_sofar = user_plan.amount_saved
        drip_drop_frequency = user_plan.drop_frequency
        all_time_drip_drop = user_plan.all_time_drop
        average_drip_drop = user_plan.average_deposit


        
        
        if data_bank["source"] == "Vault Wallet":
            wallet = self.request.user.wallets.wallet_id
            wallet_balance = self.request.user.wallets.balance

            assert wallet_balance >= drop_request_amount, Response({"status": "failed", "message": "Balance insufficient"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            
            #on Little Drops: "Action1"
            new_balance = amount_sofar + drop_request_amount
            user_plan.amount_saved = new_balance
            user_plan.last_action = "up"
            user_plan.drop_frequency = drip_drop_frequency + 1
            user_plan.all_time_drop = int(all_time_drip_drop + float(data_bank["amount"]))
            #
            new_avg = little_drops_average((float(average_drip_drop) + float(data_bank["amount"])), (drip_drop_frequency + 1) )
            user_plan.average_deposit = Decimal("{:.2f}".format(float(new_avg)))
            user_plan.last_drop_date = str(datetime.now().date().strftime("%Y-%m-%d"))

            user_plan.save(update_fields =[
                "amount_saved",
                "last_action",
                "drop_frequency",
                "all_time_drop",
                "average_deposit",
                "last_drop_date"
            ])

            #on Wallet: "Action2"
            action2 = Wallet.little_dr(
                wallet_id=wallet,
                debited_from=user,
                amount=drop_request_amount,
                asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            )

            return Response({
                "status": "success",
                "message": "drip..drip..drop!"
                }, status=status.HTTP_200_OK)

        elif data_bank["source"] == "Debit Card":
            wallet = self.request.user.wallets.wallet_id

            country = 'NG'
            currency = 'NGN'
            try:
                token = Token.objects.filter(user=user).last()
            except Token.DoesNotExist:
                token = None
            if token:
                fore_action = FlutterWorkerAPII(
                    token=str(token),
                    email=str(user),
                    currency=currency,
                    country=country,
                    amount=data_bank["amount"]
                )
                action = fore_action.directCardCharge()
                print(action)
                then = rave.Card.verify(action)
                if then["transactionComplete"]:
                    action_time = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                    action_amount = Decimal("{:.2f}".format(then["amount"]))
                    action = Wallet().deposit(
                        wallet_id=wallet,
                        deposited_by=user,
                        amount=action_amount,
                        asof=action_time

                    )
                    action2 = Wallet().little_dr(
                        wallet_id=wallet,
                        debited_from=user,
                        amount=action_amount,
                        asof=action_time
                    )

                    #Action on Little Drops: "Action3"
                    new_balance = amount_sofar + drop_request_amount
                    user_plan.amount_saved = new_balance
                    user_plan.last_action = "up"
                    user_plan.drop_frequency = drip_drop_frequency + 1
                    user_plan.all_time_drop = int(all_time_drip_drop + float(data_bank["amount"]))
                    #
                    new_avg = little_drops_average((float(average_drip_drop) + float(data_bank["amount"])), (drip_drop_frequency + 1) )
                    user_plan.average_deposit = Decimal("{:.2f}".format(float(new_avg)))
                    user_plan.last_drop_date = str(datetime.now().date().strftime("%Y-%m-%d"))

                    user_plan.save(update_fields =[
                        "amount_saved",
                        "last_action",
                        "drop_frequency",
                        "all_time_drop",
                        "average_deposit",
                        "last_drop_date"
                    ])


                    return Response({
                        "status": "success",
                        "message": "drip..drip..drop!"
                    }, status=status.HTTP_200_OK)

                else:
                    return Response({
                        "status": "failed",
                        "message": "Error validating transaction",
                        "errros": serializer.errors
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                    "status": "failed",
                    "message": "No card available",
                    "errros": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            





