//JavaScript functions for main page

//universal variables for this file
const clientID = document.getElementById("externalClientId");
const xcommand = document.getElementById("command");
const duplicate = document.getElementById("allow-duplicate");
const xkey = document.getElementById("api-key");
const amount = document.getElementById("amount");
const refnum = document.getElementById("refnum");
const submitBtn = document.getElementById("paymentbutton");
const enviro = document.getElementById("3ds-environment").value;
const threeDe = document.getElementById("3ds-environment-d");
const threeD = document.getElementById("enable-3ds");
const threeDf = document.getElementById("enable-3ds-f");
const enableFriction = document.getElementById("friction-switch");
const billing = document.getElementById("billing");
const sandbox = document.getElementById("sandboxMode");
const billInfo = document.getElementById("billing info");
const form = document.getElementById("paymentform");
const test = { xStatus: "Default", xRefNum: "Value" };
const toastTest = document.getElementById("toast-test");
const newToastParameter = document.getElementById("toast-parameter");
const addDeviceParameters = document.getElementById("device-toast-parameters");
const bbposButton = document.getElementById("bbpos-button");
const ebtOnlineButton = document.getElementById("ebtOnline-button");
const ebtCardnum = document.getElementById("ebtCardnum");
const ebtShipMethod = document.getElementById("ebtShipMethod");
const resultsModalBody = document.getElementById("resultsModalBody");

//hide or show billing
function billingShow() {
	if (billing.checked) {
		console.log("showing billing fields");
		billInfo.classList.remove("d-none");
	} else {
		billInfo.classList.add("d-none");
	}
}
billing.addEventListener("change", billingShow);

//set sandbox or production
function sandboxMode() {
	if (sandbox.checked) {
		console.log("sandbox mode enabled");
	} else {
		console.log("sandbox mode disabled");
	}
}
sandbox.addEventListener("change", sandboxMode);

//get time
function time() {
	const currentTime = new Date();
	const timeString = currentTime.toLocaleTimeString();
	return timeString;
}

//button to open refnum
function refCheck(message, refnumNum) {
	if (Number(refnumNum) >= 666298174) {
		const refString = `<button type="button" class="btn btn-link btn-sm ref-button">${message}</button>`;
		return refString;
	} else {
		return message;
	}
}

//results modal
function resultsModal(payload) {
	if (Number(payload.xRefNum) >= 666298174) {
		const resultsModalButton = `<button type="button" id="results${payload.xRefNum}" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#resultsModal"> View Details </button>`;
		return resultsModalButton;
	} else {
		return " ";
	}
}

//add new toasts
function displayLogToast(messages = test, type = "Test") {
	let message = messages.xStatus + " " + messages.xRefNum;
	const refnumNum = messages.xRefNum;
	console.log(message, type);
	const toastElement = document.createElement("div");
	toastElement.setAttribute("class", "toast fade");
	toastElement.setAttribute("role", "alert");
	toastElement.setAttribute("aria-live", "assertive");
	toastElement.setAttribute("aria-atomic", "true");
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
            ${resultsModal(messages)}
            </div>
        `;
	const toastStack = document.querySelector("#toast-stack");
	toastStack.prepend(toastElement);
	const refButton = document.querySelector(".ref-button");
	const resultsButton = document.querySelector(`#results${messages.xRefNum}`);
	if (refButton) {
		refButton.addEventListener("click", function () {
			window.open(
				`https://x1.cardknox.com/report/rptpwd/${refnumNum}`,
				"_blank"
			);
		});
	}
	if (resultsButton) {
		resultsButton.addEventListener("click", function () {
			resultsModalBody.innerHTML = JSON.stringify(messages, null, 4);
		});
	}
	toastElement.classList.add("show");
	const closeButton = toastElement.querySelector(".btn-close");
	closeButton.addEventListener("click", function () {
		toastElement.classList.remove("show");
	});
}

toastTest.addEventListener("click", function (event) {
	event.preventDefault();
	displayLogToast(test, "Log Test");
});

//toasts for holding parameters instead of form
const toastParameterStack = document.querySelector("#toast-parameter-stack");
function displayParameterToast(parameterKey, parameterValue) {
	const toastParameterElement = document.createElement("div");
	toastParameterElement.setAttribute("class", "toast fade");
	toastParameterElement.setAttribute("role", "alert");
	toastParameterElement.setAttribute("aria-live", "assertive");
	toastParameterElement.setAttribute("aria-atomic", "true");
	toastParameterElement.innerHTML = `
        <div class="toast-header">
            <input class="me-auto form-control" value="${parameterKey}">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <input type="text" class="form-control" value="${parameterValue}">
        </div>
        `;
	toastParameterStack.prepend(toastParameterElement);
	toastParameterElement.classList.add("show");
	const closeButton = toastParameterElement.querySelector(".btn-close");
	closeButton.addEventListener("click", function () {
		toastParameterElement.classList.remove("show");
	});
}

newToastParameter.addEventListener("click", function (event) {
	event.preventDefault();
	displayParameterToast("", "");
});

addDeviceParameters.addEventListener("click", function (event) {
	event.preventDefault();
	displayParameterToast("xDeviceTimeOut", "");
	displayParameterToast("xRedirectURL", "");
	displayParameterToast("xEnableKeyedEntry", "");
	displayParameterToast("xEnableDeviceInsertSwipeTap", "True");
	displayParameterToast("xDeviceComBaud", "");
	displayParameterToast("xDeviceComParity", "");
	displayParameterToast("xDeviceComDataBits", "");
	displayParameterToast("xDeviceComPort", "");
	displayParameterToast("xDeviceIPPort", "");
	displayParameterToast("xDeviceIPAddress", "");
	displayParameterToast("xDeviceName", "");
});

function clearBBPOSParameters() {
	const toastParameterElements =
		toastParameterStack.querySelectorAll(".toast.show");
	toastParameterElements.forEach((toastParameterElement) => {
		toastParameterElement.classList.remove("show");
	});
}

//convert form to json
function formToJSON(form) {
	let formData = new FormData(form);
	let object = {};
	formData.forEach((value, key) => {
		object[key] = value;
	});
	return object;
}

// payment type event listeners
const paymentTypes = document.querySelectorAll('input[name="paymentMethod"]');
const paymentTypeFieldSets = document.querySelectorAll(".paymentMethod");
const submitButtons = document.querySelectorAll(".submit-button");
paymentTypes.forEach((paymentType) => {
	paymentType.addEventListener("click", function (event) {
		const selectedMethod = event.target.id;
		paymentMethods(selectedMethod);
	});
});
//hide and show payment type buttons and fields
function paymentMethods(selectedMethod) {
	displayLogToast({ xStatus: selectedMethod, xRefNum: " " }, "New Method");
	paymentTypeFieldSets.forEach((paymentTypeFieldSet) => {
		paymentTypeFieldSet.classList.add("d-none");
	});
	submitButtons.forEach((submitButton) => {
		submitButton.classList.add("d-none");
	});
	const methodFields = document.querySelector(`#${selectedMethod}-fields`);
	const methodButton = document.querySelector(
		`#${selectedMethod}-button-div`
	);
	console.log(methodFields);
	methodFields.classList.remove("d-none");
	methodButton.classList.remove("d-none");
	if (selectedMethod === "gpay") {
		ckGooglePay.enableGooglePay({ amountField: "amount" });
	}
	if (selectedMethod === "apay") {
		ckApplePay.enableApplePay({
			initFunction: "initAP",
			amountField: "amount",
		});
	}
	if (selectedMethod === "c2pay") {
		ckClick2Pay.enableClickToPay({
			environment: c2pEnvironment.sandbox,
			externalClientId: click2payRequest.externalClientId,
			click2payContainer: "click2payContainer",
			onCPButtonLoaded: click2payRequest.onCPButtonLoaded,
			onPaymentPrefill: click2payRequest.paymentPrefill,
			onPaymentSuccess: click2payRequest.paymentSuccess,
		});
	}
	if (selectedMethod === "bbpos") {
		clearBBPOSParameters();
		displayParameterToast("xAmount", amount.value);
		displayParameterToast("xCommand", xcommand.value);
		if (duplicate.checked) {
			displayParameterToast("xAllowDuplicate", "True");
		}
		displayParameterToast("xKey", xkey.value);
	}
}

//base api call
form.addEventListener("submit", (event) => {
	event.preventDefault();
	submitBtn.disabled = true;
	let ifieldsKey = document.getElementById("ifields-key").value;
	setAccount(ifieldsKey, "Testing Pane", "1.0");
	threedstuff();
	// wait until ck3DS.configuration.process3DS equals true
	let tries = 0;
	let tokenInterval = setInterval(function () {
		tries++;
		if (!threeD.checked || ck3DS.initialized || tries > 5) {
			getTokens(
				function () {
					let payload = formToJSON(form);
					fetch("/submit", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					})
						.then((response) => response.json()) // Parse the response as JSON
						.then((data) => {
							displayLogToast(data.Response, "Card");
							handleVerify(data);
						});
				},
				function () {
					submitBtn.disabled = false;
				},
				30000
			);
			clearInterval(tokenInterval);
		}
	}, 3000);
});

//setting iFields styles
let styles = {
	width: "90%",
	"font-size": "1rem",
	"font-weight": "400",
	"line-height": "1.5",
	color: "#212529",
	border: "0",
	"overflow-x": "hidden",
	"overflow-y": "hidden",
};
setIfieldStyle("card-number", styles);
setIfieldStyle("cvv", styles);

//check if 3D Secure
function threedstuff() {
	if (threeD.checked && threeDf.checked) {
		console.log("Enabling 3ds with friction");
		enable3DS(enviro, handle3DSResults);
	} else if (threeD.checked) {
		console.log("Enabling 3ds without friction");
		enable3DS(enviro);
	} else {
		console.log("Not enabling 3ds");
	}
}

//pass to 3ds
function handleVerify(response) {
	response = response.Response;
	console.log(response);
	if (response.xResult == "V") {
		verify3DS(response);
	} else {
		submitBtn.disabled = false;
	}
}

//3DS result handling
function handle3DSResults(
	actionCode,
	xCavv,
	xEciFlag,
	xRefNum,
	xAuthenticateStatus,
	xSignatureVerification
) {
	let apiKey = xkey.value;
	let allowDupe = duplicate.value;
	const postData = {
		xRefNum: xRefNum,
		xCavv: xCavv,
		xEci: xEciFlag,
		x3dsAuthenticationStatus: xAuthenticateStatus,
		x3dsSignatureVerificationStatus: xSignatureVerification,
		x3dsActionCode: actionCode,
		x3dsError: ck3DS.error,
		"allow-duplicate": allowDupe,
		"api-key": apiKey,
	};
	fetch("/verify", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(postData),
	})
		.then((response) => response.json())
		.then((data) => {
			displayLogToast(data.Response, "Verify");
			submitBtn.disabled = false;
		});
}

//configure 3DS
function options3ds() {
	if (threeD.checked) {
		threeDe.classList.remove("d-none");
		enableFriction.classList.remove("d-none");
		threeDf.checked = true;
	} else {
		threeDe.classList.add("d-none");
		enableFriction.classList.add("d-none");
	}
}
threeD.addEventListener("change", options3ds);

//googlepay object
const merchantName = document.getElementById("merchantName");
const gpRequest = {
	merchantInfo: {
		merchantName: merchantName.value,
	},
	buttonOptions: {
		buttonSizeMode: GPButtonSizeMode.fill,
	},
	billingParams: {
		billingAddressRequired: true,
		billingAddressFormat: GPBillingAddressFormat.full,
	},
	onGetTransactionInfo: function () {
		return {
			totalPriceStatus: "FINAL",
			currencyCode: "USD",
			totalPrice: amount.value,
		};
	},
	onProcessPayment: function (paymentResponse) {
		return processGP(paymentResponse);
	},
	onPaymentCanceled: function () {
		displayLogToast({ xStatus: "Canceled", xRefNum: "" }, "Google Pay");
	},
};
//initiates googlepay
function initGP() {
	console.log("googlepay init");
	return {
		merchantInfo: gpRequest.merchantInfo,
		buttonOptions: gpRequest.buttonOptions,
		onGetTransactionInfo: "gpRequest.onGetTransactionInfo",
		billingParameters: gpRequest.billingParams,
		onProcessPayment: "gpRequest.onProcessPayment",
		onPaymentCanceled: "gpRequest.onPaymentCanceled",
	};
}
//checks if test or production for googlepay
function gpayEnv() {
	const gpenv = document.getElementById("gpay-environment").value;
	if (gpenv === "production") {
		return "PRODUCTION";
	} else {
		return "TEST";
	}
}
//sends token and fields to server
function processGP(paymentResponse) {
	return new Promise(function (resolve, reject) {
		paymentToken =
			paymentResponse.paymentData.paymentMethodData.tokenizationData
				.token;
		encodedToken = window.btoa(paymentToken);
		let payload = formToJSON(form);
		console.log(JSON.stringify({ payload, paymentResponse, encodedToken }));
		fetch("/googlepay", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ payload, paymentResponse, encodedToken }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.Response.xStatus) {
					if (data.Response.xStatus === "Approved") {
						resolve(data);
					} else {
						reject(data);
					}
				} else {
					reject(data);
				}
				displayLogToast(data.Response, "Google Pay");
			});
	});
}

//Apple Pay
const apContainer = document.getElementById("ap-container");
const apRequest = {
	buttonOptions: {
		buttonContainer: "ap-container",
		buttonColor: APButtonColor.black,
		buttonType: APButtonType.pay,
	},
	handleAPError: function (err) {
		displayLogToast(err, "Apple Pay");
	},
	onPaymentComplete: function (paymentComplete) {
		let resp = JSON.parse(paymentComplete.response);
		displayLogToast(resp, "Apple Pay");
	},
	totalAmount: 0,
	apButtonLoaded: function (resp) {
		console.log(resp);
	},
	getShippingMethods: function () {
		return [
			{
				label: "Free Shipping",
				amount: "0.00",
				identifier: "Free",
				detail: "Delivers at light speed. Please calculate delivery date on your own time.",
			},
		];
	},
	shippingContactSelected: function (shippingContact) {
		console.log("shippingContact", JSON.stringify(shippingContact));
	},
	shippingMethodSelected: function (ShippingMethod) {
		console.log(ShippingMethod);
	},
	paymentMethodSelected: function (PaymentMethod) {
		console.log(PaymentMethod);
		return getTransactionInfo();
	},
	beforeProcessPayment: function () {
		return new Promise(function (resolve, reject) {
			try {
				// optional validation place
				console.log("...");
				resolve(iStatus.success);
			} catch {
				reject(err);
			}
		});
	},
	cancel: function () {
		displayLogToast({ xStatus: "Canceled", xRefNum: "" }, "Apple Pay");
	},
};
//apple pay init
function initAP() {
	console.log("Initiated Apple Pay");
	return {
		buttonOptions: apRequest.buttonOptions,
		merchantIdentifier: "merchant.cardknox.com",
		onAPButtonLoaded: "apRequest.apButtonLoaded",
		onGetTransactionInfo: "getTransactionInfo",
		onGetShippingMethods: "apRequest.getShippingMethods",
		onShippingContactSelected: "apRequest.shippingContactSelected",
		onShippingMethodSelected: "apRequest.shippingMethodSelected",
		onPaymentMethodSelected: "apRequest.paymentMethodSelected",
		onBeforeProcessPayment: "apRequest.beforeProcessPayment",
		onValidateMerchant: "validateMerchant",
		onPaymentAuthorize: "processAP",
		onPaymentComplete: "apRequest.onPaymentComplete",
		onCancel: "apRequest.cancel",
	};
}
//get transaction info
let finalPrice = 0;
function getTransactionInfo() {
	const lineItems = [
		{
			label: "Subtotal",
			type: "final",
			amount: amount.value,
		},
		{
			label: "Credit Card Fee",
			amount: roundTo(0.0275 * amount.value, 2),
			type: "final",
		},
		{
			label: "Estimated Tax",
			amount: roundTo(0.07 * amount.value, 2),
			type: "final",
		},
	];
	finalPrice = 0;
	lineItems.forEach((item) => {
		finalPrice += parseFloat(item.amount) || 0;
	});
	apRequest.totalAmount = roundTo(finalPrice, 2);
	return {
		lineItems: lineItems,
		total: {
			type: "final",
			label: "Total",
			amount: finalPrice,
		},
	};
}
//validate merchant
function validateMerchant() {
	return new Promise((resolve, reject) => {
		try {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://api.cardknox.com/applepay/validate");
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					console.log(
						"validateApplePayMerchant",
						JSON.stringify(xhr.response)
					);
					resolve(xhr.response);
				} else {
					console.log(
						"validateApplePayMerchant",
						JSON.stringify(xhr.response),
						this.status
					);
					reject({
						status: this.status,
						statusText: xhr.response,
					});
				}
			};
			xhr.onerror = function () {
				console.error(
					"validateApplePayMerchant",
					xhr.statusText,
					this.status
				);
				reject({
					status: this.status,
					statusText: xhr.statusText,
				});
			};
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send();
		} catch (err) {
			setTimeout(function () {
				console.log("getApplePaySession error: " + exMsg(err));
			}, 100);
		}
	});
}
//send final info to server
function processAP(paymentResponse) {
	return new Promise(function (resolve, reject) {
		console.log(paymentResponse);
		paymentToken = paymentResponse.token.paymentData;
		encodedToken = window.btoa(JSON.stringify(paymentToken));
		let payload = formToJSON(form);
		let amountf = apRequest.totalAmount;
		console.log(
			JSON.stringify({
				payload,
				paymentResponse,
				encodedToken,
				amountf,
			})
		);
		fetch("/applepay", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				payload,
				paymentResponse,
				encodedToken,
				amountf,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.Response.xStatus) {
					if (data.Response.xStatus === "Approved") {
						resolve(data);
					} else {
						reject(data);
					}
				} else {
					reject(data);
				}
				displayLogToast(data.Response, "Apple Pay");
			});
	});
}

//Click to pay
const click2payRequest = {
	environment: c2pEnvironment.sandbox,
	externalClientId: clientID.value,
	onCPButtonLoaded: function (resp) {
		if (!resp) return;
		if (resp.status === iStatus.success) {
			console.log("Loaded Click To Pay Button");
		} else if (resp.reason) {
			console.log(`Click To Pay Button Load Failed: ${resp.reason}`);
		}
	},
	paymentPrefill: function () {
		let result = {
			merchantRequestId: "Merchant defined request ID",
			currencyCode: "USD",
			description: "...corp Product",
			orderId: "Merchant defined order ID",
			subtotal: amount.value,
			shippingHandling: "0.00",
			tax: "0.00",
			discount: "0.00",
			giftWrap: "0.00",
			misc: "0.00",
			total: "0",
		};
		result.total = roundTo(
			result.subtotal +
				result.shippingHandling +
				result.tax +
				result.discount +
				result.giftWrap +
				result.misc,
			2
		);
		console.log(result);
		return result;
	},
	paymentSuccess: function (clickToPayResponse) {
		return new Promise(function (resolve, reject) {
			console.log(clickToPayResponse);
			paymentToken = clickToPayResponse.payload.transactionId;
			encodedToken = window.btoa(JSON.stringify(paymentToken));
			let payload = formToJSON(form);
			let amountf = amount.value;
			console.log(
				JSON.stringify({
					payload,
					clickToPayResponse,
					encodedToken,
					amountf,
				})
			);
			fetch("/click2pay", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					payload,
					clickToPayResponse,
					encodedToken,
					amountf,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.Response.xStatus) {
						if (data.Response.xStatus === "Approved") {
							resolve(data);
						} else {
							reject(data);
						}
					} else {
						reject(data);
					}
					displayLogToast(data.Response, "Click To Pay");
				});
		});
	},
};

//bbpos payment
const bbposEndpoint = document.getElementById("bbposEndpoint");

bbposButton.addEventListener("click", function (event) {
	event.preventDefault();
	payload = {
		xcommand: xcommand.value,
		xamount: amount.value,
		xkey: xkey.value,
	};
	function updatePayload(key, value) {
		payload[key] = value;
	}
	const toastParameterElements =
		toastParameterStack.querySelectorAll(".toast.show");
	toastParameterElements.forEach((toastParameterElement) => {
		const keyInput = toastParameterElement.querySelector(
			".form-control:first-child"
		);
		const valueInput = toastParameterElement.querySelector(
			".form-control:last-child"
		);
		const key = keyInput.value;
		const value = valueInput.value;
		updatePayload(key.toLowerCase(), value);
	});
	let url = bbposEndpoint.value;
	body = new URLSearchParams(payload).toString();
	console.log(body);
	fetch(url, {
		method: "POST",
		body: body,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			displayLogToast(data, "BBPOS");
			console.log(data);
		});
});

//EBT Online
ebtOnlineButton.addEventListener("click", function (event) {
	event.preventDefault();
	let payload = formToJSON(form);
	if (payload["refnum"] !== "") {
		payload["ebtCommand"] = xcommand.value;
		payload["refnum"] = refnum.value;
	} else payload["ebtCommand"] = "ebtonline:initiate";
	fetch("/ebtonline", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
		.then((response) => response.json())
		.then((data) => {
			displayLogToast(data.Response, "EBT Online");
			console.log(data);
			if (data.Response.xPinPadURL) {
				redirectToPin(data.Response);
			}
		});
});
//enter ebt pin
const pinPadLink = document.getElementById("pinPadLink");
const modaliFrame = document.getElementById("modaliFrame");
const accuReturnURL = document.getElementById("AccuReturnURL");
const accuId = document.getElementById("AccuId");
const accuLanguage = document.getElementById("AccuLanguage");
//const pinModal = document.getElementById("pinModal");
const pinPadRefnum = document.getElementById("pinPadRefnum");
const pinPadCommand = document.getElementById("pinPadCommand");
var pinModal = new bootstrap.Modal(document.getElementById("pinModal"), {
	keyboard: false,
});

function redirectToPin(Response) {
	pinPadLink.action = Response.xPinPadURL;
	accuReturnURL.value = "https://cardknox.link/ebtcontinued";
	accuId.value = Response.xAccuID;
	accuLanguage.value = "en-US";
	pinPadCommand.value = xcommand.value;
	pinPadRefnum.value = Response.xRefNum;
	pinModal.show();
	document.forms["pinPadLink"].submit();
	refnum.value = Response.xRefNum;
}

//Ending of file
billingShow();
sandboxMode();
let radioButton = document.getElementById("credit");
radioButton.checked = true;
radioButton.dispatchEvent(new Event("click"));
options3ds();
