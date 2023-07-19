"""Seed file to make sample data for users db"""
from app import app
from models import User, db, connect_db

#Create application context
with app.app_context():
    # Create all tables
    db.drop_all() 
    db.create_all()
    # If table isn't empty, empty it
    User.query.delete()
    # Add instance of User to users
    Sol = User(first_name='Sol', last_name='Nguyen')
    John = User(first_name='John', last_name='Doe')
    Ann = User(first_name='Ann', last_name='Smith', img_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80')
    # Add new objects to session
    db.session.add(Sol)
    db.session.add(John)
    db.session.add(Ann)
    # Commit to save
    db.session.commit()