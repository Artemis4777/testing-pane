//JavaScript functions for main page
//



//all variables for this file
const duplicate = document.getElementById("allow-duplicate");
const xkey = document.getElementById("api-key");
const amount = document.getElementById("amount");
const submitBtn = document.getElementById('paymentbutton');
const enviro = document.getElementById('3ds-environment').value;
const threeDe = document.getElementById('3ds-environment-d');
const threeD = document.getElementById('enable-3ds');
const threeDf = document.getElementById('enable-3ds-f');
const enableFriction = document.getElementById('friction-switch');
const billing = document.getElementById('billing');
const billInfo = document.getElementById('billing info');
const form = document.getElementById('paymentform');
const test = {"xStatus": "Default", "xRefNum": "Value"};
const toastTest = document.getElementById("toast-test");

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

//base api call
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let ifieldsKey = document.getElementById('ifields-key').value;
    setAccount(ifieldsKey, "NB Everything", "1.0");
    threedstuff();
    submitBtn.disabled = true;
    getTokens(
        function () {
            const formData = new FormData(form);
            console.log(formData)
            fetch("/submit", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())  // Parse the response as JSON
                .then(data => {
                    displayToast(data.Response, "Initial Transaction");
                    handleVerify(data)
                })
        },
        function () {
            submitBtn.disabled = false;
        },
        30000,
    );
});

//pass to 3ds
function handleVerify(response) {
    response = response.Response;
    console.log(response);
    if (response.xResult == "V") {
        verify3DS(response);
    }
    else {
        console.log(response.Response.xResult)
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
            displayToast(data.Response, "After Friction");
            submitBtn.disabled = false;
        });
};

//hide or show billing
function billingShow() {
    if (billing.checked) {
        console.log("showing")
        billInfo.classList.remove("d-none");
    }
    else {
        billInfo.classList.add("d-none");
    };
};
billing.addEventListener("change", billingShow);
billingShow();

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
options3ds();




//add new toasts
function displayToast(messages = test, type = "Test") {
    const message = messages.xStatus + " " + messages.xRefNum
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
            <strong class="me-auto">Result</strong>
            <small class="text-muted">${type}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">
            </button>
            </div>
            <div class="toast-body">
            ${message}
            </div>
        `;
    const toastStack = document.querySelector('#toast-stack');
    toastStack.prepend(toastElement);
    toastElement.classList.add('show');
    const closeButton = toastElement.querySelector('.close');
    closeButton.addEventListener('click', function () {
        toastElement.classList.remove('show');
    });
};

toastTest.addEventListener("click", function (event) {
    event.preventDefault();
    displayToast(test, "Log Test");
})
