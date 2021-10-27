import { regionsEnum } from "../data/enums";
import CheckoutPage from "../pages/CheckoutPage";
import {
  doCardPayment,
  do3Ds1Verification,
  do3Ds2Verification,
  doCardPaymentOneclick,
} from "../paymentFlows/cards";
import { doPaypalPayment } from "../paymentFlows/pending";

const shopperData = require("../data/shopperData.json");
const cardData = require("../data/cardData.json") ;

let checkoutPage;

fixture`USD`
    .page(`https://${process.env.SFCC_HOSTNAME}/s/RefArch/home?lang=${regionsEnum.US}`)
    .httpAuth({
        username: process.env.SANDBOX_HTTP_AUTH_USERNAME,
        password: process.env.SANDBOX_HTTP_AUTH_PASSWORD,
    })
    .beforeEach( async t => {
        await t.maximizeWindow()
        checkoutPage = new CheckoutPage();

    });

const goToBillingWithFullCartGuestUser = async () => {
  await checkoutPage.goToCheckoutPageWithFullCart(regionsEnum.US);
  await checkoutPage.setShopperDetails(shopperData.US);
}

const goToBillingWithFullCartLoggedInUser = async () => {
  await checkoutPage.addProductToCart();
  await checkoutPage.loginUser(shopperData.US);
  await checkoutPage.navigateToCheckout(regionsEnum.US);
  await checkoutPage.submitShipping();

}

test('Card payment no 3DS success', async () => {
  await goToBillingWithFullCartGuestUser();
  await doCardPayment(cardData.noThreeDs);
  await checkoutPage.expectSuccess();
});

test('Card payment no 3DS failure', async () => {
  await goToBillingWithFullCartGuestUser();
  const cardDataInvalid = cardData.noThreeDs;
  cardDataInvalid.expirationDate = '0150';
  await doCardPayment(cardDataInvalid);
  await checkoutPage.expectRefusal();
});

test('Card payment 3DS1 success', async () => {
  await goToBillingWithFullCartGuestUser();
  await doCardPayment(cardData.threeDs1);
  await do3Ds1Verification();
  await checkoutPage.expectSuccess();
});

test('Card payment 3DS1 failure', async () => {
  await goToBillingWithFullCartGuestUser();
  const cardDataInvalid = cardData.threeDs1;
  cardDataInvalid.expirationDate = '0150';
  await doCardPayment(cardDataInvalid);
  await do3Ds1Verification();
  await checkoutPage.expectRefusal();
});

test('Card payment 3DS2 success', async () => {
  await goToBillingWithFullCartGuestUser();
  await doCardPayment(cardData.threeDs2);
  await do3Ds2Verification();
  await checkoutPage.expectSuccess();
});

test('Card payment 3DS2 failure', async () => {
  await goToBillingWithFullCartGuestUser();
  const cardDataInvalid = cardData.threeDs2;
  cardDataInvalid.expirationDate = '0150';
  await doCardPayment(cardDataInvalid);
  await do3Ds2Verification();
  await checkoutPage.expectRefusal();
});

test('Card co-branded BCMC payment success', async () => {
  await goToBillingWithFullCartGuestUser();
  await doCardPayment(cardData.coBrandedBCMC);
  await do3Ds1Verification();
  await checkoutPage.expectSuccess();
})

test('Card co-branded BCMC payment failure', async () => {
  await goToBillingWithFullCartGuestUser();
  const cardDataInvalid = cardData.coBrandedBCMC;
  cardDataInvalid.expirationDate = '0150';
  await doCardPayment(cardDataInvalid);
  await do3Ds1Verification();
  await checkoutPage.expectRefusal();
})

test('Card logged in user 3DS2 oneClick test success', async () => {
  await goToBillingWithFullCartLoggedInUser();
  await doCardPaymentOneclick(cardData.threeDs2);
  await do3Ds2Verification();
  await checkoutPage.expectSuccess();
})

test('Card logged in user 3DS2 oneClick test failure', async () => {
  const cardDataInvalid = cardData.threeDs2;
  cardDataInvalid.cvc = '123';
  await goToBillingWithFullCartLoggedInUser();
  await doCardPaymentOneclick(cardDataInvalid);
  await do3Ds2Verification();
  await checkoutPage.expectRefusal();
})

test('Card logged in user co-branded BCMC oneClick test success', async () => {
  await goToBillingWithFullCartLoggedInUser();
  await doCardPaymentOneclick(cardData.coBrandedBCMC);
  await checkoutPage.expectSuccess();
})

test.only('PayPal Success', async t => {
  await goToBillingWithFullCartGuestUser();
  await doPaypalPayment(cardData.threeDs2);
  await checkoutPage.expectSuccess();
});

test('Affirm Success', async t => {

});

test('Affirm Fail', async t => {

});
