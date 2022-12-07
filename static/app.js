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