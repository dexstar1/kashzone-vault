# Find Average
def little_drops_average(sumofvalue, frequency):
    if int(frequency) == 0:
        return sumofvalue
    else:
        calc = int(sumofvalue)/int(frequency)
        return calc
