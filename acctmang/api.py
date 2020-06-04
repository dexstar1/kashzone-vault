from vault.settings import EMAIL_HOST_USER
import re
from .errors import ErrorHandlingCard
from datetime import datetime
from wallet.models import Wallet
from .models import Token
from .flutterwave import FlutterWorkerAPI, rave
from .models import User, Profile
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
# ChargeTokenSerializer,
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, CardSerializer
from .serializers import TxRefSerializer, OTPSerializer, LinkedCardSerializer
from .serializers import EmailAuthSerializer, AuthCodeSerializer, PhonenumberValidateSerializer
from .serializers import LinkedBankSerializer, VaultFullnameSerializer, ProfileSerializer
from .models import EmailAuth
import random
#from django.core.mail import send_mail
from vault.mailer import Mailer
mail = Mailer()


# Check Card Type Function

def checkCardType(number):
    if re.search(r"^4[0-9]{12}(?:[0-9]{3})?$", number):
        return "Visa"
    if re.search(r"^((506(0|1))|(507(8|9))|(6500))[0-9]{12,15}$", number):
        return "Verve"
    if re.search(r"^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$", number):
        return "Mastercard"


# REGISTER API


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        AuthToken_Query = str(AuthToken.objects.create(user))
        AuthToken_Query = AuthToken_Query[1:][:-1]
        AuthToken_Query = AuthToken_Query.split()
        Auth_token = AuthToken_Query[4].strip("\'")

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": Auth_token
        })

# LOGIN API


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        AuthToken_Query = str(AuthToken.objects.create(user))
        AuthToken_Query = AuthToken_Query[1:][:-1]
        AuthToken_Query = AuthToken_Query.split()
        Auth_token = AuthToken_Query[4].strip("\'")

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": Auth_token
        })

# GET USER API


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class VaultFullnameAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = VaultFullnameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data["phone_number"]

        try:
            user = User.objects.filter(phone_number=phone_number).values()
        except User.DoesNotExist:
            user = None
        if user:
            full_name = user[0]["fullname"]
            return Response({
                "status": "ok",
                "fullName": full_name
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": "failed",
                "message": "User not registered",
                "errors": serializer.errors
            }, status=status.HTTP_406_NOT_ACCEPTABLE)

# PHONE NUMBER VALIDATE API


