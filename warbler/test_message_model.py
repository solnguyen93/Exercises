"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_model.py


import os
from flask import request, g, session, flash
from unittest import TestCase

from models import db, connect_db, Message, User, Likes

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"



from app import app, CURR_USER_KEY

with app.app_context():
    db.create_all()


app.config['WTF_CSRF_ENABLED'] = False


class MessageModelTestCase(TestCase):
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

            
    def test_create_message(self):
        """Test creating a new message."""
        with app.app_context():
            message = Message(text="Hello!", user_id=1111)
            db.session.add(message)
            db.session.commit()

            self.assertEqual(Message.query.count(), 1)

    def test_message_properties(self):
        """Test message properties."""
        with app.app_context():
            message = Message(text="Hello!", user_id=1111)
            db.session.add(message)
            db.session.commit()

            # Check if properties match the expected values
            self.assertEqual(message.text, "Hello!")
            self.assertEqual(message.user_id, 1111)
            self.assertEqual(message.user.username, "testuser")

    def test_message_deletion(self):
        """Test deleting a message."""
        with app.app_context():
            message = Message(text="Hello!", user_id=1111)
            db.session.add(message)
            db.session.commit()

            # Check if the message exists in the database
            self.assertEqual(Message.query.count(), 1)

            # Delete the message
            db.session.delete(message)
            db.session.commit()

            # Check if the message was deleted
            self.assertEqual(Message.query.count(), 0)

    def test_message_likes(self):
        with app.app_context():
            m1 = Message(
                id=1234,
                text="firstMessage",
                user_id=1111
            )
            db.session.add(m1)
            m2 = Message(
                id=5678,
                text="secondMessage",
                user_id=2222 
            )
            db.session.add(m2)
            db.session.commit()
            self.assertEqual(Message.query.count(), 2)

            # first like - user 1 message 2
            like1 = Likes(user_id=1111, message_id=5678)
            db.session.add(like1)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 1)

            # second like - user 2 message 1
            like2 = Likes(user_id=2222, message_id=1234)
            db.session.add(like2)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 2)

    def test_message_unlike(self):
        with app.app_context():
            m1 = Message(
                id=1234,
                text="firstMessage",
                user_id=1111
            )
            db.session.add(m1)
            m2 = Message(
                id=5678,
                text="secondMessage",
                user_id=2222 
            )
            db.session.add(m2)
            db.session.commit()
            self.assertEqual(Message.query.count(), 2)

            like1 = Likes(user_id=1111, message_id=5678)
            db.session.add(like1)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 1)

            like2 = Likes(user_id=2222, message_id=1234)
            db.session.add(like2)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 2)
            
            db.session.delete(like1)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 1)

            db.session.delete(like2)
            db.session.commit()
            self.assertEqual(Likes.query.count(), 0)