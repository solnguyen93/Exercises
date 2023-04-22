def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    list1 = [int(n) for n in str(num1)]
    list2 = [int(n) for n in str(num2)]
    list1.sort()
    list2.sort()
    return list1 == list2
