if (md_html) {
    let index = -4
    let more = true

    while (more) {
        let newindex = md_html.indexOf("<h", index + 4)
        if (newindex == -1) {
            more = false
        } else {
            index = newindex
            let key = md_html.substring(index + 1, index + 3)
            let contents = md_html.substring(md_html.indexOf("<" + key + ">") + 4, md_html.indexOf("</" + key + ">"))

            let val;
            let elms = document.querySelectorAll(key)
            for (var i = 0; i < elms.length; i++) {
                val = elms[i].innerHTML.toLowerCase().split(" ").join("-").split(".").join("")
                elms[i].id = val
            }

            let elm = document.createElement("li")
            elm.className = key
            elm.innerHTML = contents
            elm.setAttribute("onclick", "window.location.hash = '#" + val + "'")

            document.querySelector(".contents-box").appendChild(elm)
        }
    }

    document.querySelector(".content-container").innerHTML = md_html
} else {
    document.querySelector(".content-container").innerHTML = "<h6>Something went wrong.</h6>"
}
