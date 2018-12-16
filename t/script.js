import {MDCMenu} from '@material/menu';
import {MDCIconToggle} from '@material/icon-toggle';

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

function attachFeedback(ai, bi) {
    let a = MDCIconToggle.attachTo(ai)
    let b = MDCIconToggle.attachTo(bi)

    ai.addEventListener('MDCIconToggle:change', function({detail}) {
        if (detail.isOn) { b.on = false }
    })

    bi.addEventListener('MDCIconToggle:change', function({detail}) {
        if (detail.isOn) { a.on = false }
    })
}

function updateStep() {
    if (window.location.hash == "#/s/start") {
        document.querySelector(".step-container .step").style.marginLeft = ""
    } else {
        while (!loaded) {
            void(0)
        }
        let step_sid = window.location.hash.replace("#/", "").replace("/", ":")
        for (var i = 0; i < tutorial.steps.length; i++) {
            if (tutorial.steps[i]["s:id"] == step_sid) {
                step(tutorial.steps[i]["sr:id"])
            }
        }
    }
}

function updateStepNumber(next) {
    let id;
    if (window.location.hash.replace("#/", "").replace("/", "_") == "s_start") {
        id = tutorial.steps[0]["sr:id"]
    } else {
        for (var i = 0; i < tutorial.steps.length; i++) {
            if (tutorial.steps[i]["s:id"] == window.location.hash.replace("#/", "").replace("/", ":")) {
                id = tutorial.steps[i]["sr:id"]
            }
        }
    }
    let thisstep = Number(document.querySelector(".step." + id.replace(":", "_") + " .counter").innerHTML.replace("Step ", ""))
    document.querySelector(".step." + next.replace(":", "_") + " .counter").innerHTML = "Step " + (thisstep + 1)
}

function step(id) {
    document.querySelector(".step-container .step").style.marginLeft = (Array.prototype.indexOf.call(document.querySelector(".step-container").children, document.querySelector(".step." + id.replace(":", "_"))) * -100) + "%"
}

if (window.location.hash == "") {
    window.history.replaceState(null, null, "#/s/start")
} else {
    checkstep = true
}

window.onhashchange = updateStep

let tutorial;
let steps = {};
let loaded = false;
let checkstep = false;

