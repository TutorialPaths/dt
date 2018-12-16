import {MDCMenu} from '@material/menu';

let welcome = Boolean(document.cookie.indexOf("tp_ps") == -1)
document.querySelector(".notice").style.display = (welcome) ? "":"none"

function updateView(e) {
    let elm = e.path[0]
    let elms = document.querySelectorAll(".control-box--view li")
    for (var i = 0; i < elms.length; i++) {
        elms[i].className = (elms[i] == elm.parentElement) ? "selected":""
    }

    document.querySelector(".content-container").className = "content-container " + elm.innerHTML
}

let elms = document.querySelectorAll(".control-box--view li")
for (var i = 0; i < elms.length; i++) {
    elms[i].onclick = updateView
}

function ce(input) {
    let elm = document.createElement(input.split("#")[0].split(".")[0])
    if (input.indexOf("#") > -1) {
        elm.id = input.split("#")[1].split(".")[0]
    }
    if (input.indexOf(".") > -1) {
        let cl = input.split(".")
        cl.shift()
        elm.className = cl.join(" ")
    }
    return elm
}

fetch("https://gateway.tutorialpaths.com/v1/loader/tutorials/best", {
    method: "POST", body: JSON.stringify({})
}).catch(function() {
    console.error("error fetching tutorials")
    // error fetching tutorials
}).then(res=>res.text()).catch(function() {
    console.error("error parsing text")
    // error parsing text
}).then(function(res) {
    try {
        let tutorials = JSON.parse(res)

        if (!tutorials.code) {
            console.log("yeah sick, tutorials:", tutorials)
            for (var i = 0; i < tutorials.length; i++) {
                let starturl = tutorials[i].start
                let previewurl = tutorials[i].url

                let t = ce("div.content")
                let img = ce("img")
                img.setAttribute("src", tutorials[i].image)
                t.appendChild(img)
                let cont = ce("div.container")
                let title = ce("h2.title")
                title.innerHTML = tutorials[i].title
                cont.appendChild(title)
                let tags = ce("h4.tags")
                tags.innerHTML = tutorials[i].tags.join(" • ")
                cont.appendChild(tags)
                let rating_container = ce("div.rating-container")
                let icon_container = ce("div.icon-container")
                let tut_rating = Math.round(tutorials[i].rating * 10)
                for (var j = 0; j < 5; j++) {
                    let rating_star = ce("i.material-icons")
                    rating_star.innerHTML = "favorite"
                    if (tut_rating == j * 2 + 1) {
                        rating_star.className += " half"
                    } else if (tut_rating < j * 2 + 1) {
                        rating_star.className += " none"
                    }
                    icon_container.appendChild(rating_star)
                }
                rating_container.appendChild(icon_container)
                let rating_text = ce("h5")
                rating_text.innerHTML = (tutorials[i].rating * 100) + "% useful"
                rating_container.appendChild(rating_text)
                cont.appendChild(rating_container)
                let description = ce("div.description")
                description.innerHTML = tutorials[i].description
                cont.appendChild(description)
                let support_title = ce("h3.support")
                support_title.innerHTML = "Support"
                cont.appendChild(support_title)
                let support_container = ce("div.support-container")
                for (var j = 0; j < tutorials[i].support.length; j++) {
                    let support_item = ce("div.support-chip")
                    support_item.innerHTML = tutorials[i].support[j]
                    support_container.appendChild(support_item)
                }
                cont.appendChild(support_container)
                /*let support_icon = ce("i.support-icon.material-icons")
                support_icon.innerHTML = "mobile_friendly"
                cont.appendChild(support_icon)*/
                let action_container = ce("div.action-container")
                let start = ce("button.start.mdc-button")
                start.innerHTML = "START"
                start.onclick = function() { window.location.href = starturl }
                let preview = ce("button.preview.mdc-button")
                preview.innerHTML = "PREVIEW"
                preview.onclick = function() { window.location.href = previewurl }
                action_container.appendChild(start)
                action_container.appendChild(preview)
                cont.appendChild(action_container)
                let action_container_min = ce("div.action-container--minified")
                let start_min = ce("button.start.mdc-icon-button.material-icons")
                start_min.innerHTML = "play_arrow"
                start_min.onclick = function() { window.location.href = starturl }
                let preview_min = ce("button.preview.mdc-icon-button.material-icons")
                preview_min.innerHTML = "visibility"
                preview_min.onclick = function() { window.location.href = previewurl }
                action_container_min.appendChild(start_min)
                action_container_min.appendChild(preview_min)
                cont.appendChild(action_container_min)
                let share = ce("button.share.mdc-icon-button.material-icons")
                share.innerHTML = 'share<div class="mdc-menu mdc-menu-surface" tabindex="-1"><ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical"><li class="mdc-list-item" role="menuitem"><span class="mdc-list-item__text" onclick="navigator.clipboard.writeText(\'' + tutorials[i].url + '\')">Copy Link</span></li></ul></div>'
                cont.appendChild(share)
                let menu = new MDCMenu(cont.querySelector('.mdc-menu'))
                cont.querySelector(".share").onclick = function(e) { menu.counter = (menu.counter) ? !menu.counter:true; if (menu.counter) { menu.open = true } }
                t.appendChild(cont)
                document.querySelector(".content-container").appendChild(t)
            }

            document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
        } else {
            document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
            document.querySelector(".error").style.display = ""
            console.error(tutorials.code + ": " + tutorials.description)
        }


    } catch(e) {
        document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
        document.querySelector(".error").style.display = ""

        console.error(e)
        console.log(res)
        // error parsing json
    }
})

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    // great, we have a mobile device lol
    document.querySelector("li i.view_headline").parentElement.className = ""
    document.querySelector("li i.view_module").parentElement.className = "selected"
    document.querySelector(".content-container").className = "content-container view-module"

}
