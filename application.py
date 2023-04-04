from flask import Flask, render_template, request, send_from_directory
import requests
import json
import logging

# declare app
application = Flask(__name__)


# serve main page
@application.route("/")
def index():
    return render_template(["index.html", "app.js", "style.css"])


#apple pay domain verification
@application.route("/.well-known/apple-developer-merchantid-domain-association")
def applemid():
    return send_from_directory(application.static_folder, "apple-developer-merchantid-domain-association")

# submit to gateway
@application.route("/submit", methods=["POST"])
def submit():
    logging.info(request.is_json)
    content = request.get_json()
    logging.info(content)
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
    dupe = False
    try:
        if content["allow-duplicate"] == "on":
            dupe = True
    except:
        pass
    payload = json.dumps({
        "xcommand": content["command"],
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xkey": content["api-key"],
        "xamount": content["amount"],
        "xcardnum": content["cc-number"],
        "xcvv": content["cc-cvv"],
        "xexp": content["cc-expiration"],
        "xBillFirstName": content["firstname"],
        "xBillLastName": content["lastname"],
        "xBillStreet": content["address"],
        "xBillCountry": content["country"],
        "xBillState": content["state"],
        "xBillCity": content["city"],
        "xBillZip": content["zip"],
        "xEmail": content["email"],
        "xBillMobile": content["phone"],
        "xallowduplicate": dupe,
    })
    print(payload)
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    logging.info(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


#3D Secure friction handling
@application.route("/verify", methods=["POST"])
def verify():
    print(request.is_json)
    content = request.get_json()
    print(content)
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/verifyjson"
    x3dsError = content["x3dsError"]
    print(x3dsError)
    payload = json.dumps({
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xkey": content["api-key"],
        "xallowduplicate": "true" if content["allow-duplicate"] == "on" else "false",
        "xRefnum": content["xRefNum"],
        "xCavv": content["xCavv"],
        "xEci": content["xEci"],
        "x3dsAuthenticationStatus": content["x3dsAuthenticationStatus"],
        "x3dsSignatureVerificationStatus": content["x3dsSignatureVerificationStatus"],
        "x3dsActionCode": content["x3dsActionCode"],
    })
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


#google pay
@application.route("/googlepay", methods = ["POST"])
def googlepay():
    print(request.is_json)
    payloads = request.get_json()
    print(payloads)
    content = payloads["payload"]
    gpContent = payloads["paymentResponse"]
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
    dupe = False
    try:
        if content["allow-duplicate"] == "on":
            dupe = True
    except:
        pass
    payload = json.dumps({
        "xcommand": content["command"],
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xDigitalWalletType": "GooglePay",
        "xkey": content["api-key"],
        "xamount": content["amount"],
        "xcardnum": payloads["encodedToken"],
        "xName": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["name"],
        "xBillStreet": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["address1"],
        "xBillCountry": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["countryCode"],
        "xBillState": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["administrativeArea"],
        "xBillCity": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["locality"],
        "xBillZip": gpContent["paymentData"]["paymentMethodData"]["info"]["billingAddress"]["postalCode"],
        "xallowduplicate": dupe,
    })
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


@application.route("/applepay", methods = ["POST"])
def applepay():
    logging.info(request.is_json)
    payloads = request.get_json()
    logging.info(payloads)
    content = payloads["payload"]
    apContent = payloads["paymentResponse"]
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
    dupe = False
    try:
        if content["allow-duplicate"] == "on":
            dupe = True
    except:
        pass
    address = apContent["billingContact"]["addressLines"]
    payload = json.dumps({
        "xcommand": content["command"],
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xDigitalWalletType": "ApplePay",
        "xkey": content["api-key"],
        "xamount": payloads["amountf"],
        "xcardnum": payloads["encodedToken"],
        "xBillFirstName": apContent["billingContact"]["givenName"],
        "xBillLastName": apContent["billingContact"]["familyName"],
        "xBillStreet": address[0],
        "xBillCountry": apContent["billingContact"]["countryCode"],
        "xBillState": apContent["billingContact"]["administrativeArea"],
        "xBillCity": apContent["billingContact"]["locality"],
        "xBillZip": apContent["billingContact"]["postalCode"],
        "xallowduplicate": dupe,
    })
    logging.info(payload)
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    logging.info(response)
    return json.dumps({"Status": 200, "Response": response})


@application.route("/click2pay", methods = ["POST"])
def click2pay():
    logging.info(request.is_json)
    payloads = request.get_json()
    logging.info(payloads)
    content = payloads["payload"]
    c2Content = payloads["clickToPayResponse"]
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
    dupe = False
    try:
        if content["allow-duplicate"] == "on":
            dupe = True
    except:
        pass
    payload = json.dumps({
        "xcommand": content["command"],
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xDigitalWalletType": "ClickToPay",
        "xkey": content["api-key"],
        "xamount": payloads["amountf"],
        "xcardnum": c2Content["payload"]["token"],
        "xClickToPayTransactionId": c2Content["payload"]["transactionId"],
        "xClickToPayExternalClientId": c2Content["payload"]["externalClientId"],
        "xClickToPayEncryptionKey": c2Content["payload"]["encryptionKey"],
        "xallowduplicate": dupe,
    })
    logging.info(payload)
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    logging.info(response)
    return json.dumps({"Status": 200, "Response": response})


# parameters to run with
if __name__ == "__main__":
    application.run(debug=False)