/**
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen Salesforce Commerce Cloud
 * Copyright (c) 2021 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 *
 * save Adyen Notification
 * see page 22 of Adyen Integration manual
 *
 * v1 110324 : logging to file
 * v2 110325 :
 * v3 110408 : pass on OrderNo, Paymentresult for update
 * v4 130422 : Merged adyen_notify and update_order into single script
 *
 */
const Logger = require('dw/system/Logger');
const Calendar = require('dw/util/Calendar');
const StringUtils = require('dw/util/StringUtils');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');

function execute(args) {
  return notifyHttpParameterMap(args.CurrentHttpParameterMap);
}

function notifyHttpParameterMap(hpm) {
  if (hpm === null) {
    Logger.getLogger('Adyen', 'adyen').fatal(
      'Handling of Adyen notification has failed. No input parameters were provided.',
    );
    return PIPELET_NEXT;
  }

  const notificationData = {};
  for (const parameterName of  hpm.getParameterNames().toArray()) {
    notificationData[parameterName] = hpm[parameterName].stringValue;
  }

  return notify(notificationData);
}
function notify(notificationData) {
  // Check the input parameters
  if (notificationData === null) {
    Logger.getLogger('Adyen', 'adyen').fatal(
      'Handling of Adyen notification has failed. No input parameters were provided.',
    );
    return PIPELET_NEXT;
  }

  try {
    const msg = createLogMessage(notificationData);
    Logger.getLogger('Adyen').debug(msg);
    const calObj = new Calendar();
    const keyValue = `${notificationData.merchantReference}-${StringUtils.formatCalendar(calObj, 'yyyyMMddhhmmssSSS')}`;
    const customObj = CustomObjectMgr.createCustomObject(
      'adyenNotification',
      keyValue,
    );
    for (const field in notificationData) {
      try {
        customObj.custom[field] = notificationData[field];
      } catch (e) {
        /* unknown field */
      }
    }

    switch (notificationData.eventCode) {
      case 'AUTHORISATION':
        // Save all request to custom attribute for Authorization event
        customObj.custom.Adyen_log = JSON.stringify(notificationData);
      // eslint-disable-next-line no-fallthrough
      case 'CANCELLATION':
      case 'CANCEL_OR_REFUND':
      case 'REFUND':
      case 'CAPTURE_FAILED':
      case 'ORDER_OPENED':
      case 'ORDER_CLOSED':
      case 'OFFER_CLOSED':
      case 'PENDING':
      case 'CAPTURE':
        customObj.custom.updateStatus = 'PROCESS';
        Logger.getLogger('Adyen').info(
          "Received notification for merchantReference {0} with status {1}. Custom Object set up to 'PROCESS' status.",
          notificationData.merchantReference,
          notificationData.eventCode,
        );
        break;
      default:
        customObj.custom.updateStatus = 'PENDING';
        Logger.getLogger('Adyen').info(
          "Received notification for merchantReference {0} with status {1}. Custom Object set up to 'PENDING' status.",
          notificationData.merchantReference,
          notificationData.eventCode,
        );
    }
    return {
      success: true,
    };
  } catch (e) {
    Logger.getLogger('Adyen', 'adyen').error(
      `Notification failed: ${JSON.stringify(notificationData)}\n` +
        `Error message: ${e.message}`,
    );
    return {
      success: false,
      errorMessage: e.message,
    };
  }
}

function createLogMessage(notificationData) {
  const VERSION = '4d';
  let msg = '';
  msg = `AdyenNotification v ${VERSION}`;
  msg += '\n================================================================\n';
  msg = `${msg}reason : ${notificationData.reason}`;
  msg = `${msg}\neventDate : ${notificationData.eventDate}`;
  msg = `${msg}\nmerchantReference : ${notificationData.merchantReference}`;
  msg = `${msg}\ncurrency : ${notificationData.currency}`;
  msg = `${msg}\npspReference : ${notificationData.pspReference}`;
  msg = `${msg}\nmerchantAccountCode : ${notificationData.merchantAccountCode}`;
  msg = `${msg}\neventCode : ${notificationData.eventCode}`;
  msg = `${msg}\nvalue : ${notificationData.value}`;
  msg = `${msg}\noperations : ${notificationData.operations}`;
  msg = `${msg}\nsuccess : ${notificationData.success}`;
  msg = `${msg}\npaymentMethod : ${notificationData.paymentMethod}`;
  msg = `${msg}\nlive : ${notificationData.live}`;
  return msg;
}

module.exports = {
  execute,
  notify,
  notifyHttpParameterMap,
};
