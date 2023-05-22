from flask import Flask, request, render_template, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension 
from surveys import Question, Survey, satisfaction_survey

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret_key_here'
debug = DebugToolbarExtension(app) 

responses = []

@app.route('/') # Home page
def root():
    """Show the title of the survey, the instructions, and a button to start the survey"""
    return render_template('home.html', satisfaction_survey=satisfaction_survey) 

@app.route('/questions/<int:question_index>', methods=["GET","POST"]) 
def question(question_index):
    """
    when visiting /question/# it triggers a GET request to retrieve and display(using question.html) the current question based on the question_index parameter.
    When the form submits(answer question) within question.html it triggers a POST request to /answer
    """
    # prevent access to /question/0 in url (must use start button)
    if request.method == 'GET' and not responses:
        flash('Please start the survey first.')
        return redirect('/')
    # prevent skipping question using url
    if question_index != len(responses):
        flash('Please answer the questions sequentially')
        return redirect(f'/questions/{len(responses)}')

    return render_template('question.html', question=satisfaction_survey.questions[question_index], index=question_index)

@app.route('/answer', methods=["POST"])
def answer():
    """
    Data(response/answer) send here as a POST request from question.html form.
    Store the data in responses(list), check if all questions are completed then redirect to /complete page.
    Redirect using GET request to next /question/# page
    """
    question_index = int(request.form['index'])
    response = request.form['answer']
    responses.append(response)
    
    if question_index == (len(satisfaction_survey.questions) -1):
        return redirect('/complete')
    else:
        return redirect(f'/questions/{question_index + 1}')

@app.route('/complete')
def complete():
    """Show the survey completion page"""
    # prevent access to complete page until all questions are completed
    if len(responses) != len(satisfaction_survey.questions):
        flash('Please answer all the questions.')
        return redirect(f'/questions/{len(responses)}')
    return render_template('complete.html')


if __name__ == '__main__':
    app.run(debug=True)

