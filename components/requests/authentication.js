Qt.include("essentials.js")

// Docs at:
// https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password

const REST_REGISTER_URI = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY;
const REST_LOGIN_URI = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + API_KEY;

function login(email, password, cb) {
    return authRequest(email, password, REST_LOGIN_URI, cb);
}

function register(email, password, cb) {
    return authRequest(email, password, REST_REGISTER_URI, cb);
}

function authRequest(email, password, uri, cb) {
    if (!cb) {console.error("ERR! No Callback provided."); return;}

    var errors = [];
    errors = validate("required", "email", email, []);
    errors = validate("required", "password", password, errors);

    if (errors.length > 0) {
        cb({"type": "vald", "data": errors});
        return;
    }

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        print('xhr: on ready state change: ' + xhr.readyState)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var res = JSON.parse(xhr.responseText.toString());

            if ("error" in res) {
                cb({"type": "fail", "data": res});
            } else {
                cb({"type": "succ", "data": res});
            }
        }
    }

    xhr.open("POST", uri);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    var data = JSON.stringify({email: email, password: password, returnSecureToken: true});

    xhr.send(data);

    return 0;
}
