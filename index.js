/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const Server = require('./lib/server');
const server = new Server();

const port = process.argv[2] ? process.argv[2] : 3000;
const allowOrigin = process.argv[3] ? process.argv[3] : '*';

server.start(port, allowOrigin);
