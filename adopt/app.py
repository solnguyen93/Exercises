from flask import Flask, render_template, redirect, flash
from forms import AddPetForm, EditPetForm
from models import db, Pet

# Create a Flask app instance
app = Flask(__name__)

# Configure the app and SQLAlchemy settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///adopt'
app.config['SECRET_KEY'] = 'secret_key_here'
app.config['SQLALCHEMY_ECHO'] = True  # Print SQL queries to the console
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
db.init_app(app)

@app.route('/')
def show_pet_list():
    """Show home page with a list of pets"""
    pets = Pet.query.all()
    return render_template('pet_list.html', pets=pets)

@app.route('/add', methods=['GET', 'POST'])
def show_add_pet_form():
    """Show and handle add pet form"""
    form = AddPetForm()

    # Handle form submission
    if form.validate_on_submit(): 
        new_pet = Pet(
            name=form.name.data,
            species=form.species.data,
            photo_url=form.photo_url.data,
            age=None if form.age.data == 'None' else form.age.data,  # Convert 'None' to None for the age field
            notes=form.notes.data,
            available=form.available.data 
        )
        db.session.add(new_pet)
        db.session.commit()
        flash('Pet added successfully!')
        return redirect('/')

    return render_template('add_pet_form.html', form=form)

@app.route('/<int:pet_id>', methods=['GET', 'POST'])
def show_pet_details_and_edit_form(pet_id):
    """Show and handle edit pet form"""
    pet = Pet.query.get_or_404(pet_id)
    form = EditPetForm(obj=pet)  

    # Handle form submission
    if form.validate_on_submit():
        form.populate_obj(pet)  # Update pet object with form data
        flash('Pet edited successfully!')
        db.session.commit()
        return redirect('/')

    return render_template('pet_details_and_edit_form.html', form=form, pet=pet)

@app.route('/delete/<int:pet_id>', methods=['POST'])
def delete_pet(pet_id):
    """Handle pet delete"""
    pet = Pet.query.get_or_404(pet_id)
    db.session.delete(pet)
    db.session.commit()
    flash('Pet deleted successfully!')
    return redirect('/')

def test_app():
    """Print pet information for testing purposes"""
    with app.app_context():
        pets = Pet.query.all()
        for pet in pets:
            print(f"ID: {pet.id}")
            print(f"Name: {pet.name}")
            print(f"Species: {pet.species}")
            print(f"Photo URL: {pet.photo_url}")
            print(f"Age: {pet.age}")
            print(f"Notes: {pet.notes}")
            print(f"Available: {pet.available}")
            print()

if __name__ == "__main__":
    test_app()
