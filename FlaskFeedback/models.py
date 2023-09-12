from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()



class User(db.Model):    
    __tablename__ = 'users'

    username = db.Column(db.String(20), primary_key=True, unique=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    def __repr__(self):
        return f'<User(username={self.username}, email={self.email})>'
    
    @classmethod
    def register(cls, username, pwd):    
        """Register user with hased password & return user."""
        hashed = bcrypt.generate_password_hash(pwd)
        hashed_utf8 = hashed.decode('utf-8')   
        return cls(username=username,password=hashed_utf8) 

    @classmethod
    def authenticate(cls, username, pwd):
        """ Validate that user exists and password is correct. Return user if valid, else return False."""
        user_in_db = User.query.filter_by(username=username).first()

        if user_in_db and bcrypt.check_password_hash(user_in_db.password, pwd):
            return user_in_db
        else:
            return False

class Feedback(db.Model):
    __tablename__ = 'feedbacks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_username = db.Column(db.String(20), db.ForeignKey('users.username'), nullable=False)
    user = db.relationship('User',backref='feedbacks')

    def __repr__(self):
        return f'<Feedback(title={self.title}, content={self.content}, user_username={self.user_username})>'
    