import phonenumbers
from phonenumbers import carrier


def check_number(number):
    country_format = phonenumbers.format_number(phonenumbers.parse(
        number, "NG"), phonenumbers.PhoneNumberFormat.INTERNATIONAL)
    number_profile = phonenumbers.parse(country_format, "NG")
    telco = repr(carrier.name_for_number(number_profile, "en"))

    return telco.strip("\'")


def check_name(name):
    if not "" in name:
        return False
    else:
        return True
