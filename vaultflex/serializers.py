from rest_framework import serializers
from .models import Rentplus, TargetSaving, FixedDeposit, LittleDrops

# RentPlus serializer


class RentplusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rentplus
        fields = "__all__"


# Target Savings serializer
class TargetSavingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetSaving
        fields = "__all__"

# Fixed Deposit serializer


class FixedDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedDeposit
        fields = "__all__"


# Little Drops
class LittleDropsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LittleDrops
        fields = "__all__"


class PlanLiquidateSerializer(serializers.Serializer):
    plan_name = serializers.CharField()
    ref_number = serializers.CharField()
