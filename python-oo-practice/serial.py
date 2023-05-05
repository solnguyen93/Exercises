"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """
    def __init__(self, start=100):
      """Make a number generator, starting at the given value (default 100)"""
      self.start = start 
      self.original = start

    def reset(self):
        """Return the value back to the start value"""
        self.start = self.original

    def generate(self):
        """Add 1 to the value and return"""
        self.start += 1
        return self.start -1
    
serial = SerialGenerator(start=0)
