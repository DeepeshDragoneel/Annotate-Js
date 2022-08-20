import { v4 as uuidv4 } from "uuid";
import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { AnnotateStartMenu } from "./AnnotateStartMenu/AnnotateStartMenu";
import { App } from "./App";
import axios from "axios";
import { serverUrl } from "./contants";
import { StoreContext } from "./utils/store";
import StoreProvider from "./utils/store";

let itemBeingCommented;
let elementIdentifier;
const buttonFunctions = new Map();

// const { loginCard, setloginCard } = useContext(StoreContext);

export let loggedIn = true;
export const checkUserLogin = async () => {
    //checking wether the user is logged in
    const backDropLoginDiv = document.createElement("div");
    backDropLoginDiv.id = "AnnotateJs_BackLoginDiv";
    backDropLoginDiv.className = "AnnotateJs_Component";
    backDropLoginDiv.style.position = "fixed";
    backDropLoginDiv.style.top = "0";
    backDropLoginDiv.style.left = "0";
    backDropLoginDiv.style.width = "100vw";
    backDropLoginDiv.style.height = "100vh";
    backDropLoginDiv.style.backgroundColor = "rgba(0,0,0,0.7)";
    backDropLoginDiv.style.zIndex = "99999991";
    backDropLoginDiv.style.display = "flex";
    backDropLoginDiv.style.justifyContent = "center";
    backDropLoginDiv.style.alignItems = "center";
    backDropLoginDiv.onclick = function (e) {
        e.stopPropagation();
    };
    document.body.appendChild(backDropLoginDiv);
    const userLoginPage = document.createElement("div");
    userLoginPage.id = "AnnotateJs_UserLoginPage";
    userLoginPage.className = "AnnotateJs_Component";
    // userLoginPage.style.backgroundColor = "white";
    backDropLoginDiv.appendChild(userLoginPage);
    if (
        localStorage.getItem("AnnotateJsUserToken") === undefined ||
        localStorage.getItem("AnnotateJsUserToken") === null
    ) {
        console.log("User is not logged in");
        loggedIn = false;
    } else {
        const AnnotateJsUserToken = localStorage.getItem("AnnotateJsUserToken");
        // const result = await axios({
        //     method: "post",
        //     url: `${serverUrl}/checkUser`,
        //     data: {
        //         AnnotateJsUserToken: AnnotateJsUserToken,
        //         domain: window.location.hostname,
        //     },
        // });
        const result = await axios.post(
            `${serverUrl}checkUser`,
            {
                AnnotateJsUserToken: AnnotateJsUserToken,
                domain: window.location.hostname,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (result.data.success) {
            if (!result.data.access) {
                console.log("User has no access");
                return;
            } else {
                console.log("User is logged in");
                backDropLoginDiv.style.display = "none";
            }
        } else {
            loggedIn = false;
            console.log("User is not logged in");
            localStorage.removeItem("AnnotateJsUserToken");
        }
    }

    if (!loggedIn) {
    }
};

export const initializeAnnotateJs = () => {
    const js_script_tag = document.getElementById("AnnotateJs_Script_Id");
    var my_var_1 = js_script_tag.getAttribute("data-allowedUsers");
    var my_var_2 = js_script_tag.getAttribute("data-admin-users");
    console.log(my_var_2);
    elementIdentifier = js_script_tag.getAttribute("data-attr-given");
    if (typeof my_var_1 !== "undefined") {
        let allowedUsers = my_var_1.split(",");
        let adminUsers = my_var_2.split(",");
        console.log(allowedUsers, adminUsers);
        axios({
            method: "post",
            url: "https://annotate-js-backend.herokuapp.com/addUsers",
            data: {
                allowedUsers: allowedUsers,
                domain: window.location.hostname,
                adminUsers: adminUsers,
            },
        });
    }
    itemBeingCommented = undefined;
    console.log("AnnotatorJs Loaded! ✌🏻");
};

export const createSideBarForComments = () => {
    const annotateJsCommentsSideBarDiv = document.createElement("div");
    annotateJsCommentsSideBarDiv.id = "AnnotateJs_CommentsSideBarDiv";
    annotateJsCommentsSideBarDiv.className = "AnnotateJs_Component";
    annotateJsCommentsSideBarDiv.classList.add("showSideBoxAnnotateJs");
    annotateJsCommentsSideBarDiv.style.position = "fixed";
    annotateJsCommentsSideBarDiv.style.top = "0px";
    annotateJsCommentsSideBarDiv.style.right = "-100%";
    annotateJsCommentsSideBarDiv.style.overflowY = "scroll";
    // annotateJsCommentsSideBarDiv.style.transform = "translateX(100%)";
    annotateJsCommentsSideBarDiv.style.transition =
        "transform 0.5s ease-in-out";
    annotateJsCommentsSideBarDiv.style.zIndex = "99999995";
    annotateJsCommentsSideBarDiv.style.transition = "1s ease-in-out";
    annotateJsCommentsSideBarDiv.style.boxShadow = "0px 0px 10px #000000";
    const sideBarBackDrop = document.createElement("div");
    sideBarBackDrop.id = "AnnotateJs_CommentsSideBarBackDrop";
    sideBarBackDrop.className = "AnnotateJs_Component";
    sideBarBackDrop.style.position = "fixed";
    sideBarBackDrop.style.top = "0px";
    sideBarBackDrop.style.right = "0px";
    sideBarBackDrop.style.width = "100vw";
    sideBarBackDrop.style.height = "100vh";
    sideBarBackDrop.style.backgroundColor = "rgba(0,0,0,0.5)";
    sideBarBackDrop.style.zIndex = "99999994";
    sideBarBackDrop.style.display = "none";
    sideBarBackDrop.onclick = () => {
        toogleCommentSideBar();
    };
    document.body.appendChild(sideBarBackDrop);
    // let style = document.createElement("style");
    // style.type = "text/css";
    // let keyFrames =
    //     "\
    // @-webkit-keyframes showSideBar {\
    //     0% {\
    //         -webkit-transform: translateX(0%);\
    //         -webkit-display: none;\
    //     }\
    //     100% {\
    //         -webkit-transform: translateX(100%);\
    //         -webkit-display: block;\
    //     }\
    // }\
    // @-moz-keyframes hideSideBar {\
    //     0% {\
    //         -webkit-transform: translateX(100%);\
    //         -webkit-display: block;\
    //     }\
    //     100% {\
    //         -webkit-transform: translateX(0%);\
    //         -webkit-display: none;\
    //     }\
    // }";
    // style.innerHTML = keyFrames;
    // document.getElementsByTagName("head")[0].appendChild(style);

    if (window.innerWidth < 500) {
        annotateJsCommentsSideBarDiv.style.width = "100%";
    } else if (window.innerWidth < 1000) {
        annotateJsCommentsSideBarDiv.style.width = "40%";
    } else if (window.innerWidth < 800) {
        annotateJsCommentsSideBarDiv.style.width = "50%";
    } else {
        annotateJsCommentsSideBarDiv.style.width = "25%";
    }
    annotateJsCommentsSideBarDiv.style.height = "100vh";
    annotateJsCommentsSideBarDiv.style.backgroundColor = "white";
    // var css =
    //     ".showSideBoxAnnotateJs {   opacity:1;  visibility: visible;  transition: all 0.25s ease; transform: translateX(0); animation: fadeInRight .25s ease forwards;}\
    //     @-webkit-keyframes fadeInRight {\
    //     0% {\
    //         opacity: 0;\
    //         left: 20%;\
    //     }\
    //     100% {\
    //         opacity: 1;\
    //         left: 0;\
    //     }\
    // }";

    // document.head.appendChild(document.createElement("style")).innerHTML = css;
    // document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[1]);
    // annotateJsCommentsSideBarDiv.style.zIndex = "99999991";
    document.body.appendChild(annotateJsCommentsSideBarDiv);
};

export const startRenderingReact = () => {
    const startAnnotatorButtonDiv = document.createElement("div");
    startAnnotatorButtonDiv.id = "AnnotateJs_StartAnnotatorButtonDiv";
    startAnnotatorButtonDiv.style.position = "fixed";
    startAnnotatorButtonDiv.style.bottom = "0px";
    startAnnotatorButtonDiv.style.right = "50%";
    startAnnotatorButtonDiv.style.transform = "translate(50%)";
    startAnnotatorButtonDiv.style.zIndex = "99999990";
    document.body.appendChild(startAnnotatorButtonDiv);
    const extraSpacingDiv = document.createElement("div");
    // extraSpacingDiv.style.height = "1rem";
    document.body.appendChild(extraSpacingDiv);

    const annotateJsCommentBoxDiv = document.createElement("div");
    annotateJsCommentBoxDiv.id = "AnnotateJs_CommentBoxDiv";
    annotateJsCommentBoxDiv.style.position = "absolute";
    annotateJsCommentBoxDiv.style.display = "none";
    annotateJsCommentBoxDiv.style.zIndex = "99999992";
    annotateJsCommentBoxDiv.style.backgroundColor = "white";

    const annotateJsHelpDiv = document.createElement("div");
    annotateJsHelpDiv.id = "AnnotateJs_HelpDiv";
    annotateJsHelpDiv.className = "AnnotateJs_Component";
    annotateJsHelpDiv.style.position = "fixed";
    annotateJsHelpDiv.style.top = "0";
    annotateJsHelpDiv.style.left = "0";
    annotateJsHelpDiv.style.width = "100vw";
    annotateJsHelpDiv.style.height = "100vh";
    annotateJsHelpDiv.style.backgroundColor = "rgba(0,0,0,0.3)";
    annotateJsHelpDiv.style.zIndex = "99999991";
    annotateJsHelpDiv.style.display = "none";
    document.body.appendChild(annotateJsHelpDiv);
    // annotateJsCommentBoxDiv.style.display = "none";
    document.body.appendChild(annotateJsCommentBoxDiv);
    createSideBarForComments();
    ReactDOM.createRoot(startAnnotatorButtonDiv).render(
        <StoreProvider>
            <App />
        </StoreProvider>
    );
};

const uniqueClassNameGen = uuidv4();
//generating unique Class name to each and every element in the DOM

export const assignUniqueClasses = () => {
    let allElements = document.querySelectorAll("*");
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].classList.add(`AnnotateJs_${window.location.href}_${i}`);
    }
};

