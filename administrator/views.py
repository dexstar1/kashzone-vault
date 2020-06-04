from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum, Count
import decimal
from django.views import generic
from .calc import returnWithComma, returnIntWithComma

from acctmang.models import User, Profile
from wallet.models import Wallet, Action
from vaultflex.models import Rentplus, TargetSaving, FixedDeposit

from loan.models import Applications
from .filters import LoanApplicationFilter, UserFilter

# Create your views here.


def admin_home(request):
    """
    View function for admin dashboard returning  context data
    containing Net Wallet Balance, etc.

    """
    if not request.user.is_authenticated or request.user.is_staff == False:
        return render(
            request,
            "administrator/login_error.html"
        )
    else:
        # USERS
        users_num = User.objects.all().count()
        users_comma_value = returnIntWithComma(users_num)

        # WALLET
        net_wallet_balance = Wallet.objects.aggregate(Sum('balance'))[
            "balance__sum"]
        format_nwb = decimal.Decimal("{:.2f}".format(net_wallet_balance))
        nwb_comma_value = returnWithComma(format_nwb)

        # RENTPLUS
        rentplus_nlocked = Rentplus.objects.filter(locked='NO')
        #rentplus = Rentplus.objects.filter(locked='NO').count()
        rentplus_locked = Rentplus.objects.filter(locked='YES')
        rp_nlocked_sum = rentplus_nlocked.aggregate(
            Sum('amount_saved'))["amount_saved__sum"]
        try:
            format_rp_nlocked_sum = decimal.Decimal(
                "{:.2f}".format(rp_nlocked_sum))
        except BaseException:
            format_rp_nlocked_sum = decimal.Decimal("{:.2f}".format(0.00))
        rp_locked_sum = rentplus_locked.aggregate(Sum('amount_saved'))[
            "amount_saved__sum"]
        try:
            format_rp_locked_sum = decimal.Decimal(
                "{:.2f}".format(rp_locked_sum))
        except BaseException:
            format_rp_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # TARGET SAVINGS
        target_nlocked = TargetSaving.objects.filter(locked='NO')
        target_locked = TargetSaving.objects.filter(locked='YES')
        target_nlocked_sum = target_nlocked.aggregate(
            Sum('amount_saved'))["amount_saved__sum"]
        try:
            format_target_nlocked_sum = decimal.Decimal(
                "{:.2f}".format(target_nlocked_sum))
        except BaseException:
            format_target_nlocked_sum = decimal.Decimal("{:.2f}".format(0.00))
        target_locked_sum = target_locked.aggregate(
            Sum('amount_saved'))["amount_saved__sum"]
        try:
            format_target_locked_sum = decimal.Decimal(
                "{:.2f}".format(target_locked_sum))
        except BaseException:
            format_target_locked_sum = decimal.Decimal("{:.2f}".format(0.00))

        # FIXED DEPOSIT

        # TOTAL AMOUNT IN PLANS LOCKED IN:-- RENTPLUS, TARGET SAVINGS, FIXED
        TAML = format_rp_locked_sum + format_target_locked_sum
        taml_comma_value = returnWithComma(TAML)

        # TOTAL AMOUNT IN PLANS NOT LOCKED IN:-- RENTPLUS, TARGET SVAINGS. FIXED
        TAMNL = format_rp_nlocked_sum + format_target_nlocked_sum
        tamnl_comma_value = returnWithComma(TAMNL)

        # OVERALL SUM IN VAULT
        OVRSV = format_nwb + TAML + TAMNL
        ovrsv_comma_value = returnWithComma(OVRSV)

        #Actions & Transactions
        transaction_volume = Action.objects.all().count()
        trans_volume_comma_value = returnIntWithComma(transaction_volume)

        # inflow transaction value
        inflow = Action.objects.filter(ttype="DEPOSIT")
        inflow_sum = inflow.aggregate(Sum('delta'))["delta__sum"]
        try:
            format_inflow_sum = decimal.Decimal("{:.2f}".format(inflow_sum))
        except BaseException:
            format_inflow_sum = decimal.Decimal("{:.2f}".format(0.00))
        inflow_comma_value = returnWithComma(format_inflow_sum)

        # outflow transaction value
        outflow = Action.objects.filter(ttype="WITHDRAW")
        outflow_sum = outflow.aggregate(Sum('delta'))["delta__sum"]
        try:
            format_outflow_sum = decimal.Decimal("{:.2f}".format(outflow_sum))
        except BaseException:
            format_outflow_sum = decimal.Decimal("{:.2f}".format(0.00))
        outflow_comma_value = returnWithComma(format_outflow_sum)

        # intra transaction value
        intra = Action.objects.filter(ttype="TRANSFER")
        intra_sum = intra.aggregate(Sum('delta'))["delta__sum"]
        try:
            format_intra_sum = decimal.Decimal("{:.2f}".format(intra_sum))
        except BaseException:
            format_intra_sum = decimal.Decimal("{:.2f}".format(0.00))
        intra_comma_value = returnWithComma(format_intra_sum)

        context = {
            "users": users_comma_value,
            "nwb": nwb_comma_value,
            "taml": taml_comma_value,
            "tamnl": tamnl_comma_value,
            "ovrsv": ovrsv_comma_value,
            "trans_volume": trans_volume_comma_value,
            "inflow": inflow_comma_value,
            "outflow": outflow_comma_value,
            "intra": intra_comma_value
        }
        return render(
            request,
            "administrator/admin_home.html",
            context
        )


def admin_loan_search(request):
    if not request.user.is_authenticated or request.user.is_staff == False:
        return render(
            request,
            "administrator/login_error.html"
        )
    else:
        #application_list = Applications.objects.all()[::-1]
        application_list = Applications.objects.all()
        application_filter = LoanApplicationFilter(
            request.GET, queryset=application_list)

        return render(
            request,
            "administrator/admin_loans.html",
            {'filter': application_filter}
        )


class AdvanceProfileView(generic.DetailView):
    model = Profile

    def get_context_data(self, **kwargs):
        user = super().get_context_data(**kwargs)
        return(
            user
        )


def admin_users(request):
    if not request.user.is_authenticated or request.user.is_staff == False:
        return render(
            request,
            "administrator/login_error.html"
        )
    else:
        user_list = User.objects.all()
        user_filter = UserFilter(request.GET, queryset=user_list)

        return render(
            request,
            "administrator/admin_users.html",
            {'filter': user_filter}
        )


class UserProfileView(generic.DetailView):
    model = User

    def get_context_data(self, **kwargs):
        user = super().get_context_data(**kwargs)
        return user


def admin_report(request):
    if not request.user.is_authenticated or request.user.is_staff == False:
        return render(
            request,
            "administrator/login_error.html"
        )
    else:
        return render(
            request,
            "administrator/admin_report.html"
        )
