from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model): 

    __tablename__ = 'users' 

    def __repr__(self):
        s = self
        return f"<User id={s.id}, first_name={s.first_name}, last_name={s.last_name}>"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)     
    first_name = db.Column(db.String(50), nullable=False)  
    last_name = db.Column(db.String(50), nullable=False)
    img_url = db.Column(db.Text)              

    posts = db.relationship('Post', backref='user', cascade='all, delete-orphan')

class Post(db.Model): 

    __tablename__ = 'posts' 

    def __repr__(self):
        s = self
        return f"<Post id={s.id}, title={s.title}, content={s.content}, created_at={s.created_at}, user_id={s.user_id}>"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)     
    title = db.Column(db.String(50), nullable=False)  
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


    



