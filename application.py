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
    print(request.form)
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/gatewayjson"
    payload = json.dumps({
        "xcommand": request.form.get("command"),
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "Testing Pane",
        "xkey": request.form.get("api-key"),
        "xamount": request.form.get("amount"),
        "xcardnum": request.form.get("cc-number"),
        "xcvv": request.form.get("cc-cvv"),
        "xexp": request.form.get("cc-expiration"),
        "xBillFirstName": request.form.get("firstname"),
        "xBillLastName": request.form.get("lastname"),
        "xBillStreet": request.form.get("address"),
        "xBillCountry": request.form.get("country"),
        "xBillState": request.form.get("state"),
        "xBillCity": request.form.get("city"),
        "xBillZip": request.form.get("zip"),
        "xEmail": request.form.get("email"),
        "xBillMobile": request.form.get("phone"),
        "xallowduplicate": "true" if request.form.get("allow-duplicate") == "on" else "false",
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


@application.route("/googlepay", methods = ["POST"])
def googlepay():
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
        "xcardnum": content["token"],
        "xBillFirstName": content["firstname"],
        "xBillLastName": content["lastname"],
        "xBillStreet": content["address"],
        "xBillCountry": content["country"],
        "xBillState": content["state"],
        "xBillCity": content["city"],
        "xBillZip": content["zip"],
        "xallowduplicate": "true" if content["allow-duplicate"] == "on" else "false",
    })
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


# parameters to run with
if __name__ == "__main__":
    # set port to 80 in production
    application.run(debug=False, host="0.0.0.0", port=8080)
