import PaymentMethodsPage from "../pages/PaymentMethodsPage";
import CheckoutPage from "../pages/CheckoutPage";

const paymentMethodsPage = new PaymentMethodsPage();
const checkoutPage = new CheckoutPage();

const doPaypalPayment = async (cardInput) => {
  await paymentMethodsPage.initiatePaypalPayment(cardInput);
}

module.exports = {
  doPaypalPayment,
}
