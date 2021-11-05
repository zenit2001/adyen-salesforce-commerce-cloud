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

server.post('Save',
    csrfProtection.generateToken,
    server.middleware.https,
    function (req, res, next) {

  const merchantAccountValue = req.form.merchantAccount;
  AdyenHelper.setAdyenMerchantAccount(merchantAccountValue);
  res.render('helloWorld', {
    text: "I've been passed down from the controller via the button!",
    environment: AdyenHelper.getAdyenEnvironment(),
    merchantAccount: AdyenHelper.getAdyenMerchantAccount(),
  });
  return next();
});

module.exports = server.exports();
