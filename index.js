/*!
 * minder
 * Copyright(c) 2018 Passionate Engineer Ryoju
 */

'use strict';

const port = (process.argv[2]) ? process.argv[2] : 3000;
const server = new require('./lib/server');

server.start(port);
