"""Seed file to make sample data for users db"""
from app import app
from models import User, db, Post, Tag, PostTag
from datetime import datetime

#Create application context
with app.app_context():
    # Create all tables
    db.drop_all() 
    db.create_all()
    # If table isn't empty, empty it
    User.query.delete()
    # Add instance of User to users
    Sol = User(first_name='Sol', last_name='Nguyen', img_url='https://images.unsplash.com/photo-1440133197387-5a6020d5ace2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80')
    John = User(first_name='John', last_name='Doe', img_url='https://images.unsplash.com/photo-1558295520-479f861279b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80')
    Ann = User(first_name='Ann', last_name='Smith', img_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80')
    # Add new objects to session
    db.session.add(Sol)
    db.session.add(John)
    db.session.add(Ann)
    # Commit to save
    db.session.commit()
    #
    posts = [   
        Post(title='First Test', content='Hello, this is my first post!', user_id="1", created_at=datetime(2023, 7, 2, 10, 30)),
        Post(title='Second Test', content='Hello again, this is my second post!', user_id="2", created_at=datetime.now()),
        Post(title='Third Test', content='Greetings from my third post!', user_id="2"),
        Post(title='Fourth Test', content='Last post for today! Lorem ipsum dolor sit amet, facilisi partiendo suavitate te sed, vix detracto ullamcorper no. Errem prompta pertinacia et sed. Id vix veritus ponderum petentium. Ne ipsum electram duo. Cu duo sale autem molestiae, ut usu graeco euismod appetere. Eos ei putant appareat constituam, sit hendrerit consequuntur at. Melius senserit ei per, nisl pertinax vim at. Per mandamus ullamcorper at, no sea fugit libris. Tantas oblique splendide pri ex, pro ea semper impedit moderatius. Impetus delicatissimi in pro. Vel homero equidem adipisci id, pri velit fastidii consequat ea. Vis ut detracto delectus senserit, utroque disputando id mea. Sit ne impedit inimicus. Pro error abhorreant ut, in mundi assentior sed. At delicata pericula dissentiunt mea, veritus delicatissimi mel id. Mea at dico ancillae, usu in posse tantas docendi. Fabellas invenire euripidis pri eu. Nec cu sumo nonumes maluisset. Mea ex quidam officiis, has at legere forensibus reprehendunt. Prima exerci vix ut, novum feugait mel at, vel incorrupte scripserit ea. Sale prompta debitis te quo, epicurei perpetua delicatissimi an ius. Duo quaeque mediocrem cu, eirmod accusam cu est. Eum ne laudem quaeque. Eu erant sanctus splendide qui, per commodo quaeque sensibus in. Cu viris aeterno aperiam vis, cum oratio atomorum intellegat in, integre probatus sed ne. Sea id sint euripidis voluptaria, eu est sanctus laboramus eloquentiam. Vel an affert quodsi tractatos, cu has ullum consul legendos, ad sea summo accumsan nominati.', user_id="1", created_at=datetime(2023, 7, 1, 10, 30))
    ]
    for post in posts:
        db.session.add(post) 
    db.session.commit() 

    
    tag_fun = Tag(name='Fun')
    
    db.session.add(tag_fun) 
    db.session.commit() 
    
  