class PhonenumberValidateAPI(APIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = PhonenumberValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data["phone_number"]

        if User.objects.filter(phone_number=phone_number):
            return Response({
                "status":  "failed",
                "message": "Phone Number already registered",
                "errors": serializer.errors
            }, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({
                "status": "ok",
                "message": "Phone number unique"
            },
                status=status.HTTP_200_OK
            )

# Email AUth API


class EmailAuthAPI(APIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = EmailAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email_id = serializer.data["email"]
        auth_code = random.randrange(11234, 99000)

        if User.objects.filter(email=email_id):
            return Response({
                "status":  "failed",
                "message": "User already exist",
                "errors": serializer.errors
            }, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:

            action1 = EmailAuth(
                email=email_id,
                auth_code=auth_code
            )
            action1.save()
            action2 = mail.send_messages(
                subject=" Vault24 Activation code",
                template="emails/activation_code.html",
                context={'email_id': email_id, "auth_code": auth_code},
                to_emails=[email_id]
            )
            return Response({
                "status": "success",
                "message": "Success Auth code "
            },
                status=status.HTTP_200_OK
            )


class AuthCodeAPI(APIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, *args, **kwargs):
        serializer = AuthCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_code = serializer.data["verify"]
        email = serializer.data["email"]
        try:
            user = EmailAuth.objects.filter(email=email).last()
        except EmailAuth.DoesNotExist:
            user = None
        if user:
            if user.auth_code == auth_code:
                return Response({"status":  "success",
                                 "message": "Success Auth code "
                                 }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status":  "failed",
                    "message": "Auth code incorrect",
                    "errors": serializer.errors
                }, status=status.HTTP_406_NOT_ACCEPTABLE)

        else:
            return Response({
                "status": "lookup error",
                "message": "Email not recognized",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


# COMPLETE PROFILE: MAIN DETAILS API
class ProfileAPI(APIView):
    """
    This is the API object updating a user profile. Even though bank details
    is contained in Profile; a different api and serializer is employed to update
    it.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, format=None):
        user = self.request.user
        return Response(Profile.objects.filter(user=user).values())

    def post(self, request, *args, **kwargs):
        serializer = ProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user

        data_bank = serializer.data
        # try here
        action = Profile.objects.get(user=user)
        #
        action.primary_email = data_bank["email"]
        action.phone_number = data_bank["phoneNumber"]
        action.gender = data_bank["gender"]
        action.income_range = data_bank["incomeRange"]
        action.employment_status = data_bank["employmentStatus"]
        action.relationship_status = data_bank["relationshipStatus"]
        action.birthday = data_bank["birthday"][:-10]

        action.save(update_fields=[
            "primary_email",
            "phone_number",
            "gender",
            "income_range",
            "employment_status",
            "relationship_status",
            "birthday"
        ])

        return Response({
            "status": "success",
            "message": "Profile Update success"
        }, status=status.HTTP_200_OK)


# ADD CARD API
class CardAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    #serializer_class = CardSerializer

    def post(self, request, *args, **kwargs):
        #serializer = self.get_serializer(data=request.data)
        serializer = CardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        carddetails = serializer.data

        user = self.request.user
        country = 'NG'
        currency = 'NGN'
        suggested_auth = 'PIN'
        amount = 10
        redirect_url = 'http://127.0.0.1:8000'

        if carddetails["pin"] != "":
            fore_action = FlutterWorkerAPI(
                cardno=carddetails["cardno"],
                cvv=carddetails["cvv"],
                expirymonth=carddetails["expirymonth"],
                expiryyear=carddetails["expiryyear"],
                pin=carddetails["pin"],
                currency=currency,
                country=country,
                suggested_auth=suggested_auth,
                amount=amount,
                email=str(user),
                redirect_url=redirect_url
            )
            # Make sure to catch error here
            action = fore_action.pay_type1()
        else:
            fore_action = FlutterWorkerAPI(
                cardno=carddetails["cardno"],
                cvv=carddetails["cvv"],
                expirymonth=carddetails["expirymonth"],
                expiryyear=carddetails["expiryyear"],
                currency=currency,
                country=country,
                amount=amount,
                email=str(user),
                redirect_url=redirect_url
            )

            action = fore_action.pay_type2()

        return Response(action)

# GET CARD-AUTH TOKEN API


"""
class ChargeTokenAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
        # is-admin --may be preferred
    ]
    serializer_class = ChargeTokenSerializer

    def get_object(self):
        return self.request.user.token
"""
# Validate Transaction with OTP


class OTPAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = OTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id

        otp = data_bank["otp"]
        ref = data_bank["transref"]
        card_number = data_bank["cardno"]
        expiry_month = data_bank["expirymonth"]
        expiry_year = data_bank["expiryyear"]
        card_type = checkCardType(card_number)

        res = rave.Card.validate(ref, otp)
        if res["status"] == "success":
            then = rave.Card.verify(res["txRef"])
            if then["transactionComplete"]:
                card_token = then["cardToken"]
                amount = then["amount"]
                #
                action = Wallet().deposit(
                    wallet_id=wallet,
                    deposited_by=user,
                    amount=amount,
                    asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
                )
            action2 = Token(user=user, card_type=card_type,
                            card_number=card_number[-4:], expiry_month=expiry_month, expiry_year=expiry_year[-2:], charge_token=card_token)
            action2.save()

            return Response({
                "status":  "success",
                "message": "Success Auth code "
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": "failed",
                "message": "otp error",
                "errros": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


# CHECK TXREF
class TxrefAPI(APIView):
    """
    API view to verify visa card trasaction
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        serializer = TxRefSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data_bank = serializer.data
        txref = data_bank["txref"]
        card_number = data_bank["card_number"]
        expiry = data_bank["expiry_date"].split(",")
        expiry_month = expiry[0]
        expiry_year = expiry[1]
        card_type = data_bank["card_type"]

        user = self.request.user
        wallet = self.request.user.wallets.wallet_id

        res = rave.Card.verify(txref)
        amount = res["amount"]
        card_token = res["cardToken"]

        if res["transactionComplete"]:
            action = Wallet().deposit(
                wallet_id=wallet,
                deposited_by=user,
                amount=amount,
                asof=str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            )
            action2 = Token(user=user, card_type=card_type, card_number=card_number,
                            expiry_month=expiry_month, expiry_year=expiry_year, charge_token=card_token)
            action2.save()
            return Response({
                "status":  "success",
                "message": "Success Auth code "
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "status": "failed",
                "message": "Error linking card",
                "errros": ErrorHandlingCard("Error linking card")
            }, status=status.HTTP_412_PRECONDITION_FAILED)


class LinkedCardViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = LinkedCardSerializer

    def get_queryset(self):
        return self.request.user.tokens.all()


class LinkedBankAPI(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, format=None):
        return Response(Profile.objects.filter(user=self.request.user).values())

    def post(self, request, *args, **kwargs):
        serializer = LinkedBankSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        data_bank = serializer.data
        action = Profile.objects.get(user=user)
        action.bank_name = data_bank["bank_name"]
        action.bank_account = data_bank["bank_account"]
        action.full_name = data_bank["full_name"]

        action.save(update_fields=[
            "bank_name",
            "bank_account",
            "full_name"
        ])

        return Response(Profile.objects.filter(user=self.request.user).values())
