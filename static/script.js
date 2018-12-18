if (md_html) {

    document.querySelector(".content-container").innerHTML = md_html

    // get all the titles in the markdown
    let elms = document.querySelectorAll(".content-container h1, .content-container h2, .content-container h3, .content-container h4, .content-container h5")
    for (var i = 0; i < elms.length; i++) {
        // make a code based on the title
        let val = elms[i].innerHTML.toLowerCase().split(" ").join("-").split(".").join("")
        // set the code as the id
        elms[i].id = val
        // make a list element for the contents box
        let elm = document.createElement("li")
        elm.className = elms[i].tagName.toLowerCase()
        elm.innerHTML = elms[i].innerHTML
        // make it jump to the title on click
        elm.setAttribute("onclick", "window.location.hash = '#" + val + "'")
        document.querySelector(".contents-box").appendChild(elm)
    }

    // loading done
    document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
} else {
    document.querySelector(".content-container").innerHTML = "<h6>Something went wrong.</h6>"

    document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
}