let windowOnMouseOverPrevFunc, windowOnMouseDownPrevFunc;

export const postComment = async (comment) => {
    console.log(itemBeingCommented, comment);
    if (itemBeingCommented !== undefined && itemBeingCommented !== null) {
        const result = await axios({
            method: "POST",
            url: `https://annotate-js-backend.herokuapp.com/postComment`,
            data: {
                comment: comment,
                itemBeingCommented: itemBeingCommented,
                pageOfDomain: window.location.href,
                userToken: localStorage.getItem("AnnotateJsUserToken"),
                domain: window.location.hostname,
            },
        });
        // if (!result.success) {
        //     localStorage.removeItem("AnnotateJsUserToken");
        //     window.location.reload();
        // }
        console.log(result);
    }
    return itemBeingCommented;
};

export const closeAnnotateJsCommentBox = () => {
    // console.log("closeAnnotateJsCommentBox");
    if (document.querySelector("#AnnotateJs_CommentBoxDiv") !== null) {
        document.querySelector("#AnnotateJs_CommentBoxDiv").style.display =
            "none";
    }
    const backDropDisplayDiv = document.getElementById(
        "AnnotateJs_BackDropDisplayDiv"
    );
    if (backDropDisplayDiv !== null) {
        backDropDisplayDiv.remove();
    }
    enableScroll();
};

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

export function preventDefault(e) {
    e.preventDefault();
}

export function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
var supportsPassive = false;
try {
    window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
            get: function () {
                supportsPassive = true;
            },
        })
    );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

export function disableScroll() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function enableScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );
    // return !(rect.top < 0 || rect.bottom - viewHeight >= 0);
    if (rect.top < 0) return 1;
    if (rect.bottom - viewHeight >= 0) return 2;
    return 0;
}

export const startAnnotation = () => {
    document.body.style.userSelect = "none";
    // window.addEventListener("mouseover", function (e) {
    //     updateMask(e.target);
    // });
    // window.addEventListener("mousedown", function (e) {
    //     console.log(e.target);
    // });
    // $("td")
    //     .find("a")
    //     .find("input")
    //     .each(function () {
    //         $(this).addClass("disabled-link");
    //     });

    // $(".disabled-link").on("click", false);
    windowOnMouseOverPrevFunc = window.onmouseover;
    windowOnMouseDownPrevFunc = window.onmousedown;
    const buttonAndLinks = document.querySelectorAll(
        "a, button,li, input, textarea, select"
    );
    for (let i = 0; i < buttonAndLinks.length; i++) {
        // console.log(buttonAndLinks[i]);
        if (buttonAndLinks[i].id === "AnnotateJs_Container") {
            continue;
        }
        if (buttonAndLinks[i].classList.contains("AnnotateJs_Component"))
            continue;
        if (
            buttonAndLinks[i].tagName === "A" ||
            buttonAndLinks[i].tagName === "LINK"
        ) {
            var href = buttonAndLinks[i].href;
            buttonAndLinks[i].setAttribute("rel", href);
            buttonAndLinks[i].href = "javascript:;";
        } else if (
            buttonAndLinks[i].tagName === "INPUT" ||
            buttonAndLinks[i].tagName === "TEXTAREA" ||
            buttonAndLinks[i].tagName === "SELECT"
        ) {
            buttonAndLinks[i].disabled = true;

            console.log(buttonAndLinks[i]);
        } else if (buttonAndLinks[i].tagName === "BUTTON") {
            buttonFunctions[
                buttonAndLinks[i].getAttribute(`${elementIdentifier}`)
            ] = buttonAndLinks[i].onclick;
            buttonAndLinks[i].onclick = (e) => {
                e.preventDefault();
            };
            buttonAndLinks[i].style.cursor = "default";
            // buttonAndLinks[i].click(function (event) {
            //     event.preventDefault();
            // });
            // buttonAndLinks[i].disabled = true;
            // const wrapperDiv = document.createElement("div");
            // wrapperDiv.setAttribute(
            //     `${elementIdentifier}`,
            //     `${buttonAndLinks[i].getAttribute(elementIdentifier)}`
            // );
            // buttonAndLinks[i].parentNode.insertBefore(wrapperDiv, buttonAndLinks[i]);
            // buttonAndLinks[i].remove();
            // wrapperDiv.appendChild(buttonAndLinks[i]);
            // wrapperDiv.onmouseenter = function (e) {
            //     updateMask(e.target);
            // };
            // wrapperDiv.onclick = function (e) {
            //     console.log(e.target);
            // }
        }
    }
    window.onmouseover = function (e) {
        if (e.target.id === "AnnotateJs_Container") {
            return;
        }
        if (e.target.classList.contains("AnnotateJs_Component")) return;
        updateMask(e.target);
    };

    document.onclick = function (e) {
        if (e.target.classList.contains("AnnotateJs_Component")) return;
        // itemBeingCommented = e.target.className.split(" ").find((c) => {
        //     return c.includes("AnnotateJs_");
        // });
        itemBeingCommented = e.target.getAttribute(elementIdentifier);
        console.log(itemBeingCommented);
        const annotateJsCommentBoxDiv = document.getElementById(
            "AnnotateJs_CommentBoxDiv"
        );
        annotateJsCommentBoxDiv.style.display = "block";
        annotateJsCommentBoxDiv.style.transform = "translate(-50%, -50%)";
        let xPos = e.pageY;
        let yPos = e.pageX;
        if (yPos + 250 > window.innerWidth) {
            yPos -= 150;
        }
        if (yPos - 250 < 0) {
            yPos += 250;
        }
        // if (
        //     e.pageY + 300 >
        //     (e.pageY % window.innerHeight) +
        //         window.innerHeight * (e.pageY / window.innerHeight)
        // ) {
        //     xPos -= 300;
        // }
        // if (
        //     e.pageY - 100 >
        //     (e.pageY % window.innerHeight) +
        //         window.innerHeight * (e.pageY / window.innerHeight)
        // ) {
        //     xPos += 100;
        // }
        annotateJsCommentBoxDiv.style.top = xPos + "px";
        annotateJsCommentBoxDiv.style.left = yPos + "px";
        const vis = checkVisible(annotateJsCommentBoxDiv);
        if (vis == 1) {
            xPos += 100;
        }
        if (vis == 2) {
            xPos -= 100;
        }
        annotateJsCommentBoxDiv.style.top = xPos + "px";
        // console.log(e.target);
        // console.log(e.offsetY, window.innerHeight);
        // console.log(e.target.id);
        const backDropDisplayDiv = document.createElement("div");
        backDropDisplayDiv.id = "AnnotateJs_BackDropDisplayDiv";
        backDropDisplayDiv.className = "AnnotateJs_Component";
        backDropDisplayDiv.style.position = "fixed";
        backDropDisplayDiv.style.top = "0";
        backDropDisplayDiv.style.left = "0";
        backDropDisplayDiv.style.width = "100vw";
        backDropDisplayDiv.style.height = "100vh";
        backDropDisplayDiv.style.backgroundColor = "rgba(0,0,0,0.3)";
        backDropDisplayDiv.style.zIndex = "99999991";
        backDropDisplayDiv.onclick = function (e) {
            e.stopPropagation();
            closeAnnotateJsCommentBox();
        };
        document.body.appendChild(backDropDisplayDiv);
        // disableScroll();
    };

    window.onmousedown = function (e) {
        // e.preventDefault();
        if (e.target.classList.contains("AnnotateJs_Component")) return;
    };

    function updateMask(target) {
        let elements = document.getElementsByClassName("highlight-wrap");
        let hObj;
        if (elements.length !== 0) {
            hObj = elements[0];
        } else {
            hObj = document.createElement("div");
            hObj.className = "highlight-wrap";
            hObj.style.position = "absolute";
            hObj.style.backgroundColor = "aqua";
            hObj.style.opacity = "0.5";
            hObj.style.cursor = "default";
            // hObj.style.pointerEvents = "auto";
            hObj.style.pointerEvents = "none";
            hObj.onmousedown = function (e) {
                // console.log("mousedown");
            };
            hObj.style.zIndex = "9999999";
            hObj.style.boxSizing = "border-box";
            hObj.style.border = "1px solid blue";
            document.body.appendChild(hObj);
        }
        let rect = target.getBoundingClientRect();
        // target.style.pointerEvents = "none";
        hObj.style.left = rect.left + window.scrollX + "px";
        hObj.style.top = rect.top + window.scrollY + "px";
        hObj.style.width = rect.width + "px";
        hObj.style.height = rect.height + "px";
    }
};

