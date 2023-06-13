from flask import Flask, request, render_template, redirect
import requests
from currency_validation import validate_currency_code

app = Flask(__name__)


@app.route('/')
def home_page():
    """
    Display the home page with the currency conversion form
    """
    return render_template('form.html')


@app.route('/validate_code', methods=["POST"])
def validate_code():
    """
    Validates the from_currency and to_currency codes received from the form data.
    If the codes are valid, it redirects to the /convert route.
    If there's an error, it renders the form.html template with the error message.
    """
    from_currency_code = request.form['from'].upper()
    to_currency_code = request.form['to'].upper()

    error = validate_currency_code(from_currency_code, to_currency_code)

    if error:
        return render_template('form.html', error=error)

    # After validation, redirect to the conversion route while maintaining the original HTTP method (POST)
    description = get_currency_description(to_currency_code)
    return redirect(f'/convert?description={description}', code=307)


def get_currency_description(currency_code):
    """
    Fetches the currency symbols and descriptions from the API
    and returns the description for the specified currency code.
    """
    validation_url = 'https://api.exchangerate.host/symbols'
    response = requests.get(validation_url)

    if response.status_code == 200:
        data = response.json()
        symbols = data['symbols']
        if currency_code in symbols:
            return data['symbols'][currency_code]['description']

    return None


@app.route('/convert', methods=["POST"])
def convert_rate():
    """
    Retrieves the conversion rate from the API and calculates
    the converted amount based on the specified currencies and amount.
    Then, it renders the converted.html template with the conversion details.
    """
    from_currency_code = request.form['from']
    to_currency_code = request.form['to']
    amount = request.form['amount']
    description = request.args.get('description')

    if float(amount) < 0.01:
        error = 'Amount must be at least 0.01'
        return render_template('form.html', error=error)

    conversion_url = f'https://api.exchangerate.host/convert?from={from_currency_code}&to={to_currency_code}&amount={amount}&places=2'
    response = requests.get(conversion_url)

    if response.status_code == 200:
        data = response.json()
        rate = data['info']['rate']
        converted_amount = data['result']
        return render_template('converted.html', from_currency=from_currency_code, to_currency=to_currency_code, amount=amount, converted_amount=converted_amount, rate=rate, description=description)
    else:
        error = 'Failed to retrieve exchange rate'
        return render_template('form.html', error=error)
