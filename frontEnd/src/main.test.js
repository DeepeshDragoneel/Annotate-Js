import {
    checkUserLogin,
    startRenderingReact,
    initializeAnnotateJs,
    createSideBarForComments,
    closeAnnotateJsCommentBox,
    stopAnnotation,
    displayHelpDiv,
    closeAnnotateJsHelpDiv,
    toogleCommentSideBar,
    loggedIn,
} from "./main.js";
import "@testing-library/jest-native/extend-expect";
import { toHaveStyle } from "@testing-library/jest-native/dist/to-have-style";
import { App } from "./App.js";
import { createRoot } from "react-dom/client";
import { describe, test, expect } from "@jest/globals";
expect.extend({ toHaveStyle });
import axios from "axios";

describe("Checking the user login", () => {
    beforeEach(() => {});
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("User has access", async () => {
        jest.spyOn(Storage.prototype, "getItem");
        Storage.prototype.getItem = jest.fn(() => {
            return 123;
        });
        jest.spyOn(axios, "post").mockImplementation(async () => {
            return {
                data: {
                    token: "token",
                    access: true,
                    success: true,
                },
            };
        });
        await checkUserLogin();
        const backDropLoginDiv = document.getElementById(
            "AnnotateJs_BackLoginDiv"
        );
        expect(backDropLoginDiv).toBeTruthy();
        expect(backDropLoginDiv.style.alignItems).toBe("center");
        expect(backDropLoginDiv.style.justifyContent).toBe("center");
        expect(backDropLoginDiv.style.zIndex).toBe("99999991");
        expect(backDropLoginDiv.style.height).toBe("100vh");
        expect(backDropLoginDiv.style.width).toBe("100vw");
        expect(backDropLoginDiv.style.position).toBe("fixed");
        expect(backDropLoginDiv.style.top).toBe("0px");
        expect(backDropLoginDiv.style.left).toBe("0px");
        expect(backDropLoginDiv.style.backgroundColor).toBe(
            "rgba(0, 0, 0, 0.7)"
        );
        expect(backDropLoginDiv.style.display).toBe("none");
        expect(loggedIn).toBe(true);
    });
    test("User has no access", async () => {
        jest.spyOn(Storage.prototype, "getItem");
        Storage.prototype.getItem = jest.fn(() => {
            return 123;
        });
        jest.spyOn(axios, "post").mockImplementation(async () => {
            return {
                data: {
                    token: "token",
                    access: false,
                    success: true,
                },
            };
        });
        await checkUserLogin();
        const backDropLoginDiv = document.getElementById(
            "AnnotateJs_BackLoginDiv"
        );
        expect(backDropLoginDiv).toBeTruthy();
        expect(backDropLoginDiv.style.alignItems).toBe("center");
        expect(backDropLoginDiv.style.justifyContent).toBe("center");
        expect(backDropLoginDiv.style.zIndex).toBe("99999991");
        expect(backDropLoginDiv.style.height).toBe("100vh");
        expect(backDropLoginDiv.style.width).toBe("100vw");
        expect(backDropLoginDiv.style.position).toBe("fixed");
        expect(backDropLoginDiv.style.top).toBe("0px");
        expect(backDropLoginDiv.style.left).toBe("0px");
        expect(backDropLoginDiv.style.backgroundColor).toBe(
            "rgba(0, 0, 0, 0.7)"
        );
        // expect(backDropLoginDiv.style.display).toBe("flex");
        expect(loggedIn).toBe(true);
    });
    test("User is not logged in", async () => {
        jest.spyOn(Storage.prototype, "getItem");
        jest.spyOn(Storage.prototype, "removeItem");
        Storage.prototype.getItem = jest.fn(() => {
            return 123;
        });
        jest.spyOn(axios, "post").mockImplementation(async () => {
            return {
                data: {
                    token: "token",
                    access: false,
                    success: false,
                },
            };
        });
        await checkUserLogin();
        const backDropLoginDiv = document.getElementById(
            "AnnotateJs_BackLoginDiv"
        );
        expect(backDropLoginDiv).toBeTruthy();
        expect(backDropLoginDiv.style.alignItems).toBe("center");
        expect(backDropLoginDiv.style.justifyContent).toBe("center");
        expect(backDropLoginDiv.style.zIndex).toBe("99999991");
        expect(backDropLoginDiv.style.height).toBe("100vh");
        expect(backDropLoginDiv.style.width).toBe("100vw");
        expect(backDropLoginDiv.style.position).toBe("fixed");
        expect(backDropLoginDiv.style.top).toBe("0px");
        expect(backDropLoginDiv.style.left).toBe("0px");
        expect(backDropLoginDiv.style.backgroundColor).toBe(
            "rgba(0, 0, 0, 0.7)"
        );
        expect(loggedIn).toBe(false);
        expect(Storage.prototype.removeItem).toHaveBeenCalledTimes(1);
    });
});

