from unittest import TestCase
from app import app, db, connect_db
from models import User

    
app.config['TESTING'] = True
app.config['DEBUG_TB_ENABLED'] = ['dont-show-deb-toolbar']

class UserTest(TestCase):
    app = app

    def setUp(self):
        """Set up the test environment"""
        self.client = app.test_client()
        with app.app_context():
            # Create all tables
            db.create_all()
            # Add some test users to the database
            user1 = User(first_name='Sol', last_name='Nguyen')
            user2 = User(first_name='John', last_name='Doe')
            user3 = User(first_name='Ann', last_name='Smith', img_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb')
            db.session.add_all([user1, user2, user3])
            db.session.commit()

    def tearDown(self):
        """Tear down the test environment"""
        with app.app_context():
        # Close the session and drop all tables
            db.session.remove()
            db.drop_all()

    def test_user1(self):
        """Test displaying user details for user1"""
        with app.app_context():
            response = self.client.get('/1')
            # Check that the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)
            # Check that the user details are correctly displayed on the page
            self.assertIn(b'Sol Nguyen', response.data)

    def test_user3_with_img(self):
        """Test displaying user details for user1"""
        with app.app_context():
            response = self.client.get('/3')
            # Check that the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)
            # Check that the user details are correctly displayed on the page
            self.assertIn(b'Ann Smith', response.data)
            # Check that the user images are present in the response
            self.assertIn(b'src="https://images.unsplash.com/photo-1534528741775-53994a69daeb', response.data)

    def test_list_users(self):
        """Test the route '/' to list users"""
        with app.app_context():
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            # Check that the user names are present in the response
            self.assertIn(b'Sol Nguyen', response.data)
            self.assertIn(b'John Doe', response.data)
            self.assertIn(b'Ann Smith', response.data)


    def test_add_user_valid(self):
        """Test adding a new user with valid data"""
        with app.app_context():
            response = self.client.post('/add_user', data={
                'first_name': 'Mike',
                'last_name': 'Tyson'
            }, follow_redirects=True)
            # Check that the response redirects to the home page (/)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Users', response.data)
            # Check that the user is added to the database
            user = User.query.filter_by(first_name='Mike', last_name='Tyson').first()
            self.assertIsNotNone(user)

    def test_add_user_invalid(self):
        """Test adding a new user with invalid data (missing last_name)"""
        with app.app_context():
            response = self.client.post('/add_user', data={
                'first_name': 'James',
                'last_name': ''
            }, follow_redirects=True)
            # Check that the response redirects to the Create a user page (/create_user)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Create a user', response.data)
            # Check that the user is NOT added to the database
            user = User.query.filter_by(first_name='James').first()
            self.assertIsNone(user)

    def test_add_user_invalid_server(self):
        """Test adding a new user with invalid data (containing number and special char)"""
        with app.app_context():
            response = self.client.post('/add_user', data={
                'first_name': 'James123',
                'last_name': 'Brown!@#'
            }, follow_redirects=True)
            # Check that the response redirects to the Create a user page (/create_user)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Create a user', response.data)
            # Check that the user is NOT added to the database
            user = User.query.filter_by(first_name='James123').first()
            self.assertIsNone(user)
            # Check that the flash message is displayed
            self.assertIn(b'First and last names are required and must contain only letters.', response.data)

    def test_edit_user_valid_data(self):
        """Test editing a user with valid data"""
        with app.app_context():
            response = self.client.post('/edit_user/1', data={
                'first_name': 'Blue',
                'last_name': 'Eyed',
                'img_url': 'https://example.com/blue.jpg'
            }, follow_redirects=True)
            # Check that the response redirects to the Edit a user page (/edit_user/1)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Users', response.data)
            # Check that the user data is updated in the database
            edited_user = User.query.get(1)
            self.assertEqual(edited_user.first_name, 'Blue')
            self.assertEqual(edited_user.last_name, 'Eyed')
            self.assertEqual(edited_user.img_url, 'https://example.com/blue.jpg')

    def test_edit_user_invalid_data(self):
        """Test editing a user with invalid data (missing first_name)"""
        with app.app_context():
            response = self.client.post('/edit_user/1', data={
                'first_name': '',
                'last_name': 'Eyed',
                'img_url': 'https://example.com/blue.jpg'
            }, follow_redirects=True)
            # Check that the response redirects to the Edit a user page (/edit_user/1)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Edit a user', response.data)
            # Check that the user data is not updated in the database
            user = User.query.get(1)
            self.assertEqual(user.first_name, 'Sol')  # User's first_name should not change

    def test_delete_user(self):
        """Test deleting a user"""
        with app.app_context():
            # Check that the user is present in the database before deletion
            user = User.query.get(1)
            self.assertIsNotNone(user)
            # Send a POST request to the delete_user route to delete the user
            response = self.client.post(f'/delete_user/1', follow_redirects=True)
            # Check that the response redirects to the home page (/)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Users', response.data)
            # Check that the user is no longer present in the database after deletion
            deleted_user = User.query.get(1)
            self.assertIsNone(deleted_user)

# to execute paste in terminal: python3 -m unittest test_app.py > test_output.log