def print_upper_words(list_of_words):
    """print each word in a list all uppercased on separate line"""

    for word in list_of_words:
        print (word.upper())


def print_upper_words_with_e(list_of_words):
    """print each word in a list all uppercased on separate line if it starts with the letter e/E"""

    for word in list_of_words:
        if word.startswith('E') or word.startswith('e'):
            print (word.upper())

def print_upper_words_start_with(list_of_words, start_with):
    """print each word in a list all uppercased on separate line if it starts with given letter"""

    for word in list_of_words:
        for letter in start_with:
            if word.startswith(letter.upper()):
                print (word.upper())
            elif word.startswith(letter.lower()):
                print (word.upper())


print_upper_words_start_with(["hello", "hey", "goodbye", "yo", "yes"], {"H", "y"})