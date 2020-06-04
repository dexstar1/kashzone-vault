from django.db import models
from django.conf import settings
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator

from wallet.models import Wallet
import uuid

"""
Note Tenor here in means "Tenure"
"""


RENTENOR = (
    ('1', '1 Month'),
    ('2', '2 Month'),
    ('3', '3 Month'),
    ('4', '4 Month'),
    ('5', '5 Month'),
    ('6', '6 Month'),
    ('7', '7 Month'),
    ('8', '8 Month'),
    ('9', '9 Month'),
    ('10', '10 Month'),
    ('11', '11 Month'),
    ('12', '12 Month')
)

LOCKED = (
    ('YES', 'YES'),
    ('NO', 'NO')
)

AUTODEBIT_1 = (
    ('Daily', 'DAILY'),
    ('Weekly', 'WEEKLY'),
    ('Monthly', 'MONTHLY')
)

AUTODEBIT_2 = (
    ('DAILY', 'Daily'),
    ('WEEKLY', 'Weekly'),
    ('MONTHLY', 'Monthly'),
    ('MANUALLY', 'Manually')
)

TARGETTENOR = (
    ('1', '1 Month'),
    ('2', '2 Month'),
    ('3', '3 Month'),
    ('4', '4 Month'),
    ('5', '5 Month'),
    ('6', '6 Month'),
    ('7', '7 Month'),
    ('8', '8 Month'),
    ('9', '9 Month'),
    ('10', '10 Month'),
    ('11', '11 Month'),
    ('12', '12 Month'),
    ('13', '13 Month'),
    ('14', '14 Month'),
    ('15', '15 Month'),
    ('16', '16 Month'),
    ('17', '17 Month'),
    ('18', '18 Month'),
    ('19', '19 Month'),
    ('20', '20 Month'),
    ('21', '21 Month'),
    ('22', '22 Month'),
    ('23', '23 Month'),
    ('24', '24 Month'),
    ('25', '25 Month'),
    ('26', '26 Month'),
    ('27', '27 Month'),
    ('28', '28 Month'),
    ('29', '29 Month'),
    ('30', '30 Month'),
    ('31', '31 Month'),
    ('32', '32 Month'),
    ('33', '33 Month'),
    ('34', '34 Month'),
    ('35', '35 Month'),
    ('36', '36 Month')


)

FIXEDTENOR = (
    ('6', '6 Month'),
    ('12', '12 Month')
)

LASTACTION = (
    ('up', 'UP'),
    ('down', 'DOWN')
)
# Little Drops


class LittleDrops(models.Model):
    """
    Streak is increased per day. not by number of drops,
    Average increases by number of deposits and mean-deposit-value
    """
    class Meta:
        verbose_name = "Little Drops"
        verbose_name_plural = "Little Drops"

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name="littledrops", on_delete=models.PROTECT, null=True)
    custom_name = models.CharField(max_length=20, default="littledrops")
    plan_name = models.CharField(max_length=20, default="littledrops")

    ref_number = models.UUIDField(
        unique=True, editable=False, default=uuid.uuid4, verbose_name='Plan ref')
    amount_saved = models.DecimalField(decimal_places=2, max_digits=7,
                                       validators=[
                                           MinValueValidator(Decimal('1.00')),
                                           MaxValueValidator(
                                               Decimal('2000000.00'))
                                       ], default=0.00)
    streak = models.CharField(max_length=3, default="0")
    last_action = models.CharField(
        max_length=4, choices=LASTACTION, default="up")
    last_drop_date = models.DateField(blank=True, null=True)
    drop_frequency = models.IntegerField(default=0)
    all_time_drop = models.IntegerField(default=0)
    average_deposit = models.DecimalField(
        decimal_places=2, max_digits=7, default=0.00)
    created = models.DateTimeField(auto_now_add=True)
    month_interest = models.DecimalField(decimal_places=2, max_digits=7,
                                         validators=[
                                             MinValueValidator(
                                                 Decimal('0.00')),
                                             MaxValueValidator(
                                                 Decimal('2000000.00'))
                                         ], default=0.00)

    def __str__(self):
        return str(self.ref_number)


