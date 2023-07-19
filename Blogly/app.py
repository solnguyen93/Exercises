from flask import Flask, request, render_template, redirect, flash, session
from models import db, connect_db, User

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///users'  
app.config['SQLALCHEMY_ECHO'] = True   
app.config['SECRET_KEY'] = 'secret_key_here'

db.init_app(app)

@app.route('/')
def list_users():
    """Show home page with list of users"""
    users = User.query.all()
    return render_template('user_listing.html', users=users)

@app.route('/create_user')
def create_user():
    """Display create a user form"""
    users = User.query.all()
    return render_template('create_user.html', users=users)

@app.route('/add_user', methods=['POST'])
def add_user():
    """Handle create a user form data to add new user to database then redirect to home page"""
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    img_url = request.form.get('img_url')

    if not first_name.isalpha() or not last_name.isalpha(): # check if Aa-Zz
        flash('First and last names are required and must contain only letters.', 'error')
        return redirect('/create_user')

    new_user = User(first_name=first_name, last_name=last_name, img_url=img_url)
    
    db.session.add(new_user)
    db.session.commit()

    return redirect('/')

@app.route('/<int:user_id>')
def show_user(user_id):
    """show user detail"""
    user = User.query.get_or_404(user_id)
    return render_template('details.html', user=user)

@app.route('/edit_user/<int:user_id>')
def show_edit_user_form(user_id):
    """Display the edit user form"""
    user = User.query.get_or_404(user_id)
    return render_template('edit_user.html', user=user)

@app.route('/edit_user/<int:user_id>', methods=['POST'])
def edit_user(user_id):
    """Handle the edit user form data and update the user in the database"""
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    img_url = request.form.get('img_url')

    if not first_name.isalpha() or not last_name.isalpha():
        flash('First and last names are required and must contain only letters.', 'error')
        return redirect(f'/edit_user/{user_id}')

    user = User.query.get_or_404(user_id)
    user.first_name = first_name
    user.last_name = last_name
    user.img_url = img_url

    db.session.commit()

    return redirect('/')

@app.route('/delete_user/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    """Handle the user deletion"""
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return redirect('/')