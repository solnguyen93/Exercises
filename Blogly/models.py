from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)

    
class User(db.Model): 

    __tablename__ = 'users' 

    def __repr__(self):
        s = self
        return f"<User id={s.id}, first_name={s.first_name}, last_name={s.last_name}>"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)     
    first_name = db.Column(db.String(50), nullable=False)  
    last_name = db.Column(db.String(50), nullable=False)
    img_url = db.Column(db.Text)              

    
    



