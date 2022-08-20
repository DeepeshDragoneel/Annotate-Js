import React, { useState, useContext } from "react";
import ReactDom from "react-dom";
import Avatar from "@mui/material/Avatar";
import "./CommentBox.scss";
import {
    closeAnnotateJsCommentBox,
    postComment,
} from "../main";
import { StoreContext } from "../utils/store";

export const CommentBox = () => {
    const [Comment, setComment] = useState("");
    const [Comments, setComments] = useState([]);
    const { comments, setcomments } = useContext(StoreContext);
    return ReactDom.createPortal(
        <div className="AnnotateJs_Component CommentBoxMainDiv">
            <div className="AnnotateJs_Component CommentBoxUserDetailsDiv">
                {/* <img
                    src={`https://avatars.dicebear.com/api/human/${localStorage.getItem(
                        "AnnotateJsUserName"
                    )}.svg`}
                /> */}
                <Avatar
                    alt="Remy Sharp"
                    src={`https://avatars.dicebear.com/api/human/${localStorage.getItem(
                        "AnnotateJsUserName"
                    )}.svg`}
                />
                <div className="AnnotateJs_Component CommentBoxUserDetailsDiv">
                    <p className="AnnotateJs_Component CommentBoxUserDetailsP">
                        {localStorage.getItem("AnnotateJsUserName")}
                    </p>
                </div>
            </div>
            {/* <hr
                className="AnnotateJs_Component"
                style={{ border: "1px solid black", margin: "2px" }}
            /> */}
            <textarea
                className="AnnotateJs_Component commentBoxTextarea"
                rows="3"
                value={Comment}
                onChange={(e) => {
                    setComment(e.target.value);
                }}
                placeholder="Enter your comment here..."
            ></textarea>
            <div className="AnnotateJs_Component commentBoxButtonDiv">
                <button
                    className="AnnotateJs_Component commentBoxSubmitButton"
                    onClick={async () => {
                        // console.log("Comment: ", Comment);
                        const itemBeingCommented = await postComment(Comment);
                        setcomments((comments) => {
                            return [
                                {
                                    userName:
                                        localStorage.getItem(
                                            "AnnotateJsUserName"
                                        ),
                                    message: Comment,
                                    created_at: new Date(),
                                    elementIdentifier: itemBeingCommented,
                                },
                                ...comments,
                            ];
                        });
                        setComment("");
                        closeAnnotateJsCommentBox();
                    }}
                >
                    Comment
                </button>
                <button
                    className="AnnotateJs_Component commentBoxCancelButton"
                    onClick={() => {
                        setComment("");
                        // console.log("Comment: ", Comment);
                        closeAnnotateJsCommentBox();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>,
        document.getElementById("AnnotateJs_CommentBoxDiv")
    );
};
