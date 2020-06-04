from django.db import models
from django.conf import settings
from autoslug import AutoSlugField
from django.urls import reverse
User = settings.AUTH_USER_MODEL

LOANPERIOD = (
    ('30', '30 DAYS'),
    ('15', '15 DAYS')
)

STATUS = (
    ("running", "RUNNING"),
    ("settled", "SETTLED"),
    ("default", "DEFAULT"),
    ("failed", "FAILED")
)


class Applications(models.Model):
    class Meta:
        verbose_name = 'Applications'
        verbose_name_plural = 'Applications'
    owner = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="applications", null=True)
    loan_amount = models.CharField(max_length=30)
    loan_period = models.CharField(max_length=30, choices=LOANPERIOD)
    interest_rate = models.CharField(max_length=30)
    repayment_amount = models.CharField(max_length=30)
    status = models.CharField(max_length=10, choices=STATUS)
    start_date = models.DateTimeField(blank=True)
    due_date = models.DateTimeField(blank=True)
    repayment_even = models.BooleanField(default=False)

    def __str__(self):
        return str(self.owner)
