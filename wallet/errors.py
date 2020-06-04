class Error(Exception):
    pass


class ExceedsLimit(Error):
    pass


class InvalidAmount(Error):
    def __init__(self, amount):
        self.amount = amount

    def __str__(self):
        return 'Invalid Amount: {}'.format(self.amount)


class InsufficientFunds(Error):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount

    def __str__(self):
        return 'amount: {}, current balance: {}'.format(
            self.amount, self.balance)


class UserDoesNotExist(Error):
    def __init__(self, wallet):
        self.wallet = wallet

    def __str__(self):
        return 'User {}; does not exist'.format(self.wallet)
