# Generated by Django 2.2.2 on 2019-06-08 21:27

from decimal import Decimal
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wallet', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TargetSaving',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref_number', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Target ref')),
                ('custom_name', models.CharField(max_length=20)),
                ('tenor', models.CharField(choices=[('1', '1 Month'), ('2', '2 Month'), ('3', '3 Month'), ('4', '4 Month'), ('5', '5 Month'), ('6', '6 Month'), ('7', '7 Month'), ('8', '8 Month'), ('9', '9 Month'), ('10', '10 Month'), ('11', '11 Month'), ('12', '12 Month'), ('13', '13 Month'), ('14', '14 Month'), ('15', '15 Month'), ('16', '16 Month'), ('17', '17 Month'), ('18', '18 Month'), ('19', '19 Month'), ('20', '20 Month'), ('21', '21 Month'), ('22', '22 Month'), ('23', '23 Month'), ('24', '24 Month'), ('25', '25 Month'), ('26', '26 Month'), ('27', '27 Month'), ('28', '28 Month'), ('29', '29 Month'), ('30', '30 Month'), ('31', '31 Month'), ('32', '32 Month'), ('33', '33 Month'), ('34', '34 Month'), ('35', '35 Month'), ('36', '36 Month')], max_length=50)),
                ('start_date', models.DateTimeField()),
                ('next_deduction_date', models.DateTimeField(blank=True, null=True)),
                ('end_date', models.DateTimeField()),
                ('target', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('1000.00')), django.core.validators.MaxValueValidator(Decimal('1000000000.00'))])),
                ('amount_to_charge', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('10000000.00'))])),
                ('amount_saved', models.DecimalField(decimal_places=2, default=0.0, max_digits=7, validators=[django.core.validators.MinValueValidator(Decimal('10.00')), django.core.validators.MaxValueValidator(Decimal('1000000000.00'))])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('autodebit', models.CharField(choices=[('Daily', 'DAILY'), ('Weekly', 'WEEKLY'), ('Monthly', 'MONTHLY')], max_length=50)),
                ('interest', models.CharField(max_length=50)),
                ('locked', models.CharField(choices=[('YES', 'YES'), ('NO', 'NO')], max_length=50)),
                ('percentage_completion', models.IntegerField(default=0)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='targetsavings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Target Savings',
                'verbose_name_plural': 'Target Savings',
            },
        ),
        migrations.CreateModel(
            name='Rentplus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref_number', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Plan ref')),
                ('tenor', models.CharField(choices=[('1', '1 Month'), ('2', '2 Month'), ('3', '3 Month'), ('4', '4 Month'), ('5', '5 Month'), ('6', '6 Month'), ('7', '7 Month'), ('8', '8 Month'), ('9', '9 Month'), ('10', '10 Month'), ('11', '11 Month'), ('12', '12 Month')], max_length=50)),
                ('start_date', models.DateTimeField()),
                ('next_deduction_date', models.DateTimeField(blank=True, null=True)),
                ('end_date', models.DateTimeField()),
                ('target', models.DecimalField(decimal_places=2, max_digits=8, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('200000.00'))])),
                ('amount_to_charge', models.DecimalField(decimal_places=2, max_digits=7, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('100000.00'))])),
                ('amount_saved', models.DecimalField(decimal_places=2, default=0.0, max_digits=7, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('200000.00'))])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('autodebit', models.CharField(choices=[('Daily', 'DAILY'), ('Weekly', 'WEEKLY'), ('Monthly', 'MONTHLY')], max_length=50)),
                ('interest', models.CharField(max_length=50)),
                ('locked', models.CharField(choices=[('YES', 'YES'), ('NO', 'NO')], default='NO', max_length=10)),
                ('percentage_completion', models.IntegerField(default=0)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='rentplus', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Rent Plus',
                'verbose_name_plural': 'Rent Plus',
            },
        ),
        migrations.CreateModel(
            name='LittleDrops',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref_number', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Plan ref')),
                ('amount_saved', models.DecimalField(decimal_places=2, default=0.0, max_digits=7, validators=[django.core.validators.MinValueValidator(Decimal('1.00')), django.core.validators.MaxValueValidator(Decimal('2000000.00'))])),
                ('streak', models.CharField(default='0', max_length=3)),
                ('last_action', models.CharField(choices=[('up', 'UP'), ('down', 'DOWN')], default='up', max_length=4)),
                ('last_drop_date', models.DateField(blank=True)),
                ('drop_frequency', models.IntegerField(default=0)),
                ('all_time_drop', models.IntegerField(default=0)),
                ('average_deposit', models.DecimalField(decimal_places=2, default=0.0, max_digits=7)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('month_interest', models.DecimalField(decimal_places=2, default=0.0, max_digits=7, validators=[django.core.validators.MinValueValidator(Decimal('0.00')), django.core.validators.MaxValueValidator(Decimal('2000000.00'))])),
                ('owner', models.OneToOneField(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='littledrops', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Little Drops',
                'verbose_name_plural': 'Little Drops',
            },
        ),
        migrations.CreateModel(
            name='Kapital',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('1000000000.00'))])),
                ('tenor', models.CharField(choices=[('1', '1 Month'), ('2', '2 Month'), ('3', '3 Month'), ('4', '4 Month'), ('5', '5 Month'), ('6', '6 Month'), ('7', '7 Month'), ('8', '8 Month'), ('9', '9 Month'), ('10', '10 Month'), ('11', '11 Month'), ('12', '12 Month'), ('13', '13 Month'), ('14', '14 Month'), ('15', '15 Month'), ('16', '16 Month'), ('17', '17 Month'), ('18', '18 Month'), ('19', '19 Month'), ('20', '20 Month'), ('21', '21 Month'), ('22', '22 Month'), ('23', '23 Month'), ('24', '24 Month'), ('25', '25 Month'), ('26', '26 Month'), ('27', '27 Month'), ('28', '28 Month'), ('29', '29 Month'), ('30', '30 Month'), ('31', '31 Month'), ('32', '32 Month'), ('33', '33 Month'), ('34', '34 Month'), ('35', '35 Month'), ('36', '36 Month')], max_length=50)),
                ('amount_to_charge', models.DecimalField(decimal_places=2, default=1000.0, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('100.00')), django.core.validators.MaxValueValidator(Decimal('100000.00'))])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('autodebit', models.CharField(choices=[('Daily', 'DAILY'), ('Weekly', 'WEEKLY'), ('Monthly', 'MONTHLY')], max_length=50)),
                ('interest', models.CharField(default='40%/A', max_length=50)),
                ('locked', models.CharField(choices=[('YES', 'YES'), ('NO', 'NO')], max_length=50)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='kapitalfunds', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Kapital Funds',
            },
        ),
        migrations.CreateModel(
            name='FixedDeposit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref_number', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Target ref')),
                ('custom_name', models.CharField(max_length=20)),
                ('tenor', models.CharField(choices=[('6', '6 Month'), ('12', '12 Month')], max_length=50)),
                ('start_date', models.DateTimeField()),
                ('next_deduction_date', models.DateTimeField(blank=True, null=True)),
                ('end_date', models.DateTimeField()),
                ('amount_planned', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('100000.00')), django.core.validators.MaxValueValidator(Decimal('1000000000.00'))])),
                ('amount_received', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('100000.00')), django.core.validators.MaxValueValidator(Decimal('1000000000.00'))])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('interest', models.CharField(max_length=50)),
                ('locked', models.CharField(choices=[('YES', 'YES'), ('NO', 'NO')], default='YES', editable=False, max_length=50)),
                ('signature', models.CharField(max_length=50)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='fixds', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Fixed Deposits',
            },
        ),
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('actiontype', models.CharField(choices=[('RENTPLUS', 'Rentplus'), ('TARGET_SAVINGS', 'Targetsavings'), ('FIXED_DEPOSIT', 'Fixed'), ('KAPITAL', 'kapital'), ('LOCKED', 'Locked')], max_length=30)),
                ('timestamp', models.DateTimeField(blank=True)),
                ('delta', models.DecimalField(decimal_places=2, max_digits=10)),
                ('user', models.ForeignKey(help_text='user who performed the action', on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('wallet', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='wallet.Wallet')),
            ],
            options={
                'verbose_name': 'VaultFlex Action',
                'verbose_name_plural': 'VaultFlex Actions',
            },
        ),
    ]
