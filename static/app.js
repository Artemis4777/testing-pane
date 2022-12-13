//JavaScript functions for main page

//base api call
const form = document.getElementById('paymentform');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const XHR = new XMLHttpRequest();
    let ifieldsKey = document.getElementById('ifields-key').value;
    setAccount(ifieldsKey, "NB Everything", "1.0")
    var submitBtn = document.getElementById('paymentbutton');
    submitBtn.disabled = true;
    getTokens(
        function () {
            const formData = new FormData(form);
            XHR.open("POST", "/submit");
            XHR.send(formData);
        },
        function () {
            submitBtn.disabled = false;
        },
        30000,
    );
})

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