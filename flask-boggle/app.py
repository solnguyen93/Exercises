from flask import Flask, request, render_template, session, jsonify, abort
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key_here'
app.config['TESTING'] = True  
app.config['DEBUG_TB_HOSTS'] = ['dont-show-deb-toolbar']  
debug = DebugToolbarExtension(app) 

boggle_game = Boggle()

@app.route('/')
def home_page():
    """
    Set the game board, get highest score and total plays stored inside session
    Send data to index.html to fill in
    """
    board = boggle_game.make_board()
    session['board'] = board
    highest_score = session.get('highest_score', 0)
    total_plays = session.get('total_plays', 0)
    return render_template('index.html',board=board, highest_score=highest_score, total_plays=total_plays)

# The JavaScript code handles the form submission event, retrieves the word input, and sends an Axios GET request to the Flask server's '/check-word' route with the word as a query parameter. 
# The Flask server-side code receives the word, validates it on the game board, and returns a JSON response with the validation result. 
# The JavaScript code then displays the appropriate message based on the JSON response, informing the user if the word is valid on the board or not.
@app.route('/check-word')
def check():
    """check if word is valid"""
    word = request.args.get("word")
    if not word:
    # Empty word
        abort(400, "Please provide a word")
    if not word.isalpha():
    # Non-alphabetic character
        abort(400, "Please enter alphabetic characters only.")
    board = session['board']
    response = boggle_game.check_valid_word(board, word)
    return jsonify({'result': response})



@app.route('/update-score',methods=['POST'])
def update_score():
    """
    Get the value of highest score and total plays stored inside session, if none then 0
    Update total play and if new score is higher update highest score 
    Return highest score and total plays in the form of an API response (two key-value pairs)
    """
    new_score = request.json.get('score')
    if new_score is not None and isinstance(new_score, int):
        highest_score = session.get('highest_score', 0)
        total_plays = session.get('total_plays', 0)

        if new_score > highest_score:
            session['highest_score'] = new_score
            highest_score = new_score

        session['total_plays'] = total_plays + 1

        return jsonify({'highestScore': highest_score, 'totalPlays': total_plays + 1})
    else:
        return jsonify({'error': 'Invalid score'})
    

