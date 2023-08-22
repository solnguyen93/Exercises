"""Seed file to make sample data for  db"""
from models import db, Pet
from app import app

with app.app_context():

    db.drop_all() 
    db.create_all()

    pets = [   
        Pet(name='Buddy', species='Dog', age=2, available=True),
        Pet(name='Whiskers', species='Cat', age=4, available=True),
        Pet(name='Rocket', species='Rabbit', age=6, available=False),
        Pet(name='Ninja', species='Turtle', photo_url='https://rb.gy/o2ztk', age=27, notes='here is a sea turtle', available=True),
        Pet(name='Jerry', species='Mouse', photo_url='https://tinyurl.com/y6bs28nw', age=3, notes='a little mouse', available=True) 
    ]
    for pet in pets:
        db.session.add(pet) 
    db.session.commit() 
