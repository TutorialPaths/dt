if (md_html) {
    let index = -1
    let more = true

    while (more) {
        index = md_html.indexOf("<h", index + 1)
        if (index == -1) {
            more = false
        } else {
            let key = md_html.substring(index + 1, index + 3)
            let contents = md_html.substring(md_html.indexOf("<" + key + ">") + 4, md_html.indexOf("</" + key + ">"))

            let elm = document.createElement("li")
            elm.className = key
            elm.innerHTML = contents

            document.querySelector(".contents-box").appendChild(elm)
        }
    }

    document.querySelector(".content-container").innerHTML = md_html
} else {
    document.querySelector(".content-container").innerHTML = "<h6>Something went wrong.</h6>"
}
