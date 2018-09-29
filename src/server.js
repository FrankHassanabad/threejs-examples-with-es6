'use strict';

const fs    = require('fs');
const http = require('http');
const mime  = require('mime');
const path  = require('path');

/**
 * Constructs a simple server that serves up static HTML files.
 */
class Server {

  /**
   * Constructs the Server given a port, static directory, key, and cert.
   * Everything is optional with defaults.
   * @param {Number} port      - Port number
   * @param {String} staticDir - Directory location of the static files
   */
  constructor({ port, staticDir } = {
    port      : 8080,
    staticDir : path.join(__dirname, '../public'),
  }) {
    this._port      = port;
    this._staticDir = staticDir;
    this._http      = this._createServer();
  }

  /**
   * On request and response this will respond with the static file
   * if found, or a simple 404 response.
   * @param {Object} req - The HTTP request
   * @param {Object} res - The HTTP response
   * @returns {void}
   */
  _onReq({ req, res }) {
    const fileName = path.join(this._staticDir, req.url);
    if (this._isValidStaticFile({ fileName })) {
      this._respondFile({ res, fileName });
    } else {
      this._respond404({ res });
    }
  }

  /**
   * Given a response and a fileName this will respond with that file
   * and its mime type.
   * @param {String} fileName - The file to read and pipe to the client
   * @param {Object} res      - The HTTP response
   * @returns {void}
   */
  _respondFile({ res, fileName }) {
    res.writeHead(200, { 'Content-Type' : mime.lookup(fileName) });
    fs.createReadStream(fileName).pipe(res).on('finish', res.end);
  }

  /**
   * Given a response this will return a simple 404 not found page.
   * @param {Object} res - The HTTP response
   * @returns {void}
   */
  _respond404({ res }) {
    res.writeHead(404);
    res.end();
  }

  /**
   * Creates a server given the key and certificate file object read into
   * memory.
   * @returns {Object} - The http server
   */
  _createServer() {
    return http.createServer((req, res) => this._onReq({ req, res }));
  }

  /**
   * Returns true if the fileName is a valid static file on the file system
   * and is part of the static directory. Otherwise returns false.
   * @param {String} fileName - The string fileName
   * @returns {Boolean}       - True if the file exists on the file system, otherwise false
   */
  _isValidStaticFile({ fileName }) {
    return (
      fileName.indexOf(this._staticDir) === 0 &&
      fs.existsSync(fileName) &&
      fs.statSync(fileName).isFile()
    );
  }

  /**
   * Returns the port number
   * @returns {Number} The port number set
   */
  get port() {
    return this._port;
  }

  /**
   * Listens on the port.
   * @returns{void}
   */
  listen() {
    this._http.listen(this._port);
  }

}

module.exports = Server;