fetch("https://gateway.tutorialpaths.com/v1/loader/tutorial/" + window.location.href.split("/#")[0].split("/")[window.location.href.split("/#")[0].split("/").length - 1], {
    method: "POST", body: JSON.stringify({})
}).catch(function() {
    console.error("error fetching tutorial")
    // error fetching tutorials
}).then(res=>res.text()).catch(function() {
    console.error("error parsing text")
    // error parsing text
}).then(function(res) {
    try {
        tutorial = JSON.parse(res)

        if (!tutorial.author) {
            tutorial['author'] = {username: "(deleted user)", image: "https://dom.tutorialpaths.com/branding/assets/user_deleted.png"}
        }

        if (!tutorial.code) {
            // load up the tutorial
            let head = ce("div.head")
            let tags = ce("p.tags")
            tags.innerHTML = tutorial.tags.join(" • ")
            head.appendChild(tags)
            let title = ce("h4.title")
            title.innerHTML = tutorial.title
            head.appendChild(title)
            let description = ce("p.description")
            description.innerHTML = tutorial.description
            head.appendChild(description)
            let info = ce("div.info-container")
            let uimg = ce("img")
            uimg.setAttribute("src", (tutorial.author.image == "DEFAULT") ? "https://dom.tutorialpaths.com/branding/assets/user_noimg.png":tutorial.author.image)
            uimg.setAttribute("onclick", "window.location.href = 'https://tutorialpaths.com/u/" + tutorial.author.username + "'")
            info.appendChild(uimg)
            let utxt = ce("p.info-user")
            utxt.innerHTML = "Created by " + tutorial.author.username
            info.appendChild(utxt)
            let rat = ce("div.rating-container")
            let icons = ce("div")
            let tut_rating = Math.round(tutorial.rating * 10)
            for (var j = 0; j < 5; j++) {
                let rating_star = ce("i.material-icons")
                rating_star.innerHTML = "favorite"
                if (tut_rating == j * 2 + 1) {
                    rating_star.className += " half"
                } else if (tut_rating < j * 2 + 1) {
                    rating_star.className += " none"
                }
                icons.appendChild(rating_star)
            }
            rat.appendChild(icons)
            let rattxt = ce("p")
            rattxt.innerHTML = (tutorial.rating * 100) + "% useful"
            rat.appendChild(rattxt)
            info.appendChild(rat)
            head.appendChild(info)
            let feedback = ce("div.feedback-container")
            feedback.innerHTML = '<i class="mdc-icon-toggle material-icons upvote" role="button" aria-pressed="false" aria-label="Upvote" tabindex="0" data-toggle-on=\'{"label": "Un-upvote", "cssClass": "selected"}\' data-toggle-off=\'{"label": "Upvote"}\'>arrow_upward</i><i class="mdc-icon-toggle material-icons downvote" role="button" aria-pressed="false" aria-label="Downvote" tabindex="0" data-toggle-on=\'{"label": "Un-downvote", "cssClass": "selected"}\' data-toggle-off=\'{"label": "Downvote"}\'>arrow_downward</i>'
            head.appendChild(feedback)

            let body = ce("div.body")
            let steps_c = ce("div.step-container")

            for (var j = 0; j < tutorial.steps.length; j++) {
                steps[tutorial.steps[j]["sr:id"]] = tutorial.steps[j]
                let step_inf = tutorial.steps[j]
                let step = ce("div.step." + step_inf["sr:id"].replace(":", "_"))
                let counter = ce("div.counter")
                counter.innerHTML = "Step 1"
                step.appendChild(counter)
                let title = ce("h3")
                title.innerHTML = step_inf.title
                step.appendChild(title)
                let description = ce("p.description")
                description.innerHTML = step_inf.content
                step.appendChild(description)
                let footercont = ce("div.footer-container")
                let options = ce("div.branch-container")
                let bcount = 0
                for (var k = 0; k < tutorial.branches.length; k++) {
                    if (tutorial.branches[k]["pull_sr:id"] == step_inf["sr:id"]) {
                        bcount += 1
                        let branch_inf = tutorial.branches[k]
                        let branch = ce("div.branch")
                        if (branch_inf["push_tr:id"] == '') {
                            branch.onclick = function() {
                                updateStepNumber(branch_inf["push_sr:id"])
                                window.location.hash = "#/" + steps[branch_inf["push_sr:id"]]["s:id"].replace(":", "/")
                            }
                        } else {
                            branch.onclick = function() {
                                tls.cookies.set("pather_" + branch_inf["push_tr:id"], JSON.stringify({
                                    "home": tutorial["tr:id"],
                                    "throw": branch_inf["throw_sr:id"]
                                }), 10)
                                window.location.href = "https://tutorialpaths.com/" + branch_inf["push_tr:id"].replace(":", "/") + ((branch_inf["push_sr:id"] != '') ? ("/#/" + branch_inf["push_sr:id"].replace(":", "/")):"")
                            }
                        }
                        let title = ce("h5.title")
                        title.innerHTML = branch_inf.title
                        branch.appendChild(title)
                        let description = ce("p.description")
                        description.innerHTML = branch_inf.content
                        branch.appendChild(description)
                        options.appendChild(branch)
                    }
                }
                if (bcount == 0) {
                    // must be conclusion
                    if (tls.cookies.get("pather_" + tutorial["tr:id"])) {
                        let pather = JSON.parse(tls.cookies.get("pather_" + tutorial["tr:id"]))
                        window.location.href = "https://tutorialpaths.com/" + pather.home.replace(":", "/") + "/#/" + pather.throw.replace(":", "/")
                    }
                    let similar = ce("h5.similar")
                    similar.innerHTML = (tutorial.similar.length) ? "Similar tutorials:":"No similar tutorials found."
                    options.appendChild(similar)
                    for (var k = 0; k < tutorial.similar.length; k++) {
                        // add thing whatever
                    }
                }
                footercont.appendChild(options)
                step.appendChild(footercont)

                steps_c.appendChild(step)
            }

            body.appendChild(steps_c)

            document.querySelector(".content-container").appendChild(head)
            document.querySelector(".content-container").appendChild(body)

            attachFeedback(feedback.childNodes[0], feedback.childNodes[1])

            document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")

            loaded = true

            if (checkstep) {
                updateStep()
            }
        } else {
            document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
            document.querySelector(".error").style.display = ""
            console.error(tutorials.code + ": " + tutorials.description)

            loaded = true
        }


    } catch(e) {
        document.querySelector("#app-bar").className = document.querySelector("#app-bar").className.replace(" app-bar--loading", "")
        document.querySelector(".error").style.display = ""

        console.error(e)
        console.log(res)

        loaded = true
        // error parsing json
    }
})
