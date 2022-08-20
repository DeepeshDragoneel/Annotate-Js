import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { HelpPage } from "../HelpPage";

it("Menu Renders without Crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<HelpPage />);
    root.unmount();
});
