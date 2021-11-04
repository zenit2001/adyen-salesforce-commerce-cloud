'use strict';

const server = require('server');
const csrfProtection = require('*/cartridge/scripts/middleware/csrf');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

server.get('Start', csrfProtection.generateToken, function (req, res, next) {
  res.render('helloWorld', {
    text: "I've been passed down from the controller!",
    environment: AdyenHelper.getAdyenEnvironment(),
    merchantAccount: AdyenHelper.getAdyenMerchantAccount(),
  });
  return next();
});

server.get('getSetting', csrfProtection.generateToken, function (req, res, next) {
  res.render('helloWorld', {
    text: "I've been passed down from the controller via the button!",
    environment: AdyenHelper.getAdyenEnvironment(),
    merchantAccount: AdyenHelper.getAdyenMerchantAccount(),
  });
  return next();
});

module.exports = server.exports();
