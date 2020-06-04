"""
This a collection of classes and function used in aggregating values
for the admin

"""


def returnWithComma(decimal_number):
    # This works best with decimal numbers with ":.2f" decimal places
    #floated = float(decimal_number)
    stringified = str(decimal_number)
    splitted = stringified.split(".")
    main_value = splitted[0]
    decimal_value = splitted[1]
    int_value = int(main_value)
    reformatted = format(int_value, ",d")

    return reformatted + "." + decimal_value


def returnIntWithComma(integer):
    reformatted = format(integer, ",d")
    return reformatted
