import {MDCTabBar} from '@material/tab-bar';
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

import {MDCTextField} from '@material/textfield';
var all = document.getElementsByClassName("mdc-text-field")
for (var i = 0; i < all.length; i++) {
    void(new MDCTextField(all[i]))
}

import {MDCRipple} from '@material/ripple';
var all = document.getElementsByClassName("mdc-button")
for (var i = 0; i < all.length; i++) {
    void(new MDCRipple(all[i]))
}

import {MDCTextFieldHelperText} from '@material/textfield/helper-text';
var all = document.getElementsByClassName("mdc-text-field-helper-text")
for (var i = 0; i < all.length; i++) {
    void(new MDCTextFieldHelperText(all[i]))
}

import {MDCDialog} from '@material/dialog';
var all = document.getElementsByClassName("mdc-dialog")
var dialogs = {}
for (var i = 0; i < all.length; i++) {
    dialogs[all[i].id.replace("dialog-", "")] = new MDCDialog(all[i])
}

import {MDCSnackbar} from '@material/snackbar';
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));

for (var i = 0; i < 6; i++) {
    var elm = document.querySelector("input[name=code" + (i + 1) + "]")
    elm.onkeydown = function(e) {
        var i = Number(e.path[0].getAttribute("name").replace("code", "")) - 1
        // to make this work, we'll custom handle inputs
        e.preventDefault()
        if (event.key == 'Backspace' && i > 0) {
            // move back to the previous field and delete that field
            document.querySelector('input[name=code' + i + ']').focus()
            document.querySelector('input[name=code' + i + ']').value = ""
        } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].indexOf(event.key) > -1) {
            // add value and move to next field
            e.path[0].value = event.key
            if (i < 5) {
                document.querySelector('input[name=code' + (i + 2) + ']').focus()
            } else {
                document.querySelector('#rg-username').focus()
            }
        }
        // otherwise do nothing
    }
}

document.querySelector("#d-re-toggle").onclick = function() {
    dialogs.resendemail.open()
}


document.querySelector("form.login").onsubmit = function(e) {
    e.preventDefault()
    setLoader(true)

    var data = $('form.login').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj
    }, {})

    fetchJSON('https://gateway.tutorialpaths.com/v1/autho/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }).catch(function(e) {
        setLoader(false)
        snackbar.show({message: "An unexpected error occured. Please retry later."})
        console.error(e)
    }).then(function(res) {
        if (res.success) {
            var p = new URLSearchParams(window.location.search)
            tls.cookies.set("sr:id", res.session, 1)
            window.location.href = (p.get("r")) ? "/" + p.get("r"):"/"
        } else {
            let displays = {
                "incorrect-password": "Password incorrect.",
                "user-not-found": "No user with username or email."
            }
            console.warn(res.code, res.description, (res.loc) ? res.loc:"")
            snackbar.show({message: (res.display) ? res.display:((displays[res.description]) ? displays[res.description]:res.description)})
        }
        setLoader(false)
    })
}

document.querySelector("form.register").onsubmit = function(e) {
    e.preventDefault()
    setLoader(true)

    var data = $('form.register').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj
    }, {})

    fetchJSON('https://gateway.tutorialpaths.com/v1/autho/register/first', {
        method: 'POST',
        body: JSON.stringify(data)
    }).catch(function(e) {
        setLoader(false)
        snackbar.show({message: "An unexpected error occured. Please retry later."})
        console.error(e)
    }).then(function(res) {
        if (res.success) {
            document.querySelector("#rg-confpassword").setAttribute("pattern", document.querySelector("#rg-password").value)
            document.querySelector("#d-re-content p").innerHTML = document.querySelector("#d-re-content p").innerHTML.split("[email]").join(document.querySelector("#rg-email").value)
            window.location.hash = "#register-second"
        } else {
            let displays = {
                "email-in-use": "Email already in use.",
                "email-not-valid": "Email is not valid."
            }
            console.warn(res.code, res.description, (res.loc) ? res.loc:"")
            snackbar.show({message: (res.display) ? res.display:((displays[res.description]) ? displays[res.description]:res.description)})
        }
        setLoader(false)
    })
}

document.querySelector("form.register-second").onsubmit = function(e) {
    e.preventDefault()
    setLoader(true)

    var data = $('form.register-second').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj
    }, {})

    data['email'] = document.querySelector("#rg-email").value

    fetchJSON('https://gateway.tutorialpaths.com/v1/autho/register/second', {
        method: 'POST',
        body: JSON.stringify(data)
    }).catch(function(e) {
        setLoader(false)
        snackbar.show({message: "An unexpected error occured. Please retry later."})
        console.error(e)
    }).then(function(res) {
        if (res.success) {
            window.location.hash = "#login"
            snackbar.show({message: "Account created successfully."})
        } else {
            let displays = {
                "code-invalid": "Code incorrect or expired.",
                "username-in-use": "Username is already taken.",
                "weak-password": "Password is too weak."
            }
            console.warn(res.code, res.description, (res.loc) ? res.loc:"")
            snackbar.show({message: (res.display) ? res.display:((displays[res.description]) ? displays[res.description]:res.description)})
        }
        setLoader(false)
    })
}

$(window).on("hashchange", function() {
    document.querySelector(".content").className = "content " + window.location.hash.replace("#", "")
})

function setLoader(state) {
    var a = (state) ? "not-loading":"loading"
    var b = (state) ? "loading":"not-loading"
    document.querySelector(".mdc-linear-progress").className = document.querySelector(".mdc-linear-progress").className.replace(a, b)
}

function fetchJSON(url, params) {
    return new Promise(function(resolve, reject) {
        fetch(url, params).catch(function() {
            reject("Connection Error")
        }).then(res=>res.text()).catch(function() {
            reject("Text Parse Error")
        }).then(function(res) {
            try {
                let ret = JSON.parse(res)
                resolve(ret)
            } catch(e) {
                console.log(res)
                reject("JSON Parse Error")
            }
        })
    })
}
