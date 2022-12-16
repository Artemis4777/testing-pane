//JavaScript functions for main page
let styles = {
    "width": "98%",
    "font-size": "1rem",
    "font-weight": "400",
    "line-height": "1.5",
    "color": "#212529",
    "border": "0",
}
setIfieldStyle('card-number', styles);
setIfieldStyle('cvv', styles);

//check if 3D Secure
function threedstuff() {
    if (threeD.checked) {
        console.log("enabling 3ds with friction")
        enable3DS(enviro, handle3DSResults);
    }
    else {
        console.log("enabling 3ds with friction")
        enable3DS(enviro)
    }
}

//base api call
const form = document.getElementById('paymentform');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const XHR = new XMLHttpRequest();
    let ifieldsKey = document.getElementById('ifields-key').value;
    setAccount(ifieldsKey, "NB Everything", "1.0")
    threedstuff()
    var submitBtn = document.getElementById('paymentbutton');
    submitBtn.disabled = true;
    getTokens(
        function () {
            const formData = new FormData(form);
            fetch("/submit", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())  // Parse the response as JSON
                .then(data => console.log(data))  // Do something with the data
        },
        function () {
            submitBtn.disabled = false;
        },
        30000,
    );
})

//3DS result handling
function handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification) {
    const XHR = new XMLHttpRequest();
    var postData = {
        xRefNum: xRefNum,
        xCavv: xCavv,
        xEci: xEciFlag,
        x3dsAuthenticationStatus: xAuthenticateStatus,
        x3dsSignatureVerificationStatus: xSignatureVerification,
        x3dsActionCode: actionCode,
        x3dsError: ck3DS.error
    };
    fetch("/verify", {
        method: "POST",
        body: postData
    })
    .then(response => response.json())  // Parse the response as JSON
    .then(data => console.log(data))  // Do something with the data
}

//hide or show billing
const billing = document.getElementById('billing');
const billInfo = document.getElementById('billing info')
billing.addEventListener("change", function () {
    if (billing.checked) {
        console.log("showing")
        billInfo.classList.remove("d-none");
    }
    else {
        billInfo.classList.add("d-none");
    }
})

//configure 3DS
const enviro = document.getElementById('3ds-environment').value;
const threeDe = document.getElementById('3ds-environment-d');
const threeD = document.getElementById('enable-3ds');
const threeDf = document.getElementById('enable-3ds-f');
const enableFriction = document.getElementById('friction-switch');
threeD.addEventListener("change", function () {
    if (threeD.checked) {
        threeDe.classList.remove("d-none");
        enableFriction.classList.remove("d-none");
        threeDf.checked = true
    }
    else {
        threeDe.classList.add("d-none");
        enableFriction.classList.add("d-none");
    }
})