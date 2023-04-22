def intersection(l1, l2):
    """Return intersection of two lists as a new list::
    
        >>> intersection([1, 2, 3], [2, 3, 4])
        [2, 3]
        
        >>> intersection([1, 2, 3], [1, 2, 3, 4])
        [1, 2, 3]
        
        >>> intersection([1, 2, 3], [3, 4])
        [3]
        
        >>> intersection([1, 2, 3], [4, 5, 6])
        []
    """
#    new_list = []
#    for item1 in l1:
#        for item2 in l2:
#            if item1 == item2:
#                new_list.append(item1)
#    return new_list

    l1_set = set(l1)
    return list(l1_set.intersection(l2))

