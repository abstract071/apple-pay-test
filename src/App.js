import React from 'react';
import logo from './logo.svg';
import './App.css';

function showButton(options) {
  var payment = new window.BuckarooSdk.ApplePay.ApplePayPayment(
    "#apple",  // selector for the element to use as the button
    options	 // the ApplePay payment options object
  );

  payment.showPayButton(
    "black",    // black, white or white-outline
    "check-out" // plain, book, buy, check-out, donate, set-up or subscribe
  );
}

function init() {
  var totalForDelivery = {
    label: "Total price",
    amount: "5.99",
    type: "final"
  };
  var subtotal = "4.99";
  var lineItemsForDelivery = [
    { label: "Subtotal", amount: subtotal, type: "final" },
    { label: "Delivery", amount: "1.00", type: "final" }
  ];
  var shippingMethods = [
    { label: "Delivery", amount: "1.00", identifier: "delivery", detail: "Deliver   y to you" },
    { label: "Collection", amount: "0.00", identifier: "collection", detail: "Collect from the store" }
  ];
  var requiredContactFields = ["email", "name", "postalAddress"];
  var captureFunds = function (payment) {
    var result = {}; // https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentauthorizationresult

    var captureInfo = {
      customerCardName: payment.billingContact.givenName + " " + payment.billingContact.familyName,
      paymentData: btoa(JSON.stringify(payment.token))
    }

    // TODO: send captureInfo to Buckaroo

    return Promise.resolve(result);
  }
  var shippingMethodSelected = function (shippingMethod) {
    var result = {}; // https://developer.apple.com/documentation/apple_pay_on_the_web/applepayshippingmethodupdate
    return Promise.resolve(result);
  }
  var shippingContactSelected = function (shippingContact) {
    var result = {}; // https://developer.apple.com/documentation/apple_pay_on_the_web/applepayshippingcontactupdate
    return Promise.resolve(result);
  }
  var cancel = function(event) {
    console.log("Payment UI is dismissed.");
  }
  var shippingOption = "shipping"; // https://developer.apple.com/documentation/apple_pay_on_the_web/applepayshippingtype
  var options = new window.BuckarooSdk.ApplePay.ApplePayOptions(
    'STORE_NAME',    		 // store name
    'NL', 			 // country code
    'EUR',			 // currency code
    'NL',			 // language
    'EAC54770361E4E60A068DE6CFBEB3E1C', 	 // your merchant guid
    lineItemsForDelivery, 	 // default line items
    totalForDelivery, 	 // default total line
    shippingOption, 		 // default shipping option
    shippingMethods, 		 // available shipping methods
    this.captureFunds, 	 // callback method for capturing funds
    this.shippingMethodSelected, // (OPTIONAL) after shipping method is altered
    this.shippingContactSelected,// (OPTIONAL) after shipping contact is altered
    requiredContactFields,	 // (OPTIONAL) fields for billing contact
    requiredContactFields, 	 // (OPTIONAL) required fields for shipping
    this.cancel		 // (OPTIONAL) after payment UI is dismissed
  );

  showButton(options);
}

const hooks = {
  useApplePay() {
    return React.useCallback(() => {
      window.BuckarooSdk.ApplePay.checkApplePaySupport('EAC54770361E4E60A068DE6CFBEB3E1C')
        .then(function (applePaySupported) {
          console.log(applePaySupported);
          if (applePaySupported) {
            init();
          }
        });
    }, []);
  },
};

function App() {
  const cb = hooks.useApplePay();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          type='button'
          onClick={cb}
        >
          Apple Pay
        </button>
        <button id='apple' type='button'></button>
      </header>
    </div>
  );
}

export default App;