test("Side bar for Comments is created", () => {
    createSideBarForComments();
    const sideBar = document.getElementById("AnnotateJs_CommentsSideBarDiv");
    expect(sideBar).toBeTruthy();
    expect(sideBar.classList.contains("AnnotateJs_Component")).toBe(true);
    expect(sideBar.style.position).toBe("fixed");
    expect(sideBar.style.top).toBe("0px");
    expect(sideBar.style.right).toBe("-100%");
    expect(sideBar.style.overflowY).toBe("scroll");
    expect(sideBar.style.zIndex).toBe("99999995");
    expect(sideBar.style.transition).toBe("1s ease-in-out");
    expect(sideBar.style.boxShadow).toBe("0px 0px 10px #000000");
    const sideBarBackDrop = document.getElementById(
        "AnnotateJs_CommentsSideBarBackDrop"
    );
    expect(sideBarBackDrop).toBeTruthy();
    expect(sideBarBackDrop.classList.contains("AnnotateJs_Component")).toBe(
        true
    );
    expect(sideBarBackDrop.onclick).toBeDefined();
});

test("React has started Rendering", () => {
    startRenderingReact();
    const helpDiv = document.getElementById("AnnotateJs_HelpDiv");
    expect(helpDiv).toBeTruthy();
    expect(helpDiv.style.display).toBe("none");
    expect(helpDiv.style.position).toBe("fixed");
    expect(helpDiv.style.top).toBe("0px");
    expect(helpDiv.style.left).toBe("0px");
    expect(helpDiv.style.width).toBe("100vw");
    expect(helpDiv.style.height).toBe("100vh");
    expect(helpDiv.style.backgroundColor).toBe("rgba(0, 0, 0, 0.3)");
    expect(helpDiv.style.zIndex).toBe("99999991");
    const commentBoxDiv = document.getElementById("AnnotateJs_CommentBoxDiv");
    expect(commentBoxDiv).toBeTruthy();
    expect(commentBoxDiv.style.position).toBe("absolute");
    expect(commentBoxDiv.style.display).toBe("none");
    expect(commentBoxDiv.style.zIndex).toBe("99999992");
    expect(commentBoxDiv.style.backgroundColor).toBe("white");

    const annotatorMenuDiv = document.getElementById(
        "AnnotateJs_StartAnnotatorButtonDiv"
    );
    expect(annotatorMenuDiv).toBeTruthy();
    expect(annotatorMenuDiv.style.position).toBe("fixed");
    expect(annotatorMenuDiv.style.bottom).toBe("0px");
    expect(annotatorMenuDiv.style.right).toBe("50%");
    expect(annotatorMenuDiv.style.transform).toBe("translate(50%)");
    expect(annotatorMenuDiv.style.zIndex).toBe("99999990");
});

test("Close AnnotateJs Comment Box", () => {
    closeAnnotateJsCommentBox();
    const commentBoxDiv = document.getElementById("AnnotateJs_CommentBoxDiv");
    expect(commentBoxDiv).toBeTruthy();
    expect(commentBoxDiv.style.display).toBe("none");
});
test("Display Help Div", () => {
    displayHelpDiv();
    const helpDiv = document.getElementById("AnnotateJs_HelpDiv");
    expect(helpDiv).toBeTruthy();
    expect(helpDiv.style.display).toBe("flex");
    expect(helpDiv.style.justifyContent).toBe("center");
    expect(helpDiv.style.alignItems).toBe("center");
});

test("Close AnnotateJs Help Div", () => {
    closeAnnotateJsHelpDiv();
    const helpDiv = document.getElementById("AnnotateJs_HelpDiv");
    expect(helpDiv).toBeTruthy();
    expect(helpDiv.style.display).toBe("none");
});

test("Stop Annotation", () => {
    stopAnnotation();
    expect(document.body.style.userSelect).toBe("auto");
    expect(document.onclick).toEqual(null);
});

test("App Renders without Crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<App />);
    root.unmount();
});

test("Toggling of comments bar", () => {
    toogleCommentSideBar();
    const annotateJsCommentBoxDiv = document.getElementById(
        "AnnotateJs_CommentsSideBarDiv"
    );
    const annotateJsCommentsSideBarBackDropDiv = document.getElementById(
        "AnnotateJs_CommentsSideBarBackDrop"
    );
    expect(annotateJsCommentBoxDiv).toBeTruthy();
    expect(
        annotateJsCommentBoxDiv.classList.contains("showSideBoxAnnotateJs")
    ).toBeFalsy();
    expect(annotateJsCommentsSideBarBackDropDiv).toBeTruthy();
    expect(annotateJsCommentsSideBarBackDropDiv.style.display).toBe("block");
    toogleCommentSideBar();
    expect(
        annotateJsCommentBoxDiv.classList.contains("showSideBoxAnnotateJs")
    ).toBeTruthy();
    expect(annotateJsCommentsSideBarBackDropDiv.style.display).toBe("none");
});
