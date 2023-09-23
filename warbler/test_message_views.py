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


class MessageViewTestCase(TestCase):
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
            

    def test_add_msg(self):
        """Test add msg."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "testuser"})

                    resp = c.post("/messages/new", data={"text": "Hello1"})

                    msg = Message.query.one()
                    self.assertEqual(msg.text, "Hello1")

    def test_show_msg(self):
        """Test shown msg."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    msg = Message(
                        id=1234,
                        text="test message",
                        user_id=self.testuser_id
                    )
                    db.session.add(msg)
                    db.session.commit()

                    resp = c.get(f'/messages/1234')
     
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("test message", str(resp.data))

    def test_delete_msg(self):
        """Test delete msg."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    resp = c.post("/login", data={"username": "testuser", "password": "testuser"})

                    msg = Message(
                        id=1234,
                        text="test message",
                        user_id=self.testuser_id
                    )
                    db.session.add(msg)
                    db.session.commit()

                    resp = c.get(f'/messages/1234')
    
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("test message", str(resp.data))

                    resp = c.post("/messages/1234/delete", follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)

                    m = Message.query.get(1234)
                    self.assertIsNone(m)

    def test_message_delete_no_authenticatio(self):
        """Test delete msg without login."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    msg = Message(
                        id=1234,
                        text="test message",
                        user_id=self.testuser_id
                    )
                    db.session.add(msg)
                    db.session.commit()

                    resp = c.get(f'/messages/1234')
    
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("test message", str(resp.data))

                    resp = c.post("/messages/1234/delete", follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("Access unauthorized.", str(resp.data))

                    m = Message.query.get(1234)
                    self.assertIsNotNone(m)


                    
    def test_message_delete_unauthorized(self):
        """Test delete msg not owned by login user."""
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as session:
                    msg = Message(
                        id=1234,
                        text="test message",
                        user_id=1111
                    )
                    db.session.add(msg)
                    db.session.commit()

                    # log in as testuser2, check if msg exist, then try to delete testuser's msg
                    resp = c.post("/login", data={"username": "testuser2", "password": "testuser2"}, follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn(b'Hello, testuser2!', resp.data)

                    resp = c.get(f'/messages/1234')
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("test message", str(resp.data))
                    m = Message.query.get(1234)
                    self.assertIsNotNone(m)

                    resp = c.post("/messages/1234/delete", follow_redirects=True)
                    self.assertEqual(resp.status_code, 200)
                    self.assertIn("Access unauthorized.", str(resp.data))
                    m = Message.query.get(1234)
                    self.assertIsNotNone(m)
          