from django.db import models, transaction
from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

import uuid
from django.core.validators import (
	RegexValidator,
	MinValueValidator,
	MaxValueValidator
)
from .errors import InvalidAmount, InsufficientFunds, ExceedsLimit, UserDoesNotExist
from django.core.exceptions import ObjectDoesNotExist


class Wallet(models.Model):
    class Meta:
        verbose_name = 'Wallet'
        verbose_name_plural = 'Wallets'

    
    MIN_BALANCE = 0.00

    MAX_TRANSFER = 1000000.00
    MIN_TRANSFER = 10.00

    MAX_DEPOSIT = 500000.00
    MIN_DEPOSIT = 10.00

    MAX_WITHDRAWAL = 500000.00
    MIN_WITHDRAWAL = 100.00


    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.PROTECT,
                                related_name="wallets"
                                )
    
    wallet_id = models.CharField(_('Wallet ID'),
                                            unique = True,
                                            null=True,
                                            max_length=11
                                            )

    created = models.DateTimeField(
        blank = True
    )

    modified = models.DateTimeField(
        blank = True
    )
    
    balance = models.DecimalField(_('Wallet Balance'),
                                  default = 0,
                                  max_digits =12,
                                  decimal_places=2,
                                  validators=[
                                      MinValueValidator(Decimal('0.00')),

                                  ]
                                  )

    @classmethod
    def create(cls, user, asof):
        """
        Create wallet.
        user (User):
        owner of the wallet.

        Returns (tuple):
            [0] Wallet
            [1] Action
        """

        with transaction.atomic():
            wallet = cls.objects.create(
                user=user,
                created=asof,
                modified=asof,
            )

            action = Action.create(
                user=user,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_CREATED,
                delta=0,
                asof=asof
            )
        return wallet, action

    @classmethod
    def deposit(
        cls,
        wallet_id,
        deposited_by,
        amount,
        asof,
    ):
        

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_DEPOSIT <= amount <= cls.MAX_DEPOSIT):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=deposited_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_DEPOSIT,
                delta=amount,
                asof=asof

            )
        return wallet, action

    @classmethod
    def withdraw(
        cls,
        wallet_id,
        withdrawn_by,
        amount,
        asof,
    ):
        

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_WITHDRAWAL <= amount <= cls.MAX_WITHDRAWAL):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:
            if amount > wallet.balance:
                raise InvalidAmount(amount)

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=withdrawn_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_WITHDRAW,
                delta=amount,
                asof=asof

            )
        return wallet, action


    @classmethod
    def smart_transfer(
        cls,
        wallet_id1,
        transferred_by,
        wallet_id2,
        received_by,
        amount,
        asof,
    ):
        """
        transfer from Wallet1 to Wallet2.

        wallet_id1:
            Wallet1 public identifier
        wallet_id2:
            Wallet2 public identifier
            
        transferred_by (User):
            The transferring user

        amount (positve value > 1):
            Amount to transfer.
        asof (datetime.datetime):
            Time of transaction.

        Raises:
            Account.DoesNotExist
            InvalidAmount
            InsufficientFunds
            
        
        """
        assert amount > 0

        with transaction.atomic():
            wallet1 = cls.objects.select_for_update().get(wallet_id=wallet_id1)
            try:
            	wallet2 = cls.objects.select_for_update().get(wallet_id=wallet_id2)
            except ObjectDoesNotExist:
            	raise UserDoesNotExist(wallet_id2)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            if wallet1.balance - amount < cls.MIN_BALANCE:
                raise InsufficientFunds(wallet1.balance, amount)


            wallet1.balance -= amount
            wallet1.modified = asof

            wallet2.balance += amount
            wallet2.modified = asof

            wallet1.save(update_fields=[
                'balance',
                'modified',
            ])

            wallet2.save(update_fields=[
                'balance',
                'modified',
            ])

            action1 = Action.create(
                user=transferred_by,
                wallet=wallet1,
                ttype=Action.ACTION_TYPE_TRANSFER,
                delta=-amount,
                asof=asof,

            )

            action2 = Action.create(
                user=received_by,
                wallet=wallet2,
                ttype=Action.ACTION_TYPE_RECEIVE,
                delta=amount,
                asof=asof,

            )

        return wallet1, wallet2, action1, action2

    @classmethod
    def transfer_bank(
        cls,
        wallet_id,
        transferred_by,
        amount,
        asof,
        meta_info
    ):
        """
        transfer from user Wallet to another Bank.
        This is different from withdrawals

        wallet_id:
            Wallet public identifier
        transferred_by (User):
            The transferring user

        amount (positve value > 1):
            Amount to transfer.
        asof (datetime.datetime):
            Time of transaction.

        Raises:
            InvalidAmount
            InsufficientFunds
            
        
        """
        assert amount > 0

        with transaction.atomic():
            wallet = cls.objects.select_for_update().get(wallet_id=wallet_id)
            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            if wallet.balance - amount < cls.MIN_BALANCE:
                raise InsufficientFunds(wallet.balance, amount)


            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])
            
            action = Action.create_transfer_to_bank(
                user=transferred_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_TRANSFER,
                delta=-amount,
                asof=asof,
                meta_info=meta_info

            )

        return wallet, action

    @classmethod
    def loan_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        on request for loan

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_LOAN_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def loan_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user upon repayment or Due date charge
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_LOAN_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def little_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        as proceeds and/or interest from Little drops

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_LITTLE_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def little_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user daily, weekly or monthly for little drops plan category 
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_LITTLE_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def rentp_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        as proceeds and/or interest from Rent Plus

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_RENTP_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def rentp_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user daily, weekly or monthly for Rent Plus plan category 
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_RENTP_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def target_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        as proceeds and/or interest from Target Savings

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_TARGET_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def target_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user daily, weekly or monthly for Target savings plan category 
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_TARGET_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def fixed_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        as proceeds and/or interest from Fixed Deposit

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_FIXED_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def fixed_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user for Fixed Deposit plan category 
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_FIXED_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def kapital_cr(
        cls,
        wallet_id,
        received_by,
        amount,
        asof
    ):
        """
        Class method for Monies sent from admin credited into user wallet
        as proceeds and/or interest from Kapital

        """
        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance += amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=received_by,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_KAPITAL_CR,
                delta=amount,
                asof=asof,

            )
        return wallet, action

    @classmethod
    def kapital_dr(
        cls,
        wallet_id,
        debited_from,
        amount,
        asof
    ):
        """
        Class method for Monies debited from user for Kapital plan category 
        """

        assert amount > 0

        with transaction.atomic():
            wallet= cls.objects.select_for_update().get(wallet_id=wallet_id)

            if not (cls.MIN_TRANSFER <= amount <= cls.MAX_TRANSFER):
                raise InvalidAmount(amount)

            #if accont.balance + amount > cls.MAX_BALANCE:

            wallet.balance -= amount
            wallet.modified = asof

            wallet.save(update_fields=[
                'balance',
                'modified',
            ])

            action = Action.create(
                user=debited_from,
                wallet=wallet,
                ttype=Action.ACTION_TYPE_KAPITAL_DR,
                delta=amount,
                asof=asof,

            )
        return wallet, action


    

    def __str__(self):
        return str(self.wallet_id)

    



