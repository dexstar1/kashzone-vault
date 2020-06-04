from django.urls import path, include
from .views import *
urlpatterns = [
    path('adsr/admin/', include('django.contrib.auth.urls')),
    path('adsr/admin/dashboard', admin_home, name="admin_home"),
    path('adsr/admin/loans', admin_loan_search, name="admin_loans"),
    path('adsr/admin/users', admin_users, name="admin_users"),
    path('adsr/admin/loan/applicant/<slug:slug>',
         AdvanceProfileView.as_view(), name="advance-user-profile"),
    path('adsr/admin/user/<slug:slug>',
         UserProfileView.as_view(), name="user-profile"),
    path('adsr/admin/report', admin_report, name="admin_report")

]
