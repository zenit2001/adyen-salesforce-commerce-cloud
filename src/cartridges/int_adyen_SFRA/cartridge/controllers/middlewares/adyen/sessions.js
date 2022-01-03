const Logger = require('dw/system/Logger');
const { createSession } = require('*/cartridge/scripts/adyenSessions');
const BasketMgr = require('dw/order/BasketMgr');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');
const { getCountryCode } = require('*/cartridge/controllers/middlewares/adyen/getPaymentMethod/utils');

/**
 * Make a request to Adyen to create a new session
 */
function callCreateSession(req, res, next) {
  try {
    const currentBasket = BasketMgr.getCurrentBasket();
    const countryCode = getCountryCode(currentBasket, req.locale);
    const response = createSession(
      currentBasket,
      AdyenHelper.getCustomer(req.currentCustomer),
      countryCode,
    );
    Logger.getLogger('Adyen').error(JSON.stringify(response));
    res.json({
      id: response.id,
      sessionData: response.sessionData,
    });
    return next();
  } catch(error) {
    Logger.getLogger('Adyen').error(error);
    return next();
  }
}

module.exports = callCreateSession;
