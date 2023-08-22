from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, URLField, SelectField, TextAreaField
from wtforms.validators import InputRequired, Optional   

class AddPetForm (FlaskForm):
    """Form for adding pets"""

    name = StringField('Pet Name', validators=[InputRequired()])
    species = StringField('Species', validators=[InputRequired()]) 
    photo_url = URLField('Photo URL', validators=[Optional()]) 
    age = SelectField('Age', choices=[('None', 'None')]+[(str(i), f'{i}') for i in range(31)]+[('31+', '31+')], default='None')
    notes = TextAreaField('Notes', validators=[Optional()]) 
    available = BooleanField('Available', validators=[InputRequired()], default=True)     

class EditPetForm(FlaskForm):
    """Form for editing pets"""
    notes = TextAreaField('Notes')
    photo_url = URLField('Photo URL', validators=[Optional()])
    available = BooleanField('Available')