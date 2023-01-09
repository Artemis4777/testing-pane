from flask import Flask, render_template, request
import requests
import json

# declare app
application = Flask(__name__)


# serve main page
@application.route("/")
def index():
    return render_template(["index.html", "app.js", "style.css"])


# submit to gateway
@application.route("/submit", methods=["POST"])
def submit():
    print(request.is_json)
    content = request.get_json()
    print(content)
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
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
        "xallowduplicate": "true" if content["allow-duplicate"] == "on" else "false",
    })
    print(payload)
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
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


# parameters to run with
if __name__ == "__main__":
    # set port to 80 in production
    application.run(debug=False, host="0.0.0.0", port=8080, ssl_context="adhoc")