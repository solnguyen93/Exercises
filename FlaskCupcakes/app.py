from flask import Flask, request, jsonify, render_template, redirect, flash, session
from models import db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'  
app.config['SQLALCHEMY_ECHO'] = True   
app.config['SECRET_KEY'] = 'secret_key_here'

db.init_app(app)


@app.route('/')
def list_cupcakes():
    return render_template('cupcake_list.html')

@app.route('/api/cupcakes')  # GET all
def get_all_cupcakes():
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcake=all_cupcakes)  

@app.route('/api/cupcakes/<int:id>')  # GET single
def get_a_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize())  


@app.route('/api/cupcakes', methods=['POST'])   # POST to create (code 201)
def create_cupcake():
    new_cupcake = Cupcake(
        flavor=request.json['flavor'],
        size=request.json['size'],
        rating=request.json['rating'],
        image=request.json['image']
    )
    db.session.add(new_cupcake)
    db.session.commit()
    return (jsonify(cupcake=new_cupcake.serialize()), 201) 

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])  # PATCH (partial update)
def update_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = request.json.get('flavor',cupcake.flavor)    
    cupcake.size = request.json.get('size',cupcake.size)
    cupcake.rating = request.json.get('rating',cupcake.rating)
    cupcake.image = request.json.get('image',cupcake.image)
   
    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())  

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message='deleted')  


