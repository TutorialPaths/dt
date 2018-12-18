import {MDCRipple} from "@material/ripple";
import {MDCDrawer} from "@material/drawer";
import {MDCTopAppBar} from "@material/top-app-bar";
import {MDCTextField} from '@material/textfield';
import {MDCCheckbox} from '@material/checkbox';

void(new MDCCheckbox(document.querySelector('.mdc-checkbox')))

var drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    if (drawer.open && window.innerWidth >= 850) {
        setBarIcons(true)
    } else {
        setBarIcons(false)
    }
    drawer.open = !drawer.open;
});

window.onresize = function(event) {
    if (window.innerWidth >= 850 && document.querySelector(".app-bar__icons").className.indexOf("hidden") > -1 && !drawer.open) {
        setBarIcons(true)
    } else if (window.innerWidth < 850 && document.querySelector(".app-bar__icons").className.indexOf("showing") > -1) {
        setBarIcons(false)
    }
}

var old_drawer_index = null
var curr_drawer_index = 0

var app_drawer_list_items = document.querySelectorAll(".app-drawer-link")
for (let i = 0; i < app_drawer_list_items.length; i++) {
    let list_item = app_drawer_list_items[i]
    if (list_item.className.indexOf("mdc-list-item--activated") > -1) {
        curr_drawer_index = i
    }
    list_item.onmouseup = function() {

        var list_item = this
        var app_drawer_list_items = document.querySelectorAll(".app-drawer-link")
        var respres = [].slice.call(app_drawer_list_items)

        if (old_drawer_index == respres.indexOf(list_item)) {
            // they've clicked on the previous item while in a popover
            app_drawer_list_items[old_drawer_index].className = app_drawer_list_items[old_drawer_index].className.replace(" mdc-list-item--partial", "")
            curr_drawer_index = old_drawer_index
            old_drawer_index = null

            window.setTimeout(function() {
                app_drawer_list_items[curr_drawer_index].setAttribute("href", app_drawer_list_items[curr_drawer_index].getAttribute("old_href"))
                app_drawer_list_items[curr_drawer_index].setAttribute("old_href", "#")
            }, 50)


            // now hide the corresponding popover
            popup(false, "")

            // I reckon we should close the drawer here
            drawer.open = false
            if (window.innerWidth >= 850) {
                setBarIcons(true)
            }

        } else if (app_drawer_list_items[curr_drawer_index].className.indexOf("data_popover") > -1 && old_drawer_index != null) {
            // they've clicked on a new popover whilst in a popover, so switch over to the corresponding popover
            curr_drawer_index = respres.indexOf(this)
            popup(true, app_drawer_list_items[curr_drawer_index].className.split("data_popover-")[1].split(" ")[0])

        } else if (this.className.indexOf("data_popover") > -1) {
            // they've clicked on a popover, do the standard data stuff
            old_drawer_index = curr_drawer_index
            app_drawer_list_items[curr_drawer_index].className += " mdc-list-item--partial"
            app_drawer_list_items[curr_drawer_index].setAttribute("old_href", app_drawer_list_items[curr_drawer_index].getAttribute("href"))
            app_drawer_list_items[curr_drawer_index].setAttribute("href", "#")
            curr_drawer_index = respres.indexOf(list_item)

            // now show the corresponding popover
            popup(true, app_drawer_list_items[curr_drawer_index].className.split("data_popover-")[1].split(" ")[0])
        }
    }
}

function popup(state, id) {
    if (state && window.innerWidth < 600) {
        window.location.href = document.querySelector("#popup__" + id).getAttribute("alt_link")
    }
    let elms = document.querySelectorAll(".popup")
    for (let i = 0; i < elms.length; i++) {
        elms[i].className = elms[i].className.replace(" showing", "") + ((elms[i].id.split("popup__")[1] == id && state) ? " showing":"")
        elms[i].style.display = ((elms[i].id.split("popup__")[1] == id && state) ? "block":"none")
    }
    document.querySelector(".main-overlay").className = document.querySelector(".main-overlay").className.replace(" showing", "") + ((state) ? " showing":"")
    if (state) {
        if (window.innerWidth - ((drawer.open) ? 256:0) < document.querySelector("#popup__" + id).offsetWidth + 50) {
            document.querySelector("#popup__" + id).style.width = window.innerWidth - ((drawer.open) ? 256:0) - 50 + "px"
        } else {
            document.querySelector("#popup__" + id).style.width = document.querySelector("#popup__" + id).getAttribute("def_width")
        }

        document.querySelector("#popup__" + id).style.left = (window.innerWidth - ((drawer.open) ? 256:0)) / 2 - (document.querySelector("#popup__" + id).offsetWidth / 2) + "px"
    }
    if (id == "search") {
        document.querySelector("#search-input").focus()
    }
}

document.querySelector("#main-overlay").onclick = function() {
    popup(false, "")
    app_drawer_list_items[old_drawer_index].click()
}

try {
    document.querySelector(".app-bar__button--logout").onclick = function() {
        popup(true, "logout")
    }
} catch(e) {

}

document.querySelector(".app-bar__button--support").onclick = function() {
    popup(true, "support")
}

