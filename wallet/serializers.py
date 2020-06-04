from rest_framework import serializers
from .models import Wallet, Action
from django.apps import apps

# Wallet Serializer


class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet()
        fields = '__all__'


# Action Serializer
class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = '__all__'


class DepositSerializer(serializers.Serializer):
    send_fund = serializers.BooleanField()
    amount = serializers.CharField()


class ResolveLoanSerializer(DepositSerializer):
    """
    ResolveLoan requires similar value input as Deposit serializer
    however with different end points.
    """


class RentPlusContribSerializer(DepositSerializer):
    """
    RentPlusContrib requires similar value input as Deposit serializer
    however with different end points.
    """


class TargetSavingContribSerializer(DepositSerializer):
    """
   Target Savings requires similar value input as Deposit serializer
   however with different end points.
   """


class FixedDepositSerializer(DepositSerializer):
    """
    Fixed Deposit requires similar value input as Deposit serializer
    however with different end points.
    """


class WithdrawalSerializer(DepositSerializer):
    """
    Requires similar input as Deposit serializer, Withdrawal destination bank is
    already stored in User's profile.
    """


class SmartTransferSerializer(serializers.Serializer):
    send_fund = serializers.BooleanField()
    destination = serializers.CharField()
    amount = serializers.CharField()
    source = serializers.CharField()
    wallet_id = serializers.CharField()
    bank_account = serializers.CharField()
    bank_name = serializers.CharField()
    full_name = serializers.CharField()


class LittleDropsWithdrawSerializer(DepositSerializer):
    """
    Requires similar input as Deposit serializer
    Working with LittleDropsWithdraw will allow user
    withdraw from their Littledrops savings
    """


class LittleDripDropSerializer(DepositSerializer):
    """
    Requires similar input as Deposit serializer
    Working with LittleDropsWithdraw will allow user
    add to from their Littledrops savings directly
    from wallet balance or linked card
    """
    source = serializers.CharField()
