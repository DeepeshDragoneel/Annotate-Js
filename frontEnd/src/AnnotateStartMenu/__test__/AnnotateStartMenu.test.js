import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { AnnotateStartMenu } from "../AnnotateStartMenu";

it("Menu Renders without Crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<AnnotateStartMenu />);
    root.unmount();
});
