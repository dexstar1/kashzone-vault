from acctmang.models import User
from loan.models import Applications
import django_filters


class LoanApplicationFilter(django_filters.FilterSet):
    """
    Class fliter works with the view function 'loan_search' to return
    loan based on search input
    """
    #start_date = django_filters.NumberFilter(field_name='start_date', lookup_expr='year')
    start_date = django_filters.DateTimeFromToRangeFilter(widget=django_filters.widgets.RangeWidget(
        attrs={'type': 'date'}
    ))

    class Meta:
        model = Applications
        fields = ['status', 'start_date']


class UserFilter(django_filters.FilterSet):
    """
    Class filter works with the view function 'user_search' to return
    user profile based on search input

    """

    class Meta:
        model = User
        fields = ['phone_number', 'email']
