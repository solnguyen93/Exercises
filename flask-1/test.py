def test_validate_code_route_valid(self):
    # Test the /validate_code route with valid currency codes
    response = self.client.post(
        '/validate_code', data={'from_currency': 'USD', 'to_currency': 'EUR'}, follow_redirects=True)
    self.assertEqual(response.status_code, 307)
    self.assertIn(b'/convert', response.location)

    # Test case-insensitive codes
    response = self.client.post(
        '/validate_code', data={'from_currency': 'Usd', 'to_currency': 'eur'}, follow_redirects=True)
    self.assertEqual(response.status_code, 307)
    self.assertIn(b'/convert', response.location)


def test_validate_code_route_invalid(self):
    # Test the /validate_code route for invalid from_currency
    response = self.client.post(
        '/validate_code', data={'from_currency': 'zzz', 'to_currency': 'EUR'}, follow_redirects=True)
    self.assertEqual(response.status_code, 200)
    self.assertIn(b'Invalid currency code: ZZZ', response.data)

    # Test the /validate_code route for invalid to_currency
    response = self.client.post(
        '/validate_code', data={'from_currency': 'USD', 'to_currency': 'zzz'}, follow_redirects=True)
    self.assertEqual(response.status_code, 200)
    self.assertIn(b'Invalid currency code: ZZZ', response.data)

    # Test the /validate_code route for both invalid
    response = self.client.post(
        '/validate_code', data={'from_currency': 'zzz', 'to_currency': 'abc'}, follow_redirects=True)
    self.assertEqual(response.status_code, 200)
    self.assertIn(b'Invalid currency code: ZZZ, ABC', response.data)


def test_get_currency_description(self):
    # Test the get_currency_description function
    response = self.client.post(
        '/convert', data={'from_currency': 'USD', 'to_currency': 'EUR', 'amount': '1'}, follow_redirects=True)
    self.assertEqual(response.status_code, 200)
    description = response.context['description']
    self.assertEqual(description, 'United States Dollar')


def test_convert_rate_valid(self):
    # Test the /convert route with valid data
    response = self.client.post(
        '/convert', data={'from_currency': 'USD', 'to_currency': 'EUR', 'amount': '1'}, follow_redirects=True)
    self.assertEqual(response.status_code, 200)
    self.assertIn(b'Converted amount', response.data)


def test_convert_rate_invalid_amount(self):
    # Test the /convert route for an invalid amount (form.html required amount to be num)
    response = self.client.post(
        '/convert', data={'from_currency': 'USD', 'to_currency': 'EUR', 'amount': '.001'}, follow_redirects=True)
    self.assertEqual(response.status_code, 400)
    self.assertIn(b'Amount must be at least 0.01', response.data)
