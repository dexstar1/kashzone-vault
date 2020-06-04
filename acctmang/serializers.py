from rest_framework import serializers
from .models import User, Token, Profile
from django.contrib.auth import authenticate

# USER SERIALIZER


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('phone_number', 'fullname', 'email')


class VaultFullnameSerializer(serializers.Serializer):
    phone_number = serializers.CharField()


# REGISTER SERIALIZER


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('phone_number', 'fullname', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['phone_number'], validated_data['fullname'], validated_data['email'], validated_data['password']
        )
        return user

# LOGIN SERIALIZER


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        else:
            raise serializers.ValidationError("Incorrect login credentials")


# VALIDATE PHONE NUMBER IS UNIQUE
class PhonenumberValidateSerializer(serializers.Serializer):
    phone_number = serializers.CharField()


# EMAIL AUTH SERIALIZER


class EmailAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def worker(self, data):
        details = {**data}
        return details

# AUTH CODE SERIALIZER


class AuthCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verify = serializers.CharField()

    def worker(self, data):
        details = {**data}
        return details


# USER PROFILE
class ProfileSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phoneNumber = serializers.CharField()
    gender = serializers.CharField()
    incomeRange = serializers.CharField()
    employmentStatus = serializers.CharField()
    relationshipStatus = serializers.CharField()
    birthday = serializers.DateTimeField()


# ADD CARD

class CardSerializer(serializers.Serializer):
    cardname = serializers.CharField()
    cardno = serializers.CharField()
    cvv = serializers.CharField()
    expirymonth = serializers.CharField()
    expiryyear = serializers.CharField()
    pin = serializers.CharField(allow_blank=True)
    #currency = serializers.CharField()
    #country = serializers.CharField()
    #amount = serializers.CharField()
    #email = serializers.EmailField()
    #suggested_auth = serializers.CharField(allow_blank=True)
    #redirect_url = serializers.CharField()

    def worker(self, data):
        details = {**data}
        return details

# Check TxRef for Visa


class TxRefSerializer(serializers.Serializer):
    """
    Checks and Verify txref success for Visa Card.
    Master Card and Verve cards are verified in the OTPAPI
    """

    txref = serializers.CharField()
    card_number = serializers.CharField()
    expiry_date = serializers.CharField()
    card_type = serializers.CharField()


"""
# CARD AUTH-CHARGE TOKEN
class ChargeTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ("charge_token",)

    def create(self, ctoken):
        token = Token.objects.create(charge_token=ctoken)
        return token

    # Function to Catch error when user has no token--
"""

# Push Otp


class OTPSerializer(serializers.Serializer):
    otp = serializers.CharField()
    transref = serializers.CharField()
    cardno = serializers.CharField()
    expirymonth = serializers.CharField()
    expiryyear = serializers.CharField()

# Linked Cards


class LinkedCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ("card_type", "card_number", "expiry_month", "expiry_year")


class LinkedBankSerializer(serializers.Serializer):
    # A ModelSerializer working with a modelViewset could have
    # worked better but i can't figure out my way around
    # updating a model via Model Viewset yet.
    bank_name = serializers.CharField()
    bank_account = serializers.CharField()
    full_name = serializers.CharField()
