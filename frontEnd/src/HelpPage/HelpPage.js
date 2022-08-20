import React from "react";
import ReactDOM from "react-dom";
import './HelpPage.scss';
import BugReportIcon from "@mui/icons-material/BugReport";

export const HelpPage = () => {
    return ReactDOM.createPortal(
        <div className="AnnotateJs_Component HelpPageMainDiv">
            <div className="AnnotateJs_Component HelpPageMainDivPTag">
                Help Page:
            </div>
            <ul className="AnnotateJs_Component HelpPageMainDivUList">
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Click &#x25B6; to Start Commenting!
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Hover over the elements of the webpage to select the
                    component you want to comment on!
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Click on the element you want to comment
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Type your comment in the comment box
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    All the Comments are present in the comment box
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Click on the{" "}
                    <BugReportIcon
                        className="AnnotateJs_Component"
                        style={{
                            color: "#ff9191",
                            fontSize: "1rem",
                        }}
                    />{" "}
                    button to display all comments
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Click &#9634; to Stop Commenting!
                </li>
                <li className="AnnotateJs_Component HelpPageMainDivUListLI">
                    Click on the Logout button to logout
                </li>
            </ul>
        </div>,
        document.getElementById("AnnotateJs_HelpDiv")
    );
};

export default HelpPage;
