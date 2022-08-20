import { useEffect, useState, useContext } from "react";
import axios, { Canceler } from "axios";
import { serverUrl } from "../contants";
import { StoreContext } from "../utils/store";

export const LazyLoaderHook = (pagenumber, idx) => {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    // const [comments, setcomments] = useState([]);
    const { comments, setcomments } = useContext(StoreContext);

    const [hasMore, sethasMore] = useState();

    useEffect(() => {
        // console.log("pagenumber: ", pagenumber);
        let cancel;
        setloading(true);
        seterror(false);
        axios({
            method: "GET",
            url: `${serverUrl}getComments`,
            params: {
                pageNumber: pagenumber,
                pageOfDomain: window.location.href,
                domain: window.location.hostname,
                username: localStorage.getItem("AnnotateJsUserName"),
                idx: idx,
            },
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
            .then((res) => {
                console.log("Hook: ", res.data);
                setcomments((comments) => {
                    // console.log(comments, res.data.comments);
                    return comments.concat(res.data.comments);
                });
                sethasMore(res.data.hasMore);
                setloading(false);
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    return;
                }
                console.log(error);
            });
        return () => cancel();
    }, [pagenumber, idx]);

    // useEffect(() => {
    //     console.log("comments: ", comments);
    // }, [comments]);

    useEffect(() => {
        setcomments([]);
    }, [idx]);

    return { loading, error, hasMore, comments };
};
