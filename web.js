var express = require('express');
var app = express.createServer(express.logger());
var _ = require("./html/js/Underscore");

var test = require("./html/js/testing");
var serverTests = test.testingObj;

serverTests.setDefaults({
    useConsole:true,
    isAjax:false
});
var obj = {testKey:"testValue"};
var arr = [{testKey:"testValue"},{testKey2:"testValue2"}];

serverTests.addToTests({
    desc: 'getObjsInArray, obj:{testKey:"testValue"}, arr:[{testKey:"testValue"},{testKey2:"testValue2"}]',
    testFunction : function () { 
        return (getObjsInArray(obj, arr).length > 0 && getObjsInArray(obj, arr)[0].testKey === obj.testKey); 
    }
});

serverTests.addToTests({
    desc: 'getObjIndicesInArray, obj:{testKey:"testValue"}, arr:[{testKey:"testValue"},{testKey2:"testValue2"}]',
    testFunction : function () { 
        return ((getObjIndicesInArray(obj, arr).length > 0) && (getObjIndicesInArray(obj, arr)[0] === 0)); 
    }
});

serverTests.runTests();

app.configure(function(){
    app.use(express.static(__dirname + '/html'));
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.bodyParser());
});

var users = [];

// Return all users that have a property and value matched by the passed searchUser
function getObjsInArray(obj, array) {
    var foundObjs = [];
    for (var i = 0; i < array.length; i++) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                //console.log(prop);
                if (obj[prop] === array[i][prop]) {
                    foundObjs.push(array[i]);
                    break;
                }
            }
        }  
    }
    return foundObjs;
}

function getObjIndicesInArray(obj, array) {
    var foundIndices = [];
    for (var i = 0; i < array.length; i++) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                //console.log(prop);
                if (obj[prop] === array[i][prop]) {
                    foundIndices.push(i);
                    break;
                }
            }
        }  
    }
    return foundIndices;
}

function getUsers(searchUser) {
    return getObjsInArray(searchUser, users);
}

function getUserIndices(searchUser) {
    return getObjIndicesInArray(searchUser, users);
}

function updateUser(searchUser) {
    var foundUsers = [];
    var user_id = parseInt(searchUser.id, 10);
    var foundUserIndices = getUserIndices({ id: user_id });
    if (foundUserIndices.length > 0) {
        _.extend(users[foundUserIndices[0]], searchUser);
        foundUsers.push(users[foundUserIndices[0]]);
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

app.post("/users/add", function(req, res) {
    users.push(req.body);
    var user = users[users.length - 1];
    user.id = users.length;
    user.active = false;
    res.send(user);
});

app.get("/users/search/:name", function(req, res, next) {
    var searchResults = getUsers({ name: req.params.name }) ;
    if ( searchResults.length > 0 ) {
        res.send( searchResults );
    }
    else
        next();
});

app.get("/users/search/:id", function(req, res) {
    res.send( getUsers({ id: parseInt(req.params.id, 10) }) );
});

app.post("/users/update", function(req, res) {
    res.send(updateUser(req.body));
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