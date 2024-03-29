# Generated by Django 2.2.2 on 2019-06-08 21:25

import acctmang.models
import autoslug.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('phone_number', models.CharField(max_length=11, unique=True, verbose_name='phone number')),
                ('fullname', models.CharField(max_length=100, verbose_name='full name')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email')),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from='phone_number')),
                ('is_staff', models.BooleanField(default=False, verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, verbose_name='active')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', acctmang.models.UserAccountManager()),
            ],
        ),
        migrations.CreateModel(
            name='EmailAuth',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=50)),
                ('auth_code', models.CharField(max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_type', models.CharField(max_length=10)),
                ('card_number', models.CharField(max_length=4)),
                ('expiry_month', models.CharField(max_length=2)),
                ('expiry_year', models.CharField(max_length=2)),
                ('charge_token', models.CharField(max_length=50)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tokens', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(blank=True, choices=[('044', 'Access Bank'), ('063', 'Access Bank Diamond'), ('050', 'Ecobank'), ('070', 'Fidelity Bank'), ('011', 'First Bank'), ('214', 'FCMB'), ('058', 'GTB'), ('030', 'Heritage Bank'), ('082', 'Keystone'), ('076', 'Polaris (Skye Bank)'), ('221', 'Stanbic IBTC'), ('232', 'Sterling Bank'), ('032', 'Union Bank'), ('215', 'Unity Bank'), ('035', 'Wema Bank'), ('057', 'Zenith Bank')], max_length=30)),
                ('bank_account', models.CharField(blank=True, max_length=30)),
                ('full_name', models.CharField(blank=True, max_length=50)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