class Action(models.Model):
    class Meta:
        verbose_name = 'Wallet action'
        verbose_name_plural = 'Wallet actions'

    ACTION_TYPE_CREATED = 'CREATED'
    ACTION_TYPE_TRANSFER = 'TRANSFER'
    ACTION_TYPE_RECEIVE = 'RECEIVE'
    ACTION_TYPE_DEPOSIT = 'DEPOSIT'
    ACTION_TYPE_WITHDRAW = 'WITHDRAW'
    ACTION_TYPE_LOAN_CR = 'LOAN-CR'
    ACTION_TYPE_LOAN_DR = 'LOAN-DR'
    ACTION_TYPE_LITTLE_CR = 'LITTLE-CR'
    ACTION_TYPE_LITTLE_DR = 'LITTLE-DR'
    ACTION_TYPE_RENTP_CR = 'RENTP-CR'
    ACTION_TYPE_RENTP_DR = 'RENTP-DR'
    ACTION_TYPE_TARGET_CR = 'TARGET-CR'
    ACTION_TYPE_TARGET_DR = 'TARGET-DR'
    ACTION_TYPE_FIXED_CR = 'FIXED-CR'
    ACTION_TYPE_FIXED_DR = 'FIXED-DR'
    ACTION_TYPE_KAPITAL_CR = 'KAPITAL-CR'
    ACTION_TYPE_KAPITAL_DR = 'KAPITAL-DR'

    ACTION_TYPE_CHOICES = (
        (ACTION_TYPE_CREATED, 'Created'),
        (ACTION_TYPE_TRANSFER, 'Transfer'),
        (ACTION_TYPE_RECEIVE, 'Receive'),
        (ACTION_TYPE_DEPOSIT, 'Deposit'),
        (ACTION_TYPE_WITHDRAW, 'Withdraw'),
        (ACTION_TYPE_LOAN_CR, 'Loan_CR'),
        (ACTION_TYPE_LOAN_DR, 'Loan_DR'),
        (ACTION_TYPE_LITTLE_CR, 'Little_CR'),
        (ACTION_TYPE_LITTLE_DR, 'Little_DR'),
        (ACTION_TYPE_RENTP_CR, 'Rentp_CR'),
        (ACTION_TYPE_RENTP_DR, 'Rentp_DR'),
        (ACTION_TYPE_TARGET_CR, 'Target_CR'),
        (ACTION_TYPE_TARGET_DR, 'Target_DR'),
        (ACTION_TYPE_FIXED_CR, 'Fixed_CR'),
        (ACTION_TYPE_FIXED_DR, 'Fixed_DR'),
        (ACTION_TYPE_KAPITAL_CR, 'Kapital_CR'),
        (ACTION_TYPE_KAPITAL_DR, 'Kapital_DR')




        

    )

    uidref = models.UUIDField(
        unique = True,
        editable = False,
        default = uuid.uuid4,
        verbose_name = 'Transaction identifier',
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="actions",
        on_delete = models.PROTECT,
        help_text= 'User who performed the action.',
    )

    ttype = models.CharField(
        max_length = 30,
        choices= ACTION_TYPE_CHOICES,
    )
    
    timestamp = models.DateTimeField(
        blank = True,
    )

    wallet = models.ForeignKey(
        Wallet, on_delete=models.PROTECT,
        related_name="wallets"
    )

    delta = models.DecimalField(
        max_digits= 7,
        decimal_places=2,
    )

    #debugging purposes.
    debug_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text = 'Balance after user action',
    )

    meta_info = models.TextField(max_length=200, blank=True, editable=False, default="01key:basic inflow-intra-outflow, view users actions")

    @classmethod
    def create(
        cls,
        user,
        wallet,
        ttype,
        delta,
        asof
    ):
        """Create Action.
        user (User):
            User who executed the action.
        wallet (Wallet):
            Wallet the action is executed on.
        ttype (str, one of Action.ACTION_TYPE-s*):
            Transaction type or action type.
        delta (float):
            Change in balance.

        uidref and timestamp are auto generated.
        

        Returns (Action)
        """
        #validation errors can be humbly raised here, with:
        #from django.core.exceptions import ValidationError

        
        return cls.objects.create(
            timestamp=asof,
            user=user,
            wallet=wallet,
            ttype=ttype,
            delta=delta,
            debug_balance=wallet.balance
        )

    
    @classmethod
    def create_transfer_to_bank(
        cls,
        user,
        wallet,
        ttype,
        delta,
        asof,
        meta_info
    ):
        """Create Action.
        user (User):
            User who executed the action.
        wallet (Wallet):
            Wallet the action is executed on.
        ttype (str, one of Action.ACTION_TYPE-s*):
            Transaction type or action type.
        delta (float):
            Change in balance.

        uidref and timestamp are auto generated.
        

        Returns (Action)
        """
        #validation errors can be humbly raised here, with:
        #from django.core.exceptions import ValidationError

        
        return cls.objects.create(
            timestamp=asof,
            user=user,
            wallet=wallet,
            ttype=ttype,
            delta=delta,
            debug_balance=wallet.balance,
            meta_info=meta_info
        )

    def __str__(self):
    	return str(self.uidref)



