import PaymentMethodsPage from "../pages/PaymentMethodsPage";

const paymentMethodsPage = new PaymentMethodsPage();

const doPaypalPayment = async (cardInput) => {
  await paymentMethodsPage.initiatePaypalPayment(cardInput);
}

module.exports = {
  doPaypalPayment,
}
