'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

const proxyquire = require('proxyquire');
const chai       = require('chai');
const path       = require('path');
const sinon      = require('sinon');
const sinonChai  = require('sinon-chai');

chai.use(sinonChai);
const { expect } = chai;

// Stub fs reads and http2 create server
const createServerStub = sinon.stub().returns({});

const Server = proxyquire('../src/server', {
  http : {
    createServer : createServerStub,
  },
});

describe('server', () => {
  afterEach(() => {
    createServerStub.reset();
  });

  it('should be a class/function', () => expect(Server).to.be.a('function'));

  it('should create the class/function', () => expect(new Server()).to.be.a('object'));

  describe('#constructor', () => {
    it.only('should call create server once on instantiation', () => {
      const server = new Server();
      expect(createServerStub).to.have.been.calledOnce;
    });

    it('should set default port of 8080', () => expect(new Server().port).to.eql(8080));

    it('should set default static dir to contain public', () => expect(new Server()._staticDir).to.contain('public'));

    it('should take a different port number', () => expect(new Server({ port : 1 }).port).to.eql(1));

    it('should take a different static dir', () => expect(new Server({ staticDir: 'somethingelse' })._staticDir).to.eql('somethingelse'));
  });

  describe('#_isValidStaticFile', () => {
    it('should return that it is in the static directory', () => {
      const server = new Server({ staticDir : path.join(__dirname) });
      expect(server._isValidStaticFile({ fileName  : path.join(__dirname, 'server.js') })).to.be.true;
    });

    it('should return that it is NOT in the static directory', () => {
      const server = new Server({ staticDir : path.join(__dirname) });
      expect(server._isValidStaticFile({ fileName  : path.join(__dirname, 'junk') })).to.be.false;
    });

    it('should return that it is NOT in the static directory since it is a directory', () => {
      const server = new Server({ staticDir : path.join(__dirname) });
      expect(server._isValidStaticFile({ fileName  : path.join(__dirname, '../test') })).to.be.false;
    });
  });

  describe('#port', () => {
    it('should return the port number set', () => {
      expect(new Server().port).to.eql(8080);
    });
  });
});