# Rent Plus
class Rentplus(models.Model):
    class Meta:
        verbose_name = "Rent Plus"
        verbose_name_plural = "Rent Plus"

    MAX_TARGET = 200000.00
    MIN_TARGET = 1.00

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="rentplus", on_delete=models.PROTECT, null=True)
    custom_name = models.CharField(max_length=20, default="rentplus")
    plan_name = models.CharField(max_length=20, default="rentplus")

    ref_number = models.UUIDField(
        unique=True, editable=False, default=uuid.uuid4, verbose_name='Plan ref')
    tenor = models.CharField(max_length=50, choices=RENTENOR)
    tenor_ended = models.BooleanField(default=False)
    start_date = models.DateTimeField()
    next_deduction_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField()
    target = models.DecimalField(decimal_places=2, max_digits=8,
                                 validators=[
                                     MinValueValidator(Decimal('100.00')),
                                     MaxValueValidator(Decimal('200000.00'))
                                 ])
    amount_to_charge = models.DecimalField(decimal_places=2, max_digits=7,
                                           validators=[
                                               MinValueValidator(
                                                   Decimal('100.00')),
                                               MaxValueValidator(
                                                   Decimal('100000.00'))
                                           ])
    amount_saved = models.DecimalField(decimal_places=2, max_digits=7,
                                       validators=[
                                           MinValueValidator(
                                               Decimal('100.00')),
                                           MaxValueValidator(
                                               Decimal('200000.00'))
                                       ], default=0.00)
    created = models.DateTimeField(auto_now_add=True)
    autodebit = models.CharField(max_length=50, choices=AUTODEBIT_1)
    interest = models.CharField(max_length=50)
    locked = models.CharField(default="NO", max_length=10, choices=LOCKED)
    percentage_completion = models.IntegerField(default=0)

    def __str__(self):
        return str(self.ref_number)

# Target Savings


class TargetSaving(models.Model):
    class Meta:
        verbose_name = "Target Savings"
        verbose_name_plural = "Target Savings"

    MIN_TARGET = 1000.00

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="targetsavings", on_delete=models.PROTECT, null=True)
    ref_number = models.UUIDField(
        unique=True, editable=False, default=uuid.uuid4, verbose_name='Target ref')
    custom_name = models.CharField(max_length=20)
    plan_name = models.CharField(max_length=20, default="targetsavings")

    tenor = models.CharField(max_length=50, choices=TARGETTENOR)
    tenor_ended = models.BooleanField(default=False)
    start_date = models.DateTimeField()
    next_deduction_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField()
    target = models.DecimalField(decimal_places=2, max_digits=10,
                                 validators=[
                                     MinValueValidator(Decimal('1000.00')),
                                     MaxValueValidator(
                                         Decimal('1000000000.00'))
                                 ])
    amount_to_charge = models.DecimalField(decimal_places=2, max_digits=10,
                                           validators=[
                                               MinValueValidator(
                                                   Decimal('100.00')),
                                               MaxValueValidator(
                                                   Decimal('10000000.00'))
                                           ])
    amount_saved = models.DecimalField(decimal_places=2, max_digits=7,
                                       validators=[
                                           MinValueValidator(Decimal('10.00')),
                                           MaxValueValidator(
                                               Decimal('1000000000.00'))
                                       ], default=0.00)
    created = models.DateTimeField(auto_now_add=True)
    autodebit = models.CharField(max_length=50, choices=AUTODEBIT_1)
    interest = models.CharField(max_length=50)
    locked = models.CharField(max_length=50, choices=LOCKED)
    percentage_completion = models.IntegerField(default=0)

    def __str__(self):
        return str(self.ref_number)


