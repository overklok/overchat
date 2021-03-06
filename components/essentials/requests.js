.pragma library

const OAUTH_URL = "https://www.googleapis.com/oauth2/v4/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";

// Идентификатор веб-клиента (Firebase -> Authentication -> Способ входа -> Google -> Настройка SDK для веб-клиента -> Идентификатор веб-клиента)
const CLIENT_ID = "<ID в API Console>.apps.googleusercontent.com";
// Секрет клиента
const CLIENT_SECRET = "AWRd0wwr0IafsCu0o02c3TS6";
// URI перенаправления, указанный в настройках API Console
const REDIRECT_URI = "https://<Firebase ID>.firebaseapp.com/__/auth/handler";
// URI Firebase
const FIREBASE_URL = "https://<ID_проекта>.firebaseio.com";

function refreshToken(token, cb) {
    var http = new XMLHttpRequest();
    var url = OAUTH_URL +
                "?client_id=" + CLIENT_ID +
                "&client_secret=" + CLIENT_SECRET +
                "&grant_type=refresh_token" +
                "&refresh_token=" + token;

    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() { // Call a function when the state changes.
        if (http.readyState == 4) {
            if (http.status == 200) {
                console.log("ok");

                var result = JSON.parse(http.responseText);
                cb(result["access_token"], result["expires_in"], token);
            } else {
                console.log("refreshToken error: " + http.status, token);
                console.log(http.responseText);
            }
        }
    }
    http.send();
}

function getUserCredentials(code, cb) {
    var http = new XMLHttpRequest();
    var url = OAUTH_URL +
                "?client_id=" + CLIENT_ID +
                "&client_secret=" + CLIENT_SECRET +
                "&redirect_uri=" + REDIRECT_URI +
                "&grant_type=authorization_code" +
                "&code=" + code;

    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() { // Call a function when the state changes.
        if (http.readyState == 4) {
            if (http.status == 200) {
                console.log("ok");

                var result = JSON.parse(http.responseText);
                getUserInfo(result, cb);
            } else {
                console.log("error: " + http.status);
                console.log(http.responseText);
            }
        }
    }
    http.send();
}

function getUserInfo(credentials, cb) {
    var http = new XMLHttpRequest();
    var url = USERINFO_URL +
            "?access_token=" + credentials["access_token"];

    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() { // Call a function when the state changes.
        if (http.readyState == 4) {
            if (http.status == 200) {
                console.log("ok");

                console.log("User info", http.responseText);

                var result = JSON.parse(http.responseText);
                cb({
                       "access_token": credentials["access_token"],
                       "refresh_token": credentials["refresh_token"],
                       "expires_in": credentials["expires_in"],
                       "id_token": credentials["id_token"],
                   });

            } else {
                console.log("getUserInfo error: " + http.status, credentials);
                console.log(http.responseText);
            }
        }
    }
    http.send();
}
