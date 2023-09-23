"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os
from flask import request, g, session, flash
from unittest import TestCase

from models import db, connect_db, Message, User

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data
with app.app_context():
    db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False

class UserViewTestCase(TestCase):
    """Test views for users."""

    def setUp(self):
        """Create test client, add sample data."""
        with app.app_context():
            db.drop_all()
            db.create_all()

            self.client = app.test_client()

            self.testuser = User.signup(username="testuser",
                                        email="test@test.com",
                                        password="testuser",
                                        image_url="None")
            self.testuser_id = 1111
            self.testuser.id = self.testuser_id

            self.testuser2 = User.signup(username="testuser2",
                                        email="test2@test.com",
                                        password="testuser2",
                                        image_url="None")
            self.testuser2_id = 2222
            self.testuser2.id = self.testuser2_id        

            db.session.commit()

    def test_show_signup_form(self):
        """Test displaying the signup form."""
        with app.app_context():
            with self.client as c:
                resp = c.get("/signup")
                self.assertEqual(resp.status_code, 200)
                self.assertIn(b'Sign up', resp.data)

    def test_signup(self):
        """Test user signup."""
        with app.app_context():
            with self.client as c:
                resp = c.post("/signup", data={"username": "newuser", "email": "newuser@test.com", "password": "newuser", "image_url": "None"}, follow_redirects=True)
                self.assertEqual(resp.status_code, 200)
                self.assertEqual(User.query.count(), 3)

    def test_signup_with_existing_username(self):
        """Test user signup with an existing username."""
        with app.app_context():
            with self.client as c:
                resp = c.post("/signup", data={"username": "testuser", "email": "newuser@test.com", "password": "newuser", "image_url": "None"}, follow_redirects=True)
                self.assertEqual(resp.status_code, 200)
                self.assertIn(b'Username already taken', resp.data)
                db.session.rollback()
                self.assertEqual(User.query.count(), 2) 

    def test_signup_with_existing_email(self):
        """Test user signup with an existing email."""
        with app.app_context():
            with self.client as c:
                resp = c.post("/signup", data={"username": "newuser", "email": "test@test.com", "password": "newuser", "image_url": "None"}, follow_redirects=True)
                self.assertEqual(resp.status_code, 200)
                self.assertIn(b'Email already taken', resp.data)
                db.session.rollback()
                self.assertEqual(User.query.count(), 2) 

    def test_show_login_form(self):
        """Test displaying the login form."""
        with app.app_context():
            with self.client as c:
                resp = c.get("/login")
                self.assertEqual(resp.status_code, 200)
                self.assertIn(b'Log in', resp.data)


    def test_profile(self):
        """Test user profile edit."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "testuser"}, follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Hello, testuser!', resp.data)

                    resp = c.post("/users/profile", data={"username": "newUsername", "password": "testuser", "email": "new@test.com", "image_url": "None"}, follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    # Check if the user profile is updated in the database
                    updated_user = User.query.get(1111)
                    self.assertEqual(updated_user.username, "newUsername")
                    self.assertEqual(updated_user.email, "new@test.com")
          