def flip_case(phrase, to_swap):
    """Flip [to_swap] case each time it appears in phrase.

        >>> flip_case('Aaaahhh', 'a')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'A')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'h')
        'AaaaHHH'

    """
    new_phrase = ''

    for char in phrase:
        if char == to_swap.swapcase() or char == to_swap: # if current char equal to the to_swap char lower or upper
            new_phrase += char.swapcase() # add char to the new_phrase
        else:
            new_phrase += char # add char to new_phrase (doesn't need to swapcase)
    return new_phrase



print(flip_case('Aaaahhh', 'a'))