import React, { useState } from "react";
import ReactDom from "react-dom";
import "./AnnotateStartMenu.scss";
import { toogleAnnotation } from "../contants";
import {
    startAnnotation,
    stopAnnotation,
    toogleCommentSideBar,
    displayHelpDiv,
} from "../main.js";
import BugReportIcon from "@mui/icons-material/BugReport";
import LogoutIcon from "@mui/icons-material/Logout";

export const AnnotateStartMenu = () => {
    const [startAnnotateButtonClicked, setStartAnnotateButtonClicked] =
        useState("didNotClickedTheAnnotatorButton");
    const [startAnnotateButtonClicked2, setStartAnnotateButtonClicked2] =
        useState("");

    const handleClick = () => {
        // console.log("handleClick");
        if (startAnnotateButtonClicked === "didNotClickedTheAnnotatorButton") {
            setStartAnnotateButtonClicked("clickedTheAnnotatorButton");
            setStartAnnotateButtonClicked2(
                "clickedTheAnnotatorButtonTransition"
            );
            // toogleAnnotation();
            startAnnotation();
        } else {
            setStartAnnotateButtonClicked("didNotClickedTheAnnotatorButton");
            setStartAnnotateButtonClicked2("");
            // toogleAnnotation();
            stopAnnotation();
        }
    };

    return ReactDom.createPortal(
        <div className="AnnotateStartMenuMainDiv AnnotateJs_Component">
            <p className="AnnotateStartMenuMainDivPTag AnnotateJs_Component">
                {startAnnotateButtonClicked ===
                "didNotClickedTheAnnotatorButton"
                    ? "Start "
                    : "Stop "}
                Annotation:
            </p>
            <div
                className={`switch-container AnnotateJs_Component switch-flat ${startAnnotateButtonClicked}`}
            >
                <div
                    className={`flat-container AnnotateJs_Component ${startAnnotateButtonClicked2}`}
                    onClick={handleClick}
                >
                    {/* <div className="flat flat-off">{PlayArrowIcon}</div> */}
                    <div
                        className={`AnnotateJs_Component flat flat-off `}
                        title="Start"
                    >
                        &#x25B6;
                    </div>
                    <div
                        className={`AnnotateJs_Component flat flat-on`}
                        title="Stop"
                    >
                        &#9634;
                    </div>
                </div>
            </div>
            <div className="AnnotateJs_Component">
                <div
                    className="AnnotateJs_Component AnnotateStartMenuMainDivHelp AnnotateStartMenuMainDivIssues"
                    title="Display Issues"
                    onClick={() => {
                        toogleCommentSideBar();
                    }}
                >
                    <BugReportIcon
                        className="AnnotateJs_Component"
                        style={{
                            color: "#ff9191",
                        }}
                    />
                </div>
            </div>
            <div>
                <div
                    className="AnnotateJs_Component AnnotateStartMenuMainDivHelp"
                    title="Help"
                    onClick={() => {
                        displayHelpDiv();
                    }}
                >
                    &#x3F;
                </div>
            </div>
            <div>
                <div
                    className="AnnotateJs_Component AnnotateStartMenuMainDivLogout"
                    title="Logout"
                    onClick={() => {
                        localStorage.removeItem("AnnotateJsUserToken");
                        window.location.reload();
                    }}
                >
                    <LogoutIcon
                        className="AnnotateJs_Component"
                        style={{
                            color: "#ff9191",
                        }}
                    />
                </div>
            </div>
        </div>,
        document.getElementById("AnnotateJs_StartAnnotatorButtonDiv")
    );
};

// export default AnnotateStartMenu;
