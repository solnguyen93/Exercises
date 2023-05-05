"""
Word Finder: finds random words from a dictionary.

    >>> wf = WordFinder("C:/Users/Sol/CODING/python-oo-practice/simple.txt")
    3 words read
    >>> wf.random() in ["cat", "dog", "mouse"]
    True
    >>> wf.random() in ["cat", "dog", "mouse"]
    True
    >>> wf.random() in ["cat", "dog", "mouse"]
    True

"""

import random

class WordFinder:
    """Create a list of words from a file"""
    def __init__(self, file_path):
        """open file, run make_list function (make a list of words), close file"""
        file = open(file_path, 'r')
        self.make_list(file)
        self.print_total()
        file.close()

    def make_list(self, file):
        """append each word(one word per line) to a list"""
        self.words = [line.strip() for line in file]
        return self.words
    
    def print_total(self):
        """print total number of words in file"""
        print(f'{len(self.words)} words read')
 
    def random(self):
        """Return a random word from list of words"""
        return random.choice(self.words)

class SpecialWordFinder(WordFinder):
    def make_list(self, file):
        """
        Overwrite super class make_list. 
        Remove trailing and leading spaces of a word. 
        Check if line is only black spaces(empty) and if it does NOT start with '#'
        """
        self.words= [line.strip() for line in file if line.strip() and not line.startswith('#')]
        return self.words

# wf = WordFinder("C:/Users/Sol/CODING/python-oo-practice/simple.txt")
# word = WordFinder("C:/Users/Sol/CODING/python-oo-practice/words.txt")

