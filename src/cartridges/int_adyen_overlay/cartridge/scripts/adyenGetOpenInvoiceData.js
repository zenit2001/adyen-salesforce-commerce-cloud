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
 * Generate the parameters needed for the redirect to the Adyen Hosted Payment Page.
 * A signature is calculated based on the configured HMAC code
 */
require('dw/crypto');
require('dw/system');
require('dw/order');
require('dw/util');
require('dw/value');
require('dw/net');
require('dw/web');

// script include
const LineItemHelper = require('*/cartridge/scripts/util/lineItemHelper');

function getDiscount(amount, adjustedAmount) {
  return -1 * (amount - adjustedAmount);
}

function getLineItems({ Order: order, Basket: basket, addTaxPercentage }) {
  if (!(order || basket)) return null;
  const orderOrBasket = order || basket;
  const allLineItems = orderOrBasket.getProductLineItems();

  // Add all product and shipping line items to request
  const lineItems = [];
  for (const item in allLineItems) {
    const lineItem = allLineItems[item];
    if (
        (lineItem instanceof dw.order.ProductLineItem &&
            !lineItem.bonusProductLineItem) ||
        lineItem instanceof dw.order.ShippingLineItem ||
        (lineItem instanceof dw.order.PriceAdjustment &&
            lineItem.promotion.promotionClass ===
            dw.campaign.Promotion.PROMOTION_CLASS_ORDER)
    ) {
      const lineItemObject = {};
      const description = LineItemHelper.getDescription(lineItem);
      const id = LineItemHelper.getId(lineItem);
      const quantity = LineItemHelper.getQuantity(lineItem);
      const itemAmount = LineItemHelper.getOriginalItemAmount(lineItem);
      const vatAmount = LineItemHelper.getOriginalVatAmount(lineItem);

      const adjustedItemAmount = LineItemHelper.getItemAmount(lineItem)
      const adjustedvatAmount = LineItemHelper.getVatAmount(lineItem);

      lineItemObject.amountExcludingTax = (Math.floor(itemAmount.divide(quantity))).toFixed();
      lineItemObject.taxAmount = (Math.ceil(vatAmount.divide(quantity))).toFixed();
      lineItemObject.description = description;
      lineItemObject.id = id;
      lineItemObject.quantity = quantity;
      lineItemObject.taxCategory = 'None';
      lineItemObject.taxPercentage = addTaxPercentage ? (
          new Number(vatPercentage) * 10000
      ).toFixed() : 0;
      
      lineItems.push(lineItemObject);

      //if original Price or Tax is higher than the adjusted price or Tax, we add the difference as a discount
      if(adjustedItemAmount < itemAmount || adjustedvatAmount < vatAmount) {
      const discountLineItem = {
        description: `Discount on ${description}`,
        id: 'Discount',
        quantity: 1,
        taxPercentage: addTaxPercentage ? (
          new Number(vatPercentage) * 10000
        ).toFixed() : 0,
        amountExcludingTax: Math.floor(getDiscount(itemAmount, adjustedItemAmount)).toFixed(),
        taxAmount: Math.ceil(getDiscount(vatAmount, adjustedvatAmount)).toFixed(),
      }
      lineItems.push(discountLineItem);
      }
    }
  }

  return lineItems;
}

module.exports = {
  getLineItems,
};