document.querySelector(".app-bar__button--settings").onclick = function() {
    popup(true, "settings")
}


window.onkeydown = function(e) {
    if (document.querySelector("#main-overlay").className.indexOf("showing") > -1 && e.which == 27) {
        popup(false, "")
        app_drawer_list_items[old_drawer_index].click()
        if (window.innerWidth >= 850) {
            setBarIcons(true)
        }
    } else if (e.which == 27 && drawer.open && window.innerWidth >= 850) {
        setBarIcons(true)
    }
    if (event.key == "Enter" && document.querySelector("#tf-outlined") === document.activeElement && document.querySelector("#tf-outlined").value) {
        window.location.href = "https://tutorialpaths.com/search?q=" + document.querySelector("#tf-outlined").value
    }
    if (event.key == "Enter" && document.querySelector("#popup__search").className.indexOf("showing") > -1 && document.querySelector("#popup__search input").value) {
        window.location.href = "search?q=" + document.querySelector("#popup__search input").value
    }
}

let hides_drawer_icon = false
function setBarIcons(state) {
    let sts = [(state) ? "hidden":"showing", (state) ? "showing":"hidden"]
    document.querySelector(".app-bar__icons").className = document.querySelector(".app-bar__icons").className.replace(sts[0], "temp")
    document.querySelector(".app-bar__icons").className = document.querySelector(".app-bar__icons").className.replace("temp", sts[1])
    if (hides_drawer_icon) {
        document.querySelector(".app-drawer__toggle").className = document.querySelector(".app-drawer__toggle").className.replace((state) ? "showing":"hidden", (state) ? "hidden":"showing")
    }
}

for (let i = 0; i < document.querySelectorAll(".mdc-text-field").length; i++) {
    let temp = new MDCTextField(document.querySelectorAll(".mdc-text-field")[i])
}

function setSearchBar(state) {
    let sts = [(state) ? "hidden":"showing", (state) ? "showing":"hidden"]
    document.querySelector(".app-bar__search").style.opacity = 0
    document.querySelector(".app-bar__search").className = document.querySelector(".app-bar__search").className.replace(sts[0], "temp")
    window.setTimeout(function() {
        document.querySelector(".app-bar__search").className = document.querySelector(".app-bar__search").className.replace("temp", sts[1])
        document.querySelector(".app-bar__search").style.opacity = 1
    }, 1)
    if (state) {
        window.setTimeout(function() {
            document.querySelector(".app-bar__search input").focus()
        }, 200)
    }
}

function getSearchBarState() {
    return (document.querySelector(".app-bar__search").className.indexOf("showing") > -1) ? true:false
}

document.querySelector(".app-bar__button--search").onclick = function() {
    if (getSearchBarState()) {
        if (document.querySelector("#tf-outlined").value) {
            window.location.href = "https://tutorialpaths.com/search?q=" + document.querySelector("#tf-outlined").value
        } else {
            setSearchBar(false)
        }
    } else {
        setSearchBar(true)
    }
}

document.querySelector("#tf-outlined").addEventListener("focusout", function() {
    console.log("there")
    if (!document.querySelector("#tf-outlined").value) {
        setSearchBar(false)
    }
})

for (let i = 0; i < document.querySelectorAll(".popup-close").length; i++) {
    let elm = document.querySelectorAll(".popup-close")[i]
    elm.onclick = function() {
        popup(false, "")
        app_drawer_list_items[old_drawer_index].click()
    }
}

function setPageSetting(setting, value) {
    let settings = JSON.parse(tls.cookies.get("tp_ps"))
    if (!settings) {
        settings = {"fix_nav": false, "hide_icon": false}
    }
    settings[setting] = value
    tls.cookies.set("tp_ps", JSON.stringify(settings), 1000)

    switch(setting) {
        case "fix_nav":
            document.querySelector("#app-bar").style.position = (value) ? "fixed":"absolute"
            break;
        case "hide_icon":
            hides_drawer_icon = value
            if (value) {
                document.querySelector(".app-drawer__toggle").className = document.querySelector(".app-drawer__toggle").className.replace((document.querySelector(".app-bar__icons").className.indexOf("hidden") > -1) ? "hidden":"showing", (document.querySelector(".app-bar__icons").className.indexOf("hidden") > -1) ? "showing":"hidden")
            } else {
                document.querySelector(".app-drawer__toggle").className = document.querySelector(".app-drawer__toggle").className.replace("hidden", "showing")
            }
            break;
        default:
            break;
    }
}

var settings_list = ["fix_nav", "hide_icon"]
for (i = 0; i < settings_list.length; i++) {
    setPageSetting(settings_list[i], document.querySelector("#ps_" + settings_list[i]).checked)
}

document.querySelector("#ps_fix_nav").onclick = function() {
    setPageSetting("fix_nav", this.checked)
}

document.querySelector("#ps_hide_icon").onclick = function() {
    setPageSetting("hide_icon", this.checked)
}

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    // great, we have a mobile device lol
    setBarIcons(false)

}

window.addEventListener("beforeunload", function (event) {
    document.querySelector(".app-bar").className += " app-bar--loading"
})
