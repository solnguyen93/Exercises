"""Madlibs Stories."""
from flask import Flask, request, render_template 
from flask_debugtoolbar import DebugToolbarExtension
app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret_key_here'
debug = DebugToolbarExtension(app) 

class Story:
    """Madlibs story.

    To  make a story, pass a list of prompts, and the text
    of the template.

        >>> s = Story(["noun", "verb"],
        ...     "I love to {verb} a good {noun}.")

    To generate text from a story, pass in a dictionary-like thing
    of {prompt: answer, promp:answer):

        >>> ans = {"verb": "eat", "noun": "mango"}
        >>> s.generate(ans)
        'I love to eat a good mango.'
    """

    def __init__(self, words, text):
        """Create story with words and template text."""

        self.prompts = words
        self.template = text

    def generate(self, answers):
        """Substitute answers into text."""

        text = self.template

        for (key, val) in answers.items():
            # handle None value depending on story1 or story2
            if val is not None:
                text = text.replace("{" + key + "}", str(val))

        return text


# Here's a story to get you started


story1 = Story(
    ["place", "noun", "verb", "adjective", "plural_noun"],
    """Once upon a time in a long-ago {place}, there lived a
       large {adjective} {noun}. It loved to {verb} {plural_noun}."""
)

story2 = Story(
    ["verb", "noun"],
    """I love to {verb} a {noun}."""
)


@app.route('/')
def pick_form():
    """select a story template on home page"""
    storyid = ["story1","story2"]
    return render_template('pick_form.html',storyid=storyid) # form action to call another app.route with method POST


@app.route('/form', methods=["GET","POST"])
def story_form():
    """show story form on home page"""
    storyid = request.form.get('story')
    print("select_story:", storyid)
    return render_template('form.html',storyid=storyid)

@app.route('/story', methods=["POST"])
def show_story():
    """Generate and show story result"""

    # get user input values
    place = request.form.get('place')
    noun = request.form.get('noun')
    verb = request.form.get('verb')
    adjective = request.form.get('adjective')        
    plural_noun = request.form.get('plural_noun')
    storyid = request.form.get('story')

    # store values in dict
    answers = {
        "place": place,
        "noun": noun,
        "verb": verb,
        "adjective": adjective,
        "plural_noun": plural_noun
    }

    # use dict to generate story with .generate method from class Story
    generated_story = ""
    # different story template
    if storyid == "story1":
        generated_story = story1.generate(answers)
    elif storyid == "story2":
        generated_story = story2.generate(answers)

    # provide story.html with data to display story
    return render_template('story.html', story=generated_story)