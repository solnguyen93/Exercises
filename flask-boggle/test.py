from unittest import TestCase
from app import app


class FlaskTests(TestCase):

    def setUp(self):
        # Set up the Flask test client
        self.client = app.test_client()
        self.client.testing = True

        # Set a custom board configuration and variables in the session
        with self.client.session_transaction() as session:
            session['board'] = [
                ['A', 'B', 'C', 'D', 'E'],
                ['F', 'G', 'H', 'I', 'J'],
                ['K', 'L', 'M', 'N', 'O'],
                ['P', 'Q', 'R', 'S', 'T'],
                ['U', 'V', 'W', 'X', 'Y']
            ]
            session['highest_score'] = 0
            session['total_plays'] = 0

    def tearDown(self):
        # Clear the session after each test
        with self.client.session_transaction() as session:
            session.clear()

    def test_home_page(self):
        # Test the home page
        with self.client as client:
            response = client.get('/')
            with client.session_transaction() as session:
                self.assertIn('board', session)
                self.assertIn('highest_score', session)
                self.assertIn('total_plays', session)

    def test_check_word_page(self):
        # Test the check word page
        with self.client as client:
            # Test valid word on board
            response = client.get('/check-word', query_string={'word': 'no'})
            self.assertEqual(response.status_code, 200)
            expected_result = {'result': 'ok'}
            self.assertEqual(response.json, expected_result)
            
            # Test a valid word that is not on the board
            response = client.get('/check-word', query_string={'word': 'example'})
            self.assertEqual(response.status_code, 200)
            expected_result = {'result': 'not-on-board'}
            self.assertEqual(response.json, expected_result)

            # Test an invalid word
            response = client.get('/check-word', query_string={'word': 'notaword'})
            self.assertEqual(response.status_code, 200)
            expected_result = {'result': 'not-a-word'}
            self.assertEqual(response.json, expected_result)

            # Test an empty word
            response = client.get('/check-word')
            self.assertEqual(response.status_code, 400)

            # Test a word with non-alphabetic characters
            response = client.get('/check-word', query_string={'word': '!@#$'})
            self.assertEqual(response.status_code, 400)

    def test_update_score_page(self):
        # Test the update score page
        with self.client as client:
            # Test with a valid new score
            response = client.post('/update-score', json={'score': 100})
            self.assertEqual(response.status_code, 200)
            expected_result = {'highestScore': 100, 'totalPlays': 1}
            self.assertEqual(response.json, expected_result)

            # Test with a new score lower than the highest score
            response = client.post('/update-score', json={'score': 50})
            self.assertEqual(response.status_code, 200)
            expected_result = {'highestScore': 100, 'totalPlays': 2}
            self.assertEqual(response.json, expected_result)


    def test_valid_word(self):
            """Test if word is valid by modifying the board in the session"""

            with self.client as client:
                with client.session_transaction() as sess:
                    sess['board'] = [["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"]]
            response = self.client.get('/check-word?word=cat')
            self.assertEqual(response.json['result'], 'ok')