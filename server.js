#!/usr/bin/env node

var Hapi = require('hapi'),
    config = require('config'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    Hoek = require('hoek');

var configFile = './config/default.json';
Hoek.assert(fs.existsSync('./config/default.json'), 'No config file found. Looking for '+configFile);
Hoek.assert(config.events && config.events.push, 'Push script should be specified in config.events.push');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'POST',
    path: '/hub/push',
    handler: function (request, reply) {

        var script = spawn('sh', [ config.events.push, request.payload.repository.repo_name ], {});

        script.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });

        script.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });

        script.on('close', function (code) {
          console.log('child process exited with code ' + code);
          reply({
            state: "success"
          });
        });
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
