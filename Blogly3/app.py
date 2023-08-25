from flask import Flask, request, render_template, redirect, flash, session
from models import db, User, Post, Tag, PostTag
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///users'  
app.config['SQLALCHEMY_ECHO'] = True   
app.config['SECRET_KEY'] = 'secret_key_here'

# Initialize the database with the Flask app
db.init_app(app)

@app.route('/')
def list_users():
    """Show home page with a list of users"""
    users = User.query.all()
    posts = Post.query.order_by(Post.created_at.desc()).all()
    tags = Tag.query.all()
    return render_template('home.html', users=users, posts=posts, tags=tags)

@app.route('/create_user')
def create_user():
    """Display a form to create a new user"""
    users = User.query.all()
    return render_template('create_user.html', users=users)

@app.route('/add_user', methods=['POST'])
def add_user():
    """Handle form data to add a new user to the database, then redirect to the home page"""
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    img_url = request.form.get('img_url')

    # Check if first_name and last_name inputs contain only letters
    if not first_name.isalpha() or not last_name.isalpha():
        flash('First and last names are required and must contain only letters.', 'error')
        return redirect('/create_user')

    new_user = User(first_name=first_name, last_name=last_name, img_url=img_url)
    
    db.session.add(new_user)
    db.session.commit()

    return redirect('/')

@app.route('/<int:user_id>')
def show_user(user_id):
    """Show details of a specific user"""
    user = User.query.get_or_404(user_id)
    posts = Post.query.filter_by(user_id=user_id).all()
    return render_template('details.html', user=user, posts=posts)

@app.route('/edit_user/<int:user_id>')
def show_edit_user_form(user_id):
    """Display the form to edit a user"""
    user = User.query.get_or_404(user_id)
    return render_template('edit_user.html', user=user)

@app.route('/edit_user/<int:user_id>', methods=['POST'])
def edit_user(user_id):
    """Handle form data to update a user in the database"""
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    img_url = request.form.get('img_url')

    # Check if first_name and last_name inputs contain only letters
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
    """Handle the deletion of a user"""
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return redirect('/')

@app.route('/add_post/<int:user_id>')
def show_add_post_form(user_id):
    """Display the form to add a new post"""
    user = User.query.get_or_404(user_id)
    tags = Tag.query.all()
    return render_template('add_post.html', user=user, tags=tags)

@app.route('/add_post/<int:user_id>', methods=['POST'])
def add_post(user_id):
    """Handle form data to add a new post to the database"""
    title = request.form.get('title')
    content = request.form.get('content')
    selected_tag_ids = request.form.getlist('tags')

    new_post = Post(title=title, content=content, user_id=user_id)

    for tag_id in selected_tag_ids:
        tag = Tag.query.get(tag_id)
        if tag:
            new_post.tags.append(tag)

    db.session.add(new_post)
    db.session.commit()

    return redirect(f'/{user_id}')

@app.route('/post_details/<int:post_id>')
def show_post(post_id):
    """Show details of a specific post"""
    post = Post.query.get_or_404(post_id)
    post_tags = post.tags
    return render_template('post_details.html', post=post, post_tags=post_tags)    

@app.route('/delete_post/<int:post_id>', methods=['POST'])
def delete_post(post_id):
    """Handle the deletion of a post"""
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return redirect(f'/{post.user_id}')

@app.route('/edit_post/<int:post_id>')
def show_edit_post_form(post_id):
    """Display the form to edit a post"""
    post = Post.query.get_or_404(post_id)
    tags = Tag.query.all()
    return render_template('edit_post.html', post=post, tags=tags)        

@app.route('/edit_post/<int:post_id>', methods=['POST'])
def edit_post(post_id):
    """Handle form data to update a post in the database"""
    title = request.form.get('title').strip()   # remove spaces
    content = request.form.get('content').strip()

    post = Post.query.get_or_404(post_id)
    post.title = title
    post.content = content

    # Check if title or content is blank
    if not title or not content:
        flash('Title and content are required fields.')
        return redirect(f'/edit_post/{post.id}')
    
    # Update the post's tags based on the selected tags
    selected_tag_ids = request.form.getlist('tags')
    post.tags.clear()  # Clear existing tags

    for tag_id in selected_tag_ids:
        tag = Tag.query.get(tag_id)
        if tag:
            post.tags.append(tag)

    db.session.commit()

    return redirect(f'/{post.user_id}')

@app.route('/create_tag')
def create_tag():
    """Display a form to create a new tag"""
    tags = Tag.query.all()
    return render_template('create_tag.html', tags=tags)

@app.route('/add_tag', methods=['POST'])
def add_and_update_tag():
    """Handle form data to add or update a tag in the database, then redirect to the home page"""
    tag_id = request.form.get('tag_id')
    name = request.form.get('name')
    
    # Check if the tag name is already taken (server-side validation)
    if Tag.query.filter_by(name=name).first():
        flash('Tag name must be unique.')
        return redirect(f'/edit_tag/{tag_id}')

    # check if it's an update(tag id provided) or add
    if tag_id: 
        tag = Tag.query.get_or_404(tag_id)
        tag.name = name  # This updates the attribute of the tracked tag object (No need for session.add)
    else: 
        new_tag = Tag(name=name)
        db.session.add(new_tag)  # This adds the new_tag object to the session


    # Check if the tag name is already taken (database-level validation)
    try:      
        db.session.commit() # Commits all changes (tracked or newly added) to the database
    except IntegrityError:
        db.session.rollback()
        flash('Tag name must be unique.')
        return redirect(f'/edit_tag/{tag_id}')

    return redirect('/')

@app.route('/tag_details/<int:tag_id>')
def show_tag_detail(tag_id):
    """Display the tag details and all posts with tag"""
    tag = Tag.query.get_or_404(tag_id)
    posts = Post.query.all()
    return render_template('tag_details.html', tag=tag, posts=posts)  

@app.route('/edit_tag/<int:tag_id>')
def show_edit_tag_form(tag_id):
    """Display the form to edit a tag"""
    tag = Tag.query.get_or_404(tag_id)
    posts = Post.query.all()
    return render_template('edit_tag.html', tag=tag, posts=posts)  

@app.route('/delete_tag/<int:tag_id>', methods=['POST'])
def delete_tag(tag_id):
    """Handle the deletion of a tag"""
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    flash('Tag has been deleted.')
    return redirect('/') 

@app.route('/update_tag_posts/<int:tag_id>', methods=['POST'])
def update_tag_posts(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    post_ids = [int(num) for num in request.form.getlist("posts")]
    tag.posts = Post.query.filter(Post.id.in_(post_ids)).all()

    db.session.commit()

    return redirect(f'/tag_details/{tag_id}')