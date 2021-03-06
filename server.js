// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 1, task: 'Laundry', description: 'Wash clothes' },
  { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api/todos/search', function search(req, res){
	if (req.query.q) {
		var searchTask = req.query.q;
		// var searchDescription = req.query.description;
		var resultsArray = [];
		todos.forEach(function(element) {
			if (element.task === searchTask) {
				resultsArray.push(element);
			}
		});
		res.json({todos: resultsArray});
	} else {
	res.sendFile(__dirname + '/views/search.html');
		}
});

app.get('/api/todos', function index(req, res) {
	res.json({todos: todos});
});

app.post('/api/todos', function create(req, res) {
	var newTodo = req.body;
	if (todos.length > 0) {
		newTodo._id = todos[todos.length - 1]._id + 1;
	} else {
		newTodo._id = 1;
	}
	todos.push(newTodo);
	res.json(newTodo);
});

app.get('/api/todos/:id', function show(req, res) {
	var idx = req.params.id - 1;
	res.send(todos[idx]);
});

app.put('/api/todos/:id', function update(req, res) {
	var updatedTask = req.body.task;
	var updatedDescription = req.body.description;
	var idx = req.params.id - 1;
	todos[idx].task = updatedTask;
	todos[idx].description = updatedDescription;
	res.json(todos[idx]);
});

app.delete('/api/todos/:id', function destroy(req, res) {
	var idx = req.params.id - 1;
	todos.splice(idx, 1);
	res.json(todos);
});


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('server running on localhost://3000');
});
