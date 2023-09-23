import os

from flask import Flask, render_template, request, flash, redirect, session, g
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import UserAddForm, LoginForm, MessageForm, UserEditForm
from models import db, connect_db, User, Message, Follows, Likes

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///warbler'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
toolbar = DebugToolbarExtension(app)

connect_db(app)


##############################################################################
# User signup/login/logout


@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None


def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If the there already is a user with that username: flash message
    and re-present form.
    """

    form = UserAddForm()

    if form.is_submitted() and form.validate():
        try:
            if User.query.filter(User.username==form.username.data).first():
                # Check if the new username is already in use
                flash("Username already taken", 'danger')
                return render_template('users/signup.html', form=form)

            if User.query.filter(User.email==form.email.data).first():
                # Check if the new email is already in use
                flash("Email already taken", 'danger')
                return render_template('users/signup.html', form=form)

            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                image_url=form.image_url.data or User.image_url.default.arg,
            )
            db.session.commit()

        except IntegrityError:
            flash("An error occurred while creating your account", 'danger')
            return render_template('users/signup.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('users/signup.html', form=form)


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    form = LoginForm()

    if form.is_submitted() and form.validate():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')

    return render_template('users/login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    if g.user:
        do_logout()
        flash(f"Goodbye, {g.user.username}!", "success")
        return redirect("/login")

    flash("Invalid credentials.", 'danger')
    return redirect('/')



##############################################################################
# General user routes:

@app.route('/users')
def list_users():
    """Page with listing of users.

    Can take a 'q' param in querystring to search by that username.
    """

    search = request.args.get('q')

    if not search:
        users = User.query.all()
    else:
        users = User.query.filter(User.username.like(f"%{search}%")).all()

    return render_template('users/index.html', users=users)


@app.route('/users/<int:user_id>')
def users_show(user_id):
    """Show user profile."""

    user = User.query.get_or_404(user_id)

    messages = (Message
                .query
                .filter(Message.user_id == user_id)
                .order_by(Message.timestamp.desc())
                .limit(100)
                .all())

    like_count = Likes.query.filter_by(user_id=user_id).count()

    return render_template('users/show.html', user=user, messages=messages, like_count=like_count)


@app.route('/users/<int:user_id>/following')
def show_following(user_id):
    """Show list of people this user is following."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(user_id)
    return render_template('users/following.html', user=user)


@app.route('/users/<int:user_id>/followers')
def users_followers(user_id):
    """Show list of followers of this user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(user_id)
    return render_template('users/followers.html', user=user)


@app.route('/users/follow/<int:follow_id>', methods=['POST'])
def add_follow(follow_id):
    """Add a follow for the currently-logged-in user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    followed_user = User.query.get_or_404(follow_id)
    g.user.following.append(followed_user)
    db.session.commit()

    return redirect(f"/users/{g.user.id}/following")


@app.route('/users/stop-following/<int:follow_id>', methods=['POST'])
def stop_following(follow_id):
    """Have currently-logged-in-user stop following this user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    followed_user = User.query.get(follow_id)
    g.user.following.remove(followed_user)
    db.session.commit()

    return redirect(f"/users/{g.user.id}/following")


@app.route('/users/profile', methods=["GET", "POST"])
def profile():
    """Update profile for current user."""
    
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    form = UserEditForm()

    if form.is_submitted() and form.validate():

        # Check if the new username is current user's username
        if form.username.data != g.user.username:
            # Check if the new username is already in use
            if User.query.filter(User.username == form.username.data).first():
                flash("Username already taken", 'danger')
                return redirect ('/users/profile')

        # Check if the new email is current user's email
        if form.email.data != g.user.email:
            # Check if the new email is already in use
            if User.query.filter(User.email == form.email.data).first():
                flash("Email already taken", 'danger')
                return redirect ('/users/profile')

        # Authenticate the user using their old username and password
        user = User.authenticate(g.user.username, form.password.data)

        if user:
            try:
                # Populate user attributes, excluding the password
                g.user.username = form.username.data
                g.user.email = form.email.data
                g.user.image_url = form.image_url.data
                g.user.header_image_url = form.header_image_url.data
                g.user.bio = form.bio.data
                db.session.commit()
                flash("Profile updated successfully.", "success")
                return redirect(f"/users/{g.user.id}")

            except IntegrityError:
                flash("Username or email already taken", 'danger')
                return redirect ('/users/profile')
        else:
            flash("Invalid password.", 'danger')

    return render_template('users/edit.html', form=form)





@app.route('/users/delete', methods=["POST"])
def delete_user():
    """Delete user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    do_logout()

    db.session.delete(g.user)
    db.session.commit()

    return redirect("/signup")


##############################################################################
# Messages routes:

@app.route('/messages/new', methods=["GET", "POST"])
def messages_add():
    """Add a message:

    Show form if GET. If valid, update message and redirect to user page.
    """

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    form = MessageForm()

    if form.is_submitted() and form.validate():
        msg = Message(text=form.text.data)
        g.user.messages.append(msg)
        db.session.commit()

        return redirect(f"/users/{g.user.id}")

    return render_template('messages/new.html', form=form)


@app.route('/messages/<int:message_id>', methods=["GET"])
def messages_show(message_id):
    """Show a message."""

    msg = Message.query.get(message_id)
    return render_template('messages/show.html', message=msg)


@app.route('/messages/<int:message_id>/delete', methods=["POST"])
def messages_destroy(message_id):
    """Delete a message."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    msg = Message.query.get(message_id)

    # Check if the message exists
    if not msg:
        flash("Message not found.", "danger")
        return redirect(f"/users/{g.user.id}")

    # Check if the currently logged-in user is the owner of the message
    if g.user.id != msg.user_id:
        flash("Access unauthorized.", "danger")
        return redirect(f"/users/{g.user.id}")

    db.session.delete(msg)
    db.session.commit()

    return redirect(f"/users/{g.user.id}")
##############################################################################
# Likes routes:

@app.route('/messages/<int:message_id>/like', methods=['POST'])
def like_unlike(message_id):
    """Have currently-logged-in-user like/unlike this message."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    message = Message.query.get(message_id)
    if message in g.user.likes:
        g.user.likes.remove(message)    # Unlike if already liked
    else:
        g.user.likes.append(message)
    db.session.commit()

    return redirect(f"/")



##############################################################################
# Homepage and error pages


@app.route('/')
def homepage():
    """Show homepage:

    - anon users: no messages
    - logged in: 100 most recent messages of followed_users
    """

    if g.user:

        # Get the IDs of users being followed by the logged-in user (For each "follow" relationship, this code retrieves the IDs of users who are being followed by the currently logged-in user. It does this by querying the database and filtering the results based on the user's ID.)
        following_ids = [follow.user_being_followed_id for follow in Follows.query.filter_by(user_following_id=g.user.id).all()]

        # Get the IDs of users the logged-in user is following
        messages = (Message
                    .query
                    .filter(Message.user_id.in_(following_ids))
                    .order_by(Message.timestamp.desc())
                    .limit(100)
                    .all())

        liked_message_ids = [like.message_id for like in Likes.query.filter_by(user_id=g.user.id).all()]

        return render_template('home.html', messages=messages, liked_message_ids=liked_message_ids)

    else:
        return render_template('home-anon.html')


##############################################################################
# Turn off all caching in Flask
#   (useful for dev; in production, this kind of stuff is typically
#   handled elsewhere)
#
# https://stackoverflow.com/questions/34066804/disabling-caching-in-flask

@app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req
