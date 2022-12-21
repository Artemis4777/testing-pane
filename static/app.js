//JavaScript functions for main page
//



//all variables for this file
const duplicate = document.getElementById("allow-duplicate");
const xkey = document.getElementById("api-key");
const submitBtn = document.getElementById('paymentbutton');
const enviro = document.getElementById('3ds-environment').value;
const threeDe = document.getElementById('3ds-environment-d');
const threeD = document.getElementById('enable-3ds');
const threeDf = document.getElementById('enable-3ds-f');
const enableFriction = document.getElementById('friction-switch');
const billing = document.getElementById('billing');
const billInfo = document.getElementById('billing info');
const form = document.getElementById('paymentform');

//setting iFields styles
let styles = {
    "width": "98%",
    "font-size": "1rem",
    "font-weight": "400",
    "line-height": "1.5",
    "color": "#212529",
    "border": "0",
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
            .then(data => handleVerify(data))
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
    if (response.xResult == "V")
    {
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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(postData)
    })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => console.log(data.Response), submitBtn.disabled = false);  // Do something with the data
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