from rest_framework import serializers
from .models import Applications


class BankAccountValidateSerializer(serializers.Serializer):
    bankName = serializers.CharField()
    bankAccount = serializers.CharField()

    def worker(self, data):
        details = {**data}
        return details

# Loan Application Serializer


class LoanApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Applications
        fields = "__all__"


class LoanResolverSerializer(serializers.Serializer):
    repayment_even = serializers.BooleanField()
    status = serializers.CharField()