export const stopAnnotation = () => {
    document.body.style.userSelect = "auto";
    // document.body.style.pointerEvents = "auto";
    const buttonAndLinks = document.querySelectorAll("a, button,li, input");
    for (let i = 0; i < buttonAndLinks.length; i++) {
        // console.log(buttonAndLinks[i]);
        if (buttonAndLinks[i].id === "AnnotateJs_Container") {
            continue;
        }
        if (buttonAndLinks[i].classList.contains("AnnotateJs_Component"))
            continue;
        if (
            buttonAndLinks[i].tagName === "A" ||
            buttonAndLinks[i].tagName === "LINK"
        ) {
            var href = buttonAndLinks[i].getAttribute("rel");
            buttonAndLinks[i].removeAttribute("rel");
            buttonAndLinks[i].href = href;
        } else if (buttonAndLinks[i].tagName === "BUTTON") {
            buttonAndLinks[i].onclick =
                buttonFunctions[
                    buttonAndLinks[i].getAttribute(`${elementIdentifier}`)
                ];
            buttonAndLinks[i].style.cursor = "pointer";
        } else if (buttonAndLinks[i].tagName === "INPUT") {
            buttonAndLinks[i].disabled = false;
        }
    }
    window.onmouseover = windowOnMouseOverPrevFunc;
    window.onmousedown = windowOnMouseDownPrevFunc;
    let elements = document.getElementsByClassName("highlight-wrap");
    if (elements.length !== 0) {
        elements[0].remove();
    }
    document.onclick = null;
};

