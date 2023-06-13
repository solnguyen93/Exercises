import requests


def validate_currency_code(from_currency, to_currency):
    """
    Makes a request to the API to fetch the list of currency symbols and their codes.
    Checks if the specified from_currency and to_currency codes are valid.
    If any of the codes are invalid, it returns an error message.
    If both codes are valid, it returns None.
    """
    validation_url = 'https://api.exchangerate.host/symbols'
    response = requests.get(validation_url)

    if response.status_code == 200:
        data = response.json()
        symbols = data['symbols']
        error = ''
        if from_currency not in symbols:
            error += f'Invalid currency code: {from_currency}. '
        if to_currency not in symbols:
            error += f'Invalid currency code: {to_currency}.'
        if error:
            return error
    return None
