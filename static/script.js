if (md_html) {
    let index = -1
    let more = true

    while (more) {
        index = md_html.indexOf("<h", index + 4)
        if (index == -1) {
            more = false
        } else {
            let key = md_html.substring(index + 1, index + 3)
            let contents = md_html.substring(md_html.indexOf("<" + key + ">") + 4, md_html.indexOf("</" + key + ">"))

            let num;
            let elms = document.querySelectorAll(key)
            for (var i = 0; i < elms.length; i++) {
                if (elms[i].innerHTML = contents) {
                    num = Math.random() * 10000
                    elms[i].id = num
                }
            }

            let elm = document.createElement("li")
            elm.className = key
            elm.innerHTML = contents
            elm.setAttribute("onclick", "window.location.hash = '#" + num + "'")

            document.querySelector(".contents-box").appendChild(elm)
        }
    }

    document.querySelector(".content-container").innerHTML = md_html
} else {
    document.querySelector(".content-container").innerHTML = "<h6>Something went wrong.</h6>"
}
