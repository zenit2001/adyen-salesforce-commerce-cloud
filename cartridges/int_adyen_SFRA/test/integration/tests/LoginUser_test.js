"use strict";

Feature('Credit card');

var config = require('../config');

Scenario('Logged in Credit card success', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.newCardPayment();
  I.setCardDetails(config.cardSuccess);
  I.submitPayment();
  I.placeOrder();
  I.see('Thank you');
});
Scenario('Logged in Credit card 3d success', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.newCardPayment();
  I.setCardDetails(config.cardSuccess3D);
  I.submitPayment();
  I.placeOrder();
  I.set3dDetails(config.threeds2DetailsSuccess);
  I.switchTo();
  I.see('Thank you');
});
Scenario('Logged in Credit card failed', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.newCardPayment();
  I.setCardDetails(config.cardFail);
  I.submitPayment();
  I.placeOrder();
  I.dontSee('Thank you');
});
Scenario('Logged in Credit card 3d failed', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.newCardPayment();
  I.setCardDetails(config.cardFail3D);
  I.submitPayment();
  I.placeOrder();
  I.set3dDetails(config.threeds2DetailsFail);
  I.dontSee('Thank you');
});
Scenario('Logged in Credit card store details and subsequent payment', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.setCardDetails(config.cardSuccess);
  I.setStoreDetails();
  I.submitPayment();
  I.placeOrder();
  I.see('Thank you');
  I.amOnPage(config.Storefront.url);
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.click('.submit-shipping');
  I.fillField('#email', config.userAccount.username);
  I.setOneclickCVC(config.cardSuccess);
  I.submitPayment();
  I.placeOrder();
  I.see('Thank you');
});
Scenario('Logged in Credit card Oneclick success', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.setOneclickCVC(config.cardSuccess);
  I.submitPayment();
  I.placeOrder();
  I.see('Thank you');
});
Scenario('Logged in Credit card Oneclick fail', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.setOneclickCVC(config.cardFail);
  I.submitPayment();
  I.placeOrder();
  I.dontSee('Thank you');
});
Scenario('iDeal success', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.selectIdealPayment();
  I.selectIssuerSuccess();
  I.submitPayment();
  I.placeOrder();
  I.wait(5);
  I.continueOnHppIdeal();
  I.see('Thank you');
});
Scenario('iDeal fail', function (I) {
  I.amOnPage(config.Storefront.url);
  I.confirmTrackingConsent();
  I.addProductToCart();
  I.amOnPage(config.Storefront.login);
  I.checkoutLoggedIn(config.userAccount);
  I.selectIdealPayment();
  I.selectIssuerPending();
  I.submitPayment();
  I.placeOrder();
  I.wait(5);
  I.continueOnHppIdeal();
  I.dontSee('Thank you');
});