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
    command = request.form.get("command")
    key = request.form.get("api-key")
    amount = request.form.get("amount")
    cardnum = request.form.get("cc-number")
    cvv = request.form.get("cc-cvv")
    exp = request.form.get("cc-expiration")
    firstname = request.form.get("firstname")
    lastname = request.form.get("lastname")
    address = request.form.get("address")
    country = request.form.get("country")
    state = request.form.get("state")
    city = request.form.get("city")
    zip = request.form.get("zip")
    email = request.form.get("email")
    phone = request.form.get("phone")
    dupe = "true" if request.form.get("allow-duplicate") == "on" else "false"

    payload = json.dumps({
        "xcommand": command,
        "xsoftwareversion": "1.0.0",
        "xversion": "5.0.0",
        "xsoftwarename": "NB Test",
        "xkey": key,
        "xamount": amount,
        "xcardnum": cardnum,
        "xcvv": cvv,
        "xexp": exp,
        "xBillFirstName": firstname,
        "xBillLastName": lastname,
        "xBillStreet": address,
        "xBillCountry": country,
        "xBillState": state,
        "xBillCity": city,
        "xBillZip": zip,
        "xEmail": email,
        "xBillMobile": phone,
        "xallowduplicate": dupe,
    })
    print(payload)
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


#3D Secure friction handling
@application.route("/verify", methods=["POST"])
def verify():
    print(request.form)
    headers = {"Content-Type": "application/json"}
    url = "https://x1.cardknox.com/verifyjson"
    key = request.form.get("api-key")
    dupe = "true" if request.form.get("allow-duplicate") == "on" else "false"
    xRefnum = request.form.get("xRefNum")
    xCavv = request.form.get("xCavv")
    xEci = request.form.get("xEci")
    x3dsAuthenticationStatus = request.form.get("x3dsAuthenticationStatus")
    x3dsSignatureVerificationStatus = request.form.get("x3dsSignatureVerificationStatus")
    x3dsActionCode = request.form.get("x3dsActionCode")
    x3dsError = request.form.get("x3dsError")
    print(x3dsError)
    payload = json.dumps(
        {
            "xsoftwareversion": "1.0.0",
            "xversion": "5.0.0",
            "xsoftwarename": "NB Test",
            "xkey": key,
            "xallowduplicate": dupe,
            "xRefnum": xRefnum,
            "xCavv": xCavv,
            "xEci": xEci,
            "x3dsAuthenticationStatus": x3dsAuthenticationStatus,
            "x3dsSignatureVerificationStatus": x3dsSignatureVerificationStatus,
            "x3dsActionCode": x3dsActionCode,
        }
    )
    apiCall = requests.request("POST", url, headers = headers, data = payload)
    response = apiCall.json()
    print(response["xStatus"], response["xRefNum"])
    return json.dumps({"Status": 200, "Response": response})


# parameters to run with
if __name__ == "__main__":
    # set port to 80 in production
    application.run(debug=False, host="0.0.0.0", port=8080)
