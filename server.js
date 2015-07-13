var Hapi = require('hapi'),
    config = require('config'),
    spawn = require('child_process').spawn

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

/**
{
"state": "success",
"description": "387 tests PASSED",
"context": "Continuous integration by Acme CI",
"target_url": "http://ci.acme.com/results/afd339c1c3d27"
}
**/

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
