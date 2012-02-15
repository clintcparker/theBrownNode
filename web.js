var express = require('express');

var app = express.createServer(express.logger());

app.configure(function(){
    app.use(express.static(__dirname + '/html'));
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.bodyParser());
});

var users = [];

function newUser(fname, lname) {
    return {
        "firstName":fname,
        "lastName" :lname
    };
}

// Return all users that have a property and value matched by the passed searchUser
function getUsers(searchUser) {
    var foundUsers = [];
    for (var i = 0; i < users.length; i++) {
        for(var prop in searchUser) {
            if(searchUser.hasOwnProperty(prop)) {
                console.log(prop);
                if (searchUser[prop] === users[i][prop]) {
                    foundUsers.push(users[i]);
                    break;
                }
            }
                
        }  
    }
    return foundUsers;
}

//users.push(newUser("fred","flintstone"));
//users.push(newUser("doug","funny")); //This was Ez's idea

app.get('/mods', function(request, response) {
    response.send('what mods?');
});

app.get("/users", function(req, res) {
    res.send(users);    
});

app.get("/search", function(req, res) {
    res.sendfile("html/search.html");
});

app.post('/users/search', function(req, res) {
    // Pass the POST body which is assumed, maybe incorrectly, to be json
    res.send(getUsers(req.body)); 
});

app.get("/:name",function(req,res){
    res.sendfile("html/" + req.params.name + ".html") 
});

app.get('/', function(request, response) {
  response.send('Hello World!, i am using express');
});

var port = process.env.C9_PORT || process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});