import React from "react";
import { createRoot } from "react-dom/client";
import { CommentBox } from "../CommentBox";

test("CommentBox renders wihtout crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<CommentBox />);
    root.unmount();
});
