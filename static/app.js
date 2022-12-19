//JavaScript functions for main page
const duplicate = document.getElementById("allow-duplicate").value;
const xkey = document.getElementById("api-key").value;
const submitBtn = document.getElementById('paymentbutton');
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
    let ifieldsKey = document.getElementById('ifields-key').value;
    setAccount(ifieldsKey, "NB Everything", "1.0")
    threedstuff()
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
})

//pass to 3ds
function handleVerify(response) {
    response = response.Response
    console.log(response)
    if (response.xResult == "V")
    {
        verify3DS(response);
    }
    else {
        console.log(response.Response.xResult)
        submitBtn.disabled = false;
    }
}

//3DS result handling
function handle3DSResults(actionCode, xCavv, xEciFlag, xRefNum, xAuthenticateStatus, xSignatureVerification) {
    const postData = {
        'xRefNum': xRefNum,
        'xCavv': xCavv,
        'xEci': xEciFlag,
        'x3dsAuthenticationStatus': xAuthenticateStatus,
        'x3dsSignatureVerificationStatus': xSignatureVerification,
        'x3dsActionCode': actionCode,
        'x3dsError': ck3DS.error,
        'allow-duplicate': duplicate,
        'api-key': xkey
    };
    fetch("/verify", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(postData)
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