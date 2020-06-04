from django.db import models

from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from .checkers import check_number, check_name
from django.db.models.signals import post_save
from wallet.models import Wallet
import datetime
from autoslug import AutoSlugField
from django.urls import reverse


BANK = (
    ("044", "Access Bank"),
    ("063", "Access Bank Diamond"),
    ("050", "Ecobank"),
    ("070", "Fidelity Bank"),
    ("011", "First Bank"),
    ("214", "FCMB"),
    ("058", "GTB"),
    ("030", "Heritage Bank"),
    ("082", "Keystone"),
    ("076", "Polaris (Skye Bank)"),
    ("221", "Stanbic IBTC"),
    ("232", "Sterling Bank"),
    ("032", "Union Bank"),
    ("215", "Unity Bank"),
    ("035", "Wema Bank"),
    ("057", "Zenith Bank"),
)

GENDER = (
    ("male", "MALE"),
    ("female", "FEMALE")
)

INCOMERANGE = (
    ("below31k", "BELOW ₦31,000"),
    ("31-50k", "BETWEEN ₦31,000 & ₦50,000"),
    ("50-80k", "BETWEEN ₦50,000 & ₦80,000"),
    ("80-100k", "BETWEEN ₦80,000 & ₦100K"),
    ("100-150k", "BETWEEN ₦100K & ₦150K"),
    ("250-500k", "BETWEEN ₦250K & 500K"),
    ("500-1m", "BETWEEN ₦500K & 1M"),
    ("above1m", "ABOVE 1M")
)

EMPLOYMENTSTATUS = (
    ("employed", "EMPLOYED"),
    ("selfEmployed", "SELF-EMPLOYED"),
    ("retired", "RETIRED"),
    ("unemployed", "UNEMPLOYED"),
    ("student", "STUDENT")
)

RELATIONSHIPSTATUS = (
    ("single", "SINGLE"),
    ("married", "MARRIED")
)


class UserAccountManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, phone_number, fullname, email, password, **extra_fields):
        check_phone_number = check_number(phone_number)
        check_fullname = check_name(fullname)
        if not check_phone_number:
            raise ValueError("Valid phone number should be provided")
        if not check_fullname:
            raise ValueError("First name and last name required")
        if not email:
            raise ValueError('Email address must be provided')
        if not password:
            raise ValueError('Password must be provided')

        email = self.normalize_email(email)
        user = self.model(phone_number=phone_number, fullname=fullname,
                          password=password, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, phone_number=None, fullname=None, email=None, password=None, **extra_fields):
        return self._create_user(phone_number, fullname, email, password, **extra_fields)

    def create_superuser(self, phone_number, fullname, email, password, **extra_fields):
        extra_fields['is_staff'] = True
        extra_fields['is_superuser'] = True

        return self._create_user(phone_number, fullname, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    REQUIRED_FIELDS = ['fullname', 'email']
    USERNAME_FIELD = 'phone_number'

    phone_number = models.CharField('phone number', max_length=11, unique=True)
    fullname = models.CharField('full name', max_length=100)
    email = models.EmailField('email', unique=True)
    slug = AutoSlugField(populate_from="phone_number")
    is_staff = models.BooleanField('staff status', default=False)
    is_active = models.BooleanField('active', default=True)

    objects = UserAccountManager()

    def get_full_name(self):
        return self.fullname

    def get_phone_number(self):
        return self.phone_number

    def __str__(self):
        return self.email

    def get_absolute_url(self):
        return reverse('user-profile', args=[str(self.phone_number)])


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    primary_email = models.EmailField(max_length=30, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    slug = AutoSlugField(populate_from="phone_number")
    gender = models.CharField(max_length=5, choices=GENDER, blank=True)
    income_range = models.CharField(
        max_length=50, choices=INCOMERANGE, blank=True)
    employment_status = models.CharField(
        max_length=50, choices=EMPLOYMENTSTATUS, blank=True)
    relationship_status = models.CharField(
        max_length=10, choices=RELATIONSHIPSTATUS, blank=True)
    birthday = models.DateField(blank=True, null=True)
    bank_name = models.CharField(max_length=30, choices=BANK, blank=True)
    bank_account = models.CharField(max_length=30, blank=True)
    full_name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return str(self.user)

    def get_absolute_url(self):
        return reverse('user-profile-more', args=[str(self.phone_number)])


def create_profile(sender, **kwargs):
    if kwargs['created']:
        user_profile = Profile.objects.create(user=kwargs['instance'])


post_save.connect(create_profile, sender=User)


def create_wallet(sender, **kwargs):
    if kwargs['created']:
        user_wallet = Wallet().create(user=kwargs['instance'], asof=str(
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))


post_save.connect(create_wallet, sender=User)


class Token(models.Model):
    user = models.ForeignKey(
        User, null=True, related_name="tokens", on_delete=models.PROTECT)
    card_type = models.CharField(max_length=10)
    card_number = models.CharField(max_length=4)
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=2)
    charge_token = models.CharField(max_length=50)

    def __str__(self):
        return str(self.charge_token)


class EmailAuth(models.Model):
    email = models.EmailField(max_length=50)
    auth_code = models.CharField(max_length=12)

    def __str__(self):
        return str(self.email)
