//base api call
const form = document.getElementById('paymentform');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(form);
  const formData = new FormData(form);
  console.log(formData)
  const XHR = new XMLHttpRequest();
  XHR.open("POST", "/submit");
  XHR.send(formData);
})

//hide or show billing
const billing = document.getElementById('billing');
const billInfo = document.getElementById('billing info')
billing.addEventListener("change",  function(){
  if (billing.checked){
    console.log("showing")
    billInfo.classList.remove("d-none");
  }
  else{
    billInfo.classList.add("d-none");
  }
})