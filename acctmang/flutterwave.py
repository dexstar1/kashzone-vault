import requests
import os
import hashlib
import warnings
import json
import base64
from Crypto.Cipher import DES3
from time import sleep

from rave_python import Rave
from rave_python import RaveExceptions
import re
import os


# Check Card Type Function
def checkCardType(number):
    if re.search(r"^4[0-9]{12}(?:[0-9]{3})?$", number):
        return "Visa"
    if re.search(r"^((506(0|1))|(507(8|9))|(6500))[0-9]{12,15}$", number):
        return "Verve"
    if re.search(r"^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$", number):
        return "Mastercard"


# Change rave PUBK and SECK to environment variables before shipping to production
rave = Rave("FLWPUBK-e493a4e1993e17d43ee86228f27b4298-X",
            "FLWSECK-e28de18ad4b44572d1fc2a8b12f44cee-X", usingEnv=False)


class FlutterWorkerAPI(object):
    def __init__(
        self,
        cardno,
        cvv,
        expirymonth,
        expiryyear,
        currency,
        country,
        amount,
        email,
        redirect_url,
        suggested_auth=None,
        pin=None,
        PBFPKey="FLWPUBK-e493a4e1013e17d43ee69228f27b4298-X",
    ):

        self.PBFPKey = PBFPKey
        self.cardno = cardno
        self.cvv = cvv
        self.expirymonth = expirymonth
        self.expiryyear = expiryyear
        self.currency = currency
        self.pin = pin
        self.country = country
        self.amount = amount
        self.email = email
        self.suggested_auth = suggested_auth
        self.redirect_url = redirect_url

    def pay_type1(self):
        # pay_type for Verve and MasterCard
        payload = {
            "cardno": self.cardno,
            "cvv": self.cvv,
            "expirymonth": self.expirymonth,
            "expiryyear": self.expiryyear,
            "currency": self.currency,
            "country": self.country,
            "suggested_auth": self.suggested_auth,
            "pin": self.pin,
            "amount": self.amount,
            "email": self.email,
            "redirect_url": self.redirect_url,
            "firstname": "None",
            "lastname": "None",
            "phonenumber": "None",
            "IP": "None",

        }
        try:
            res = rave.Card.charge(payload)
            transactionRef = res["flwRef"]
            if res["validationRequired"] and res["suggestedAuth"] == None and res["authUrl"] == None:
                try:
                    then = res["chargemessage"]
                    return {"response": True, "chargemessage": then, "Ref": transactionRef}
                except KeyError:
                    return {"response": True, "chargemessage": "Enter OTP sent to your Linked Phone Number", "Ref": transactionRef}

        except RaveExceptions.CardChargeError as e:
            return e.err["errMsg"] + ", Ref: " + e.err["flwRef"]

        except RaveExceptions.TransactionValidationError as e:
            return e.err + ", Ref: " + e.err["flwRed"]

        except RaveExceptions.TransactionVerificationError as e:
            return e.err["errMsg"] + ", Ref: " + e.err["txRef"]

    def pay_type2(self):
        # pay_type for Visa cards

        payload = {
            "PBFPKey": self.PBFPKey,
            "cardno": self.cardno,
            "cvv": self.cvv,
            "expirymonth": self.expirymonth,
            "expiryyear": self.expiryyear,
            "currency": self.currency,
            "country": self.country,
            "amount": self.amount,
            "email": self.email,
            "redirect_url": self.redirect_url,
            "firstname": "None",
            "lastname": "None",
            "phonenumber": "None",
            "IP": "None",

        }
        try:
            res = rave.Card.charge(payload)
            if res["validationRequired"] and res["suggestedAuth"] == "PIN":
                return {"response": "Enter Pin"}

            if res["validationRequired"] == True and res["suggestedAuth"] == None and res["authUrl"]:
                authUrl = res["authUrl"].replace(" ", "")
                cardNum = self.cardno[-4:]
                expiryMonth = self.expirymonth
                expiryYear = self.expiryyear[-2:]
                return {"response": "authUrl", "url": authUrl, "txRef": res["txRef"], "cnoit": cardNum, "monit": str(expiryMonth) + "," + str(expiryYear), "type": checkCardType(self.cardno)}

        except RaveExceptions.CardChargeError as e:
            return e.err["errMsg"] + ", Ref: " + e.err["flwRef"]

        except RaveExceptions.TransactionValidationError as e:
            return e.err + ", Ref: " + e.err["flwRed"]

        except RaveExceptions.TransactionVerificationError as e:
            return e.err["errMsg"] + ", Ref: " + e.err["txRef"]

    def vervemaction(self):
        self.pay_type1()

    def visaction(self):
        self.pay_type2()


class FlutterWorkerAPII(object):
    def __init__(self, token, amount, email, country, currency):
        self.token = token
        self.amount = amount
        self.email = email
        self.country = country
        self.currency = currency

    def directCardCharge(self):
        payload_for_saved_card = {
            "token": self.token,
            "currency": self.currency,
            "country": self.country,
            "amount": self.amount,
            "email": self.email,
            "firstname": "None",
            "lastname": "None",
            "IP": "None",
        }
        try:
            res = rave.Card.charge(
                payload_for_saved_card, chargeWithToken=True)
            if res["status"] == "success":
                return res["txRef"]

        except RaveExceptions.CardChargeError as e:
            return str(e.err["errMsg"]) + ", Ref: " + str(e.err["flwRef"])

        except RaveExceptions.TransactionValidationError as e:
            return str(e.err) + ", Ref: " + str(e.err["flwRef"])

        except RaveExceptions.TransactionVerificationError as e:
            return str(e.err["errMsg"]) + ", Ref: " + str(e.err["txRef"])


class FlutterWorkerAPIII(object):
    """
    For transfers to bank
    """

    def __init__(self, account_bank, account_number, amount, beneficiary_name):
        self.account_bank = account_bank
        self.account_number = account_number
        self.amount = amount
        self.beneficiary_name = beneficiary_name

    def withdraw(self):
        payload = {
            "account_bank": self.account_bank,
            "account_number": self.account_number,
            "amount": self.amount,
            "beneficiary_name": self.beneficiary_name,
            "narration": "Vault24 withdraw",
            "currency": "NGN"
        }
        try:
            res = rave.Transfer.initiate(payload)
            if res["error"] == False:
                return res
        except RaveExceptions.IncompletePaymentDetailsError as e:
            return e
        except RaveExceptions.InitiateTransferError as e:
            return e.err
        except RaveExceptions.TransferFetchError as e:
            return e.err
        except RaveExceptions.ServerError as e:
            return e.err