export const toogleCommentSideBar = () => {
    // console.log("toogleCommentSideBar");

    const annotateJsCommentBoxDiv = document.getElementById(
        "AnnotateJs_CommentsSideBarDiv"
    );
    const annotateJsCommentsSideBarBackDropDiv = document.getElementById(
        "AnnotateJs_CommentsSideBarBackDrop"
    );
    // console.log(annotateJsCommentBoxDiv);
    if (annotateJsCommentBoxDiv.classList.contains("showSideBoxAnnotateJs")) {
        annotateJsCommentBoxDiv.classList.remove("showSideBoxAnnotateJs");
        annotateJsCommentBoxDiv.style.right = "0";
        annotateJsCommentsSideBarBackDropDiv.style.display = "block";
    } else {
        annotateJsCommentBoxDiv.classList.add("showSideBoxAnnotateJs");
        annotateJsCommentBoxDiv.style.right = "-100%";
        annotateJsCommentsSideBarBackDropDiv.style.display = "none";
    }
};

export const closeAnnotateJsHelpDiv = () => {
    const annotateJsHelpDiv = document.getElementById("AnnotateJs_HelpDiv");
    annotateJsHelpDiv.style.display = "none";
    enableScroll();
};

export const displayHelpDiv = () => {
    const annotateJsHelpDiv = document.getElementById("AnnotateJs_HelpDiv");
    annotateJsHelpDiv.style.display = "flex";
    annotateJsHelpDiv.style.justifyContent = "center";
    annotateJsHelpDiv.style.alignItems = "center";
    annotateJsHelpDiv.onclick = function (e) {
        console.log("mousedown");
        e.stopPropagation();
        closeAnnotateJsHelpDiv();
    };
    disableScroll();
};

// startAnnonatation();

window.onload = function () {
    initializeAnnotateJs();
    checkUserLogin();
    assignUniqueClasses();
    startRenderingReact();
};
