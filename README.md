#web.js

        var express = require('express');
        
        var app = express.createServer(express.logger());
        
        app.get('/mods', function(request, response) {
          response.send('what mods?');
        });
        
        app.get('/', function(request, response) {
          response.send('Hello World!, i am using express');
        });
        
        var port = process.env.C9_PORT || process.env.PORT || 3000;
        app.listen(port, function() {
          console.log("Listening on " + port);
        });
        
#package.json

        {
          "name": "node_example",
          "version": "0.0.1",
          "dependencies":{
           "express" : "2.5.8"   
          }
        }
        
#Procfile

        web: node web.js