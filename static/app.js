//JavaScript functions for main page


//universal variables for this file
const xcommand = document.getElementById("command");
const duplicate = document.getElementById("allow-duplicate");
let xkey = document.getElementById("api-key");
let amount = document.getElementById("amount");
const submitBtn = document.getElementById('paymentbutton');
const enviro = document.getElementById('3ds-environment').value;
const threeDe = document.getElementById('3ds-environment-d');
const threeD = document.getElementById('enable-3ds');
const threeDf = document.getElementById('enable-3ds-f');
const enableFriction = document.getElementById('friction-switch');
const billing = document.getElementById('billing');
const billInfo = document.getElementById('billing info');
const form = document.getElementById('paymentform');
const test = { "xStatus": "Default", "xRefNum": "Value" };
const toastTest = document.getElementById("toast-test");
const bbposButton = document.getElementById("bbpos-button");

//hide or show billing
function billingShow() {
    if (billing.checked) {
        console.log("showing billing fields")
        billInfo.classList.remove("d-none");
    }
    else {
        billInfo.classList.add("d-none");
    };
};
billing.addEventListener("change", billingShow);

//get time
function time() {
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString();
    return timeString;
}

//button to open refnum
function refCheck(message, refnumNum, messages) {
    if (+refnumNum >= 666298174) {
        const refString = `<button type="button" class="btn btn-light btn-sm ref-button">${message}</button>`
        return refString
    }
    else {
        return message
    }
}

//add new toasts
function displayToast(messages = test, type = "Test") {
    let message = messages.xStatus + " " + messages.xRefNum
    const refnumNum = messages.xRefNum
    console.log(message, type);
    const toastElement = document.createElement('div');
    toastElement.setAttribute('class', 'toast fade');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
            <div class="toast-header">
            <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
            <rect width="100%" height="100%" fill="#007aff"></rect></svg>
            <strong class="me-auto">${time()}</strong>
            <small class="text-muted">${type}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">
            </button>
            </div>
            <div class="toast-body">
            ${refCheck(message, +refnumNum, messages)}
            </div>
        `;
    const toastStack = document.querySelector('#toast-stack');
    toastStack.prepend(toastElement);
    const refButton = document.querySelector('.ref-button');
    if (refButton) {
        refButton.addEventListener('click', function () {
            window.open(`https://x1.cardknox.com/report/rptpwd/${refnumNum}`, '_blank');
        });
    }
    toastElement.classList.add('show');
    const closeButton = toastElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function () {
        toastElement.classList.remove('show');
    });
};

toastTest.addEventListener("click", function (event) {
    event.preventDefault();
    displayToast(test, "Log Test");
})

//convert form to json
function formToJSON(form) {
    let formData = new FormData(form)
    let object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return object;
}


// payment type event listeners
const bbposBtnDiv = document.getElementById('bbpos-button-div');
const apayBtnDiv = document.getElementById('apay-button-div');
const gpayBtnDiv = document.getElementById('gpay-button-div');
const submitBtnDiv = document.getElementById('submit-button-div');
const paymentTypes = document.querySelectorAll('input[name="paymentMethod"]');
const paymentTypeFieldSets = document.querySelectorAll('.paymentMethod');
paymentTypes.forEach(paymentType => {
    paymentType.addEventListener('click', function (event) {
        const selectedMethod = event.target.id;
        displayToast({ "xStatus": selectedMethod, "xRefNum": " " }, "New Method");
        paymentTypeFieldSets.forEach(paymentTypeFieldSet => {
            paymentTypeFieldSet.classList.add('d-none')
        });
        const method = document.querySelector(`#${selectedMethod}-fields`);
        console.log(method)
        //method.classList.remove('d-none');
        gpayBtnDiv.classList.add('d-none')
        apayBtnDiv.classList.add('d-none')
        bbposBtnDiv.classList.add('d-none')
        if (selectedMethod === "bbpos") {
            bbposBtnDiv.classList.remove('d-none')
            submitBtnDiv.classList.add('d-none');
        };
        if (selectedMethod === "gpay") {
            gpayBtnDiv.classList.remove('d-none')
            submitBtnDiv.classList.add('d-none');
            ckGooglePay.enableGooglePay({ amountField: "amount" });
        };
        if (selectedMethod === "apay") {
            submitBtnDiv.classList.add('d-none');
            ckApplePay.enableApplePay({
                initFunction: "initAP",
                amountField: "amount"
            });
        };
        if (selectedMethod === "credit") {
            submitBtnDiv.classList.remove('d-none');
        }
    });
});


//base api call
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let ifieldsKey = document.getElementById('ifields-key').value;
    setAccount(ifieldsKey, "NB Everything", "1.0");
    threedstuff();
    submitBtn.disabled = true;
    getTokens(
        function () {
            let payload = formToJSON(form)
            fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())  // Parse the response as JSON
                .then(data => {
                    displayToast(data.Response, "Sale");
                    handleVerify(data)
                })
        },
        function () {
            submitBtn.disabled = false;
        },
        30000,
    );
});

//setting iFields styles
let styles = {
    "width": "90%",
    "font-size": "1rem",
    "font-weight": "400",
    "line-height": "1.5",
    "color": "#212529",
    "border": "0",
    "overflow-x": "hidden",
    "overflow-y": "hidden",
};
setIfieldStyle('card-number', styles);
setIfieldStyle('cvv', styles);

//check if 3D Secure
function threedstuff() {
    if (threeD.checked) {
        console.log("enabling 3ds with friction")
        enable3DS(enviro, handle3DSResults);
    }
    else {
        console.log("enabling 3ds without friction")
        enable3DS(enviro)
    };
};

//pass to 3ds
function handleVerify(response) {
    response = response.Response;
    console.log(response);
    if (response.xResult == "V") {
        verify3DS(response);
    }
    else {
        submitBtn.disabled = false;
    };
};

//3DS result handling
function handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification) {
    let apiKey = xkey.value;
    let allowDupe = duplicate.value;
    const postData = {
        'xRefNum': xRefNum,
        'xCavv': xCavv,
        'xEci': xEciFlag,
        'x3dsAuthenticationStatus': xAuthenticateStatus,
        'x3dsSignatureVerificationStatus': xSignatureVerification,
        'x3dsActionCode': actionCode,
        'x3dsError': ck3DS.error,
        'allow-duplicate': allowDupe,
        'api-key': apiKey
    };
    fetch("/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            displayToast(data.Response, "Verify");
            submitBtn.disabled = false;
        });
};

//configure 3DS
function options3ds() {
    if (threeD.checked) {
        threeDe.classList.remove("d-none");
        enableFriction.classList.remove("d-none");
        threeDf.checked = true
    }
    else {
        threeDe.classList.add("d-none");
        enableFriction.classList.add("d-none");
    };
};
threeD.addEventListener("change", options3ds);


//googlepay object
const merchantName = document.getElementById('merchantName');
const gpRequest = {
    merchantInfo: {
        merchantName: merchantName.value
        },
    buttonOptions: {
        buttonSizeMode: GPButtonSizeMode.fill
        },
    billingParams: {
        billingAddressRequired: true,
        billingAddressFormat: GPBillingAddressFormat.full
        },
    onGetTransactionInfo: function () { return { totalPriceStatus: "FINAL", currencyCode: "USD", totalPrice: amount.value } },
    onProcessPayment: function (paymentResponse) { return processGP(paymentResponse) },
    onPaymentCanceled: function () { displayToast({ "xStatus": "Canceled", "xRefNum": "" }, "Google Pay") }
};
//initiates googlepay
function initGP() {
    console.log("googlepay init")
    return {
        merchantInfo: gpRequest.merchantInfo,
        buttonOptions: gpRequest.buttonOptions,
        onGetTransactionInfo: "gpRequest.onGetTransactionInfo",
        billingParameters: gpRequest.billingParams,
        onProcessPayment: "gpRequest.onProcessPayment",
        onPaymentCanceled: "gpRequest.onPaymentCanceled"
    };
};
//checks if test or production for googlepay
function gpayEnv() {
    const gpenv = document.getElementById('gpay-environment').value;
    if (gpenv === "production") {
        return "PRODUCTION";
    }
    else {
        return "TEST";
    };
};
//sends token and fields to server
function processGP(paymentResponse) {
    return new Promise(function (resolve, reject) {
        paymentToken = paymentResponse.paymentData.paymentMethodData.tokenizationData.token;
        encodedToken = window.btoa(paymentToken)
        let payload = formToJSON(form)
        console.log(JSON.stringify({ payload, paymentResponse, encodedToken }))
        fetch("/googlepay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload, paymentResponse, encodedToken })
        })
            .then(response => response.json())
            .then(data => {
                if (data.Response.xStatus) {
                    if (data.Response.xStatus === "Approved") {
                        resolve(data)
                    }
                    else { reject(data) }
                }
                else { reject(data) }
                displayToast(data.Response, "Google Pay");
            });
    })
}


