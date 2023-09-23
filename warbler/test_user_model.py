"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from flask import request, g, session, flash
from unittest import TestCase

from models import db, User, Message, Follows

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
    db.drop_all()
    db.create_all()

app.config['WTF_CSRF_ENABLED'] = False

class UserModelTestCase(TestCase):
    """Test views for messages."""

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

    def test_user_model(self):
        """Test creating a new user."""
        with app.app_context():
            self.assertEqual(User.query.count(), 2)

            u3 = User(
                email="test3@test.com",
                username="testuser3",
                password="HASHED_PASSWORD"
            )
            db.session.add(u3)
            db.session.commit()

            self.assertEqual(len(u3.messages), 0)
            self.assertEqual(len(u3.followers), 0)
                
            self.assertEqual(User.query.count(), 3)

    def test_user_properties(self):
        """Test user properties."""
        with app.app_context():
            u3 = User(
                email="test3@test.com",
                username="testuser3",
                password="HASHED_PASSWORD",
                location="Seattle",
                bio="bioTest"
            )
            db.session.add(u3)
            db.session.commit()

            # Check if properties match the expected values
            self.assertEqual(u3.username, "testuser3")
            self.assertEqual(u3.email, "test3@test.com")
            self.assertEqual(u3.image_url, "/static/images/default-pic.png")
            self.assertEqual(u3.header_image_url, "/static/images/warbler-hero.jpg")
            self.assertEqual(u3.location, "Seattle")
            self.assertEqual(u3.bio, "bioTest")

    def test_user_deletion(self):
        """Test deleting a user."""
        with app.app_context():
            self.assertEqual(User.query.count(), 2)

            u3 = User(
                email="test3@test.com",
                username="testuser3",
                password="HASHED_PASSWORD"
            )
            db.session.add(u3)
            db.session.commit()
            self.assertEqual(User.query.count(), 3)

            db.session.delete(u3)
            db.session.commit()
            self.assertEqual(User.query.count(), 2)

            db.session.delete(self.testuser)
            db.session.commit()
            self.assertEqual(User.query.count(), 1)

            db.session.delete(self.testuser2)
            db.session.commit()
            self.assertEqual(User.query.count(), 0)

    def test_follows(self):
        """Test user follows."""
        with app.app_context():
            follow = Follows(user_being_followed_id=1111, user_following_id=2222)
            db.session.add(follow)
            db.session.commit()

            self.assertEqual(follow.user_being_followed_id, 1111)
            self.assertEqual(follow.user_following_id, 2222)

    def test_is_following(self):
        """Test user is following and followed by."""
        with app.app_context():
            u3 = User(
                email="test3@test.com",
                username="testuser3",
                password="HASHED_PASSWORD"
            )
            db.session.add(u3)
            u4 = User(
                email="test4@test.com",
                username="testuser4",
                password="HASHED_PASSWORD"
            )
            db.session.add(u4)
            db.session.commit()
            
            u3.following.append(u4)
            # is following test
            self.assertTrue(u3.is_following(u4))
            self.assertFalse(u4.is_following(u3))

            # followed by test
            self.assertTrue(u4.is_followed_by(u3))
            self.assertFalse(u3.is_followed_by(u4))


    def test_login_successful(self):
        """Test user login."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "testuser"}, follow_redirects=True)

                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Hello, testuser!', resp.data)

    def test_login_wrong_password(self):
        """Test user login with wrong password."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "wrongpassword"}, follow_redirects=True)

                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Invalid credentials.', resp.data)

    def test_logout(self):
        """Test logout user."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "testuser"}, follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Hello, testuser!', resp.data)

                    resp = c.get("/logout", follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Goodbye', resp.data)

    def test_login_wrong_username(self):
        """Test user login with wrong username.."""
        with app.app_context():
            # Test valid login credentials
            auth_user = User.authenticate("testuser", "testuser")
            self.assertTrue(auth_user)
            self.assertEqual(auth_user.id, 1111)

            # Test invalid username
            auth_user = User.authenticate("wrongusername", "testuser")
            self.assertFalse(auth_user)


