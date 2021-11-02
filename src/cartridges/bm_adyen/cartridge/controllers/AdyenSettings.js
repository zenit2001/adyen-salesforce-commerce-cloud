'use strict';

const server = require('server');
const csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('Start', csrfProtection.generateToken, function (req, res, next) {
  res.render('helloWorld', {
    text: "I've been passed down from the controller!"
  });
  return next();
});

module.exports = server.exports();
