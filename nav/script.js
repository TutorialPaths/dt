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
        settings = {"fix_nav": false, "hide_icon": true}
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

window.addEventListener("beforeunload", function (event) {
    document.querySelector(".app-bar").className += " app-bar--loading"
})
