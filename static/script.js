if (md_html) {

    let elms = Array.prototype.slice.call(document.querySelectorAll("h1")).concat(Array.prototype.slice.call(document.querySelectorAll("h2")), Array.prototype.slice.call(document.querySelectorAll("h3")), Array.prototype.slice.call(document.querySelectorAll("h4")), Array.prototype.slice.call(document.querySelectorAll("h5")))
    for (var i = 0; i < elms.length; i++) {
        let val = elms[i].innerHTML.toLowerCase().split(" ").join("-").split(".").join("")
        elms[i].id = val
        let elm = document.createElement("li")
        elm.className = elms[i].tagName.toLowerCase()
        elm.innerHTML = elms[i].innerHTML
        elm.setAttribute("onclick", "window.location.hash = '#" + val + "'")
        document.querySelector(".contents-box").appendChild(elm)
    }

    document.querySelector(".content-container").innerHTML = md_html

    document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
} else {
    document.querySelector(".content-container").innerHTML = "<h6>Something went wrong.</h6>"
}
