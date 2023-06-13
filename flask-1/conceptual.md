### Conceptual Exercise

Answer the following questions below:

-   What are important differences between Python and JavaScript?  
    
	Python is commonly used for various applications, including web development on the backend (server/data), while JavaScript is primarily used for frontend web development (user interface/experience, client-side) as well as backend development.

	In Python, indentation is important for organizing code, whereas in JavaScript, curly braces and semicolons fulfill that role.

-   Given a dictionary like `{"a": 1, "b": 2}`: , list two ways you
    can try to get a missing key (like "c") _without_ your programming
    crashing.  
	
	Two ways to retrieve a missing key without causing a program crash are:

	* Using the get() method to retrieve the value of key 'c' and return a default value if the key is not present. Example: value = my_dict.get('c', 'not found').
	
	* Utilizing a conditional expression, such as a ternary operator, to check if the key 'c' is present in the dictionary and return a default value if it's not. Example: value = my_dict['c'] if 'c' in my_dict else 'Default value'.
	  
-   What is a unit test?

	A unit test is a type of test that focuses on testing small, independent parts of the code. Unit tests are designed to validate the correctness of functions, methods, or classes, in isolation.

-   What is an integration test?

	An integration test is a type of test that checks the interactions and compatibility between different components or modules of an application.

-   What is the role of web application framework, like Flask?

	Web application frameworks make web development easier by providing structures and tools. They simplify tasks such as handling requests, generating responses, routing URLs, etc.
	
-   You can pass information to Flask either as a parameter in a route URL
    (like '/foods/pretzel') or using a URL query param (like
    'foods?type=pretzel'). How might you choose which one is a better fit
    for an application?

	Whether to use a route URL or a query para, take into account:
	* Passing parameters in the route URL provides a straightforward and descriptive structure as the parameters are directly incorporated into the URL itself.
	
	* Passing parameters in the route URL is less flexible compared to using URL query parameters since modifying or adding parameters requires changes to the route structure.

-   How do you collect data from a URL placeholder parameter using Flask?

	In Flask, you can use the route() decorator to define routes and collect data from URL placeholder parameters. Example: 

		@app.route('users/<username>')  	
			def get_user(username):  
			...

-   How do you collect data from the query string using Flask?

	In Flask, you can use the get() method on the request.args object to collect data from the query string. For example, page = request.args.get('page') retrieves the value of the 'page' parameter from the query string (https://example.com/category=dog&page=1).

-   How do you collect data from the body of the request using Flask?

	In Flask, you can collect data from the request using the request object. The method you use depends on the type of data being sent in the request. For example:

	* To collect form data, you can use request.form.get('key') to retrieve the value of a specific form field.
	
	* To collect JSON data, you can use request.get_json() to parse the JSON data sent in the request body and retrieve its contents.

-   What is a cookie and what kinds of things are they commonly used for?

	A cookie is a small piece of data that is stored on the client's web browser. It is commonly used for purposes such as session management and user personalization. Session data is stored on the server, the cookie serves as a token/id. 

-   What is the session object in Flask?

	The session object in Flask is a built-in feature that lets you store and retrieve user-specific information. It allows users to maintain their data across different requests, ensuring that important information like user preferences, authentication state, or a high score is not lost, even if the page is refreshed..

-   What does Flask's `jsonify()` do?

	A function that simplifies the process of converting dictionary or Python object into JSON format and prepares it to be sent as a response. In Flask(Python), the 'jsonify()' function is similar to JavaScript 'JSON.stringify()'. Example:

			data = {'name': 'John', 'age': 30, 'city': 'New York'}
	    	return jsonify(data)
