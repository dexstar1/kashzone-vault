from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Wallet
from acctmang.models import User


@receiver(pre_save, sender=Wallet)
def create_wallet_id(sender, instance, *args, **kwargs):
    if not instance.wallet_id:

        user = User.objects.get(wallets=instance)  # wallets=related_name
        phone_number = user.phone_number

        if user:
            instance.wallet_id = phone_number
        else:
            raise ProcessLookupError("Error getting walled id")