//Apple Pay
const apContainer = document.getElementById("ap-container")
const apRequest = {
    buttonOptions: {
        buttonContainer: "ap-container",
        buttonColor: APButtonColor.black,
        buttonType: APButtonType.pay
    },
    handleAPError: function(err) {
        displayToast(err, "Google Pay")
    },
    onPaymentComplete: function(paymentComplete) {
        let resp = JSON.parse(paymentComplete.response)
        displayToast(resp, "Google Pay")
    }
}
//apple pay init
function initAP() {
    console.log("Initiated Apple Pay")
    return {
        buttonOptions: apRequest.buttonOptions,
        merchantIdentifier: "merchant.cardknox.com",
        onAPButtonLoaded: function () { apayBtnDiv.classList.remove('d-none') },
        onGetTransactionInfo: "getTransactionInfo",
        onGetShippingMethods: function () { return [{label: 'Free Shipping',amount: '0.00',identifier: 'free'}]; },
        onShippingContactSelected: function (shippingContact) { console.log("shippingContact", JSON.stringify(shippingContact)); },
        onShippingMethodSelected: function (ShippingMethod) { console.log(ShippingMethod) },
        onPaymentMethodSelected: function (PaymentMethod) { console.log(PaymentMethod) },
        onBeforeProcessPayment: function () { console.log("..."); },
        onValidateMerchant: "validateMerchant",
        onPaymentAuthorize: function (paymentResponse) { return processAP(paymentResponse, finalPrice) },
        onPaymentComplete: "apRequest.onPaymentComplete",
        onCancel: function () { displayToast({ "xStatus": "Canceled", "xRefNum": "" }, "Apple Pay") }
    };
}
//get transaction info
let finalPrice = 0;
function getTransactionInfo() {
    const lineItems = [
        {
            "label": "Subtotal",
            "type": "final",
            "amount": amount.value
        },
        {
            "label": "Credit Card Fee",
            "amount": roundTo(0.0275*amount.value, 2),
            "type": "final"
        },
        {
            "label": "Estimated Tax",
            "amount": roundTo(0.07*amount.value, 2),
            "type": "final"
        }
    ]
    finalPrice = 0;
    lineItems.forEach((item) => {
        finalPrice += parseFloat(item.amount)||0
    })
    return {
        "lineItems": lineItems,
        total: {
            type: "final",
            labal: "Total",
            amount: finalPrice
        }
    }
}
//validate merchant
function validateMerchant() {
    fetch("https://api.cardknox.com/applepay/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    });
}
//send final info to server
function processAP(paymentResponse, finalPrice) {
    return new Promise(function (resolve, reject) {
        console.log(paymentResponse)
        paymentToken = paymentResponse.paymentData.data;
        encodedToken = window.btoa(paymentToken)
        let payload = formToJSON(form)
        console.log(JSON.stringify({ payload, paymentResponse, encodedToken, finalPrice}))
        fetch("/applepay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload, paymentResponse, encodedToken, finalPrice })
        })
            .then(response => response.json())
            .then(data => {
                if (data.Response.xStatus) {
                    if (data.Response.xStatus === "Approved") {
                        resolve(data)
                    }
                    else { reject(data) }
                }
                else { reject(data) }
                displayToast(data.Response, "Apple Pay");
            });
    })
};

//bbpos payment
let ipAddress = document.getElementById("deviceIpAddress")
let ipPort = document.getElementById("deviceIpPort")
let deviceName = document.getElementById("deviceName")
let deviceTimeout = document.getElementById("deviceTimeout")
let enabledeviceinsertswipetap = document.getElementById("enableDeviceInsertSwipeTap")
bbposButton.addEventListener("click", function (event) {
    event.preventDefault();
    payload = {
        "xcommand": xcommand.value,
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xkey": xkey.value,
        "xamount": amount.value,
        "xdeviceipport": ipPort.value,
        "xdeviceipaddress": ipAddress.value,
        "enabledeviceinsertswipetap": enabledeviceinsertswipetap.value,
        "xdevicename": deviceName.value,
        "xdevicetimeout": deviceTimeout.value,
    }
    let url = "https://localemv.com:8889"
    body = new URLSearchParams(payload).toString();
    fetch(url, {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => console.log(response))
})


//Ending of file
billingShow();
let radioButton = document.getElementById("credit");
radioButton.checked = true;
radioButton.dispatchEvent(new Event("click"));
options3ds();