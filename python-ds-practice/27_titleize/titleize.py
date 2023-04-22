def titleize(phrase):
    """Return phrase in title case (each word capitalized).

        >>> titleize('this is awesome')
        'This Is Awesome'

        >>> titleize('oNLy cAPITALIZe fIRSt')
        'Only Capitalize First'
    """
    words = phrase.split(" ")

    for i in range(len(words)):
        words[i] = words[i].capitalize()

    return " ".join(words)

print(titleize('oNLy cAPITALIZe fIRSt'))