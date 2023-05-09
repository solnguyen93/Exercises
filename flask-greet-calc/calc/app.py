# Put your app in here.
from operations import *
from flask import Flask, request
app = Flask(__name__)

def get_args():
    try:
        a = int(request.args.get('a'))
        b = int(request.args.get('b'))
        if a is None or b is None:
            raise ValueError('Missing Value. Both a and b are required.')
        return a, b
    except ValueError:
        print('Invalid Value. Both a and b must be int.')

@app.route('/add')
def add_route():
    a,b = get_args()
    result = add(a,b)
    return str(result)

@app.route('/sub')
def subtract():
    a,b = get_args()
    result = sub(a,b)
    return str(result)

@app.route('/mult')
def multiply():
    a,b = get_args()
    result = mult(a,b)
    return str(result)

@app.route('/div')
def divide():
    a,b = get_args()
    result = div(a,b)
    return str(result)




OPERATIONS = {
    'add' : add,
    'sub' : sub,
    'mult': mult,
    'div' : div
}

@app.route('/math/<op>')
def all_in_one(op):
    a,b = get_args()
    operation = OPERATIONS[op]
    result = operation(a,b)
    return str(result)