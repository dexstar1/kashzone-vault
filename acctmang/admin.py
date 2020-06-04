from django.contrib import admin

from .models import User, Profile, Token, EmailAuth

admin.site.register(EmailAuth)
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Token)
