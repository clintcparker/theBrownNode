var express = require('express');

var app = express.createServer(express.logger());

var users = [];

function newUser(fname, lname) {
    return {
        "firstName":fname,
        "lastName" :lname
    }
}

users.push(newUser("fred","flintstone"));
users.push(newUser("doug","funny")); //This was Ez's idea

app.get('/mods', function(request, response) {
  response.send('what mods?');
});

app.get("/users", function(req, res) {
    res.send(users);    
});

app.get('/', function(request, response) {
  response.send('Hello World!, i am using express');
});

var port = process.env.C9_PORT || process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});