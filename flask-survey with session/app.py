from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension 
from surveys import Question, Survey, satisfaction_survey

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret_key_here'
debug = DebugToolbarExtension(app) 

@app.route('/', methods=["GET","POST"])
def root():
    """
    On home page(GET request for data) then show the title of the survey, the instructions, and a button to start the survey.
    When start button is clicked (POST) -> make cookie session to store data and redirect to first question (/question/0)
    """
    if request.method == "POST":
        session["responses"] = []
        return redirect('/questions/0') 

    return render_template('home.html', satisfaction_survey=satisfaction_survey) 

@app.route('/questions/<int:question_index>') 
def question(question_index):
    """
    when visiting /question/# it triggers a GET request to retrieve and display(using question.html) the current question based on the question_index parameter.
    When the form submits(answer question) within question.html it triggers a POST request to /answer
    Condition to prevent accessing questions before start and skipping ahead question
    """
    if session.get("responses") is None:    # trying to access questions before start
        return redirect('/')
    if len(session.get("responses")) !=  question_index:    # trying to access questions out of order
        return redirect(f'/questions/{len(session.get("responses"))}')  
    else:
        return render_template('question.html', question=satisfaction_survey.questions[question_index], index=question_index)

@app.route('/answer', methods=["POST"])
def answer():
    """
    Data(response/answer) send here as a POST request from question.html form.
    Store the data in session['responses'], check if all questions are completed then redirect to /complete page.
    Redirect using GET request to next /question/# page
    """
    response = request.form['answer']   # retrieves the value(answer) of the form and set it to response
    responses = session["responses"]    # retrieves session data and set it to responses
    responses.append(response)  # add response to responses
    session["responses"] = responses    # updates the value stored in the session

    if len(session["responses"]) == (len(satisfaction_survey.questions)):   # answered all questions
        return redirect('/complete')

    question_index = int(request.form['index'])
    return redirect(f'/questions/{question_index + 1}')     # redirect to next question

@app.route('/complete')
def complete():
    """Show the survey completion page"""
    return render_template('complete.html')