# Fixed Deposits
class FixedDeposit(models.Model):
    class Meta:
        verbose_name: "Fixed Deposit"
        verbose_name_plural = "Fixed Deposits"

    MIN_TARGET = 100000.00

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="fixds", on_delete=models.PROTECT, null=True)
    ref_number = models.UUIDField(
        unique=True, editable=False, default=uuid.uuid4, verbose_name='Target ref')
    custom_name = models.CharField(max_length=20)
    plan_name = models.CharField(max_length=20, default="fixds")
    tenor = models.CharField(max_length=50, choices=FIXEDTENOR)
    tenor_ended = models.BooleanField(default=False)
    start_date = models.DateTimeField()
    next_deduction_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField()
    amount_planned = models.DecimalField(decimal_places=2, max_digits=10,
                                         validators=[
                                             MinValueValidator(
                                                 Decimal('100000.00')),
                                             MaxValueValidator(
                                                 Decimal('1000000000.00'))
                                         ])
    amount_received = models.DecimalField(decimal_places=2, max_digits=10,
                                          validators=[
                                              MinValueValidator(
                                                  Decimal('100000.00')),
                                              MaxValueValidator(
                                                  Decimal('1000000000.00'))
                                          ], default=0.00)
    created = models.DateTimeField(auto_now_add=True)
    interest = models.CharField(max_length=50)
    locked = models.CharField(
        max_length=50, choices=LOCKED, default="YES", editable=False)
    signature = models.CharField(max_length=50)

    def __str__(self):
        return str(self.ref_number)


# Kapital Plan
class Kapital(models.Model):
    class Meta:
        verbose_name: "Kapital"
        verbose_name_plural = "Kapital Funds"

    MIN_TARGET = 1.00

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="kapitalfunds", on_delete=models.PROTECT)
    target = models.DecimalField(default=0.00, decimal_places=2, max_digits=10,
                                 validators=[
                                     MinValueValidator(Decimal('100.00')),
                                     MaxValueValidator(
                                         Decimal('1000000000.00'))
                                 ])
    tenor = models.CharField(max_length=50, choices=TARGETTENOR)

    amount_to_charge = models.DecimalField(default=1000.00, decimal_places=2, max_digits=10,
                                           validators=[
                                               MinValueValidator(
                                                   Decimal('100.00')),
                                               MaxValueValidator(
                                                   Decimal('100000.00'))
                                           ])
    created = models.DateTimeField(auto_now_add=True)
    autodebit = models.CharField(max_length=50, choices=AUTODEBIT_1)
    interest = models.CharField(max_length=50, default="40%/A")
    locked = models.CharField(max_length=50, choices=LOCKED)


class Action(models.Model):
    class Meta:
        verbose_name = "VaultFlex Action"
        verbose_name_plural = "VaultFlex Actions"

    ACTION_TYPE_RENTPLUS = 'RENTPLUS'
    ACTION_TYPE_TARGET_SAVINGS = 'TARGET_SAVINGS'
    ACTION_TYPE_FIXED_DEPOSIT = 'FIXED_DEPOSIT'
    ACTION_TYPE_KAPITAL = 'KAPITAL'

    ACTION_CLASS_LOCKED = 'LOCKED'

    ACTION_TYPE_CHOICES = (
        (ACTION_TYPE_RENTPLUS, 'Rentplus'),
        (ACTION_TYPE_TARGET_SAVINGS, 'Targetsavings'),
        (ACTION_TYPE_FIXED_DEPOSIT, 'Fixed'),
        (ACTION_TYPE_KAPITAL, 'kapital'),
        (ACTION_CLASS_LOCKED, 'Locked')
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        help_text="user who performed the action",
    )

    actiontype = models.CharField(
        max_length=30,
        choices=ACTION_TYPE_CHOICES,
    )

    timestamp = models.DateTimeField(
        blank=True,
    )

    wallet = models.ForeignKey(
        Wallet, on_delete=models.PROTECT
    )

    delta = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    @classmethod
    def create(
        cls,
        user,
        wallet,
        actiontype,
        delta,
        asof,
    ):

        return cls.objects.create(
            timestamp=asof,
            user=user,
            wallet=wallet,
            actiontype=actiontype,
            delta=delta
        )

    def __str__(self):
        return str(self.wallet)
