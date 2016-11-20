'use strict';

const Server = require('./src/server');

const server = new Server();

server.listen();
console.log('Server listening on port:', server.port);
