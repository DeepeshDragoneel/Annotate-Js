import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./UserLogin.scss";
import { StoreContext } from "../utils/store";

export const UserLogin = () => {
    // const [whereToRenderLoginPage, setwhereToRenderLoginPage] = useState(
    //     document.getElementById("AnnotateJs_UserLoginPage")
    // );
    // useEffect(() => {
    //     console.log(document.getElementById("AnnotateJs_UserLoginPage"));
    // }, [document.getElementById("AnnotateJs_UserLoginPage")]);
    const [login, setLogin] = useState(true);
    const [email, setemail] = useState("");
    const { loginCard, setloginCard } = useContext(StoreContext);
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [checkPassWord, setCheckPassWord] = useState("");
    const [msg, setMsg] = useState({
        msg: "",
        color: "",
    });
    const [showMsg, setshowMsg] = useState(false);
    const submitLoginDetails = async () => {
        setshowMsg(false);
        if (login) {
            console.log("Login");
            const result = await axios({
                method: "post",
                url: "https://annotate-js-backend.herokuapp.com/userLogin",
                data: {
                    email: email,
                    password: password,
                    domain: window.location.hostname,
                },
            });
            if (!result.data.success) {
                setMsg({
                    msg: result.data.message,
                    color: "red",
                });
                setshowMsg(true);
            } else if (result.success === 500) {
                setMsg({
                    msg: "Internal Server Error",
                    color: "red",
                });
                setshowMsg(true);
            } else {
                if (!result.data.access) {
                    setloginCard(false);
                    return;
                } else {
                    console.log(result.data.isAdmin);
                    setshowMsg(false);
                    localStorage.setItem(
                        "AnnotateJsUserToken",
                        result.data.token
                    );
                    localStorage.setItem(
                        "AnnotateJsUserName",
                        result.data.userName
                    );
                    localStorage.setItem(
                        "AnnotateJsUserEmail",
                        result.data.email
                    );
                    localStorage.setItem(
                        "AnnotateJsUserId",
                        result.data.userId
                    );
                    localStorage.setItem(
                        "AnnotateJsUserRole",
                        result.data.isAdmin
                    );
                    window.location.reload();
                }
            }
        } else {
            if (password != checkPassWord) {
                setMsg({
                    msg: "Passwords do not match",
                    color: "red",
                });
                setshowMsg(true);
                return;
            } else if (password <= 5) {
                setMsg({
                    msg: "Password must be atleast 6 characters",
                    color: "red",
                });
                setshowMsg(true);
                return;
            } else {
                const result = await axios({
                    method: "post",
                    url: "https://annotate-js-backend.herokuapp.com/userRegister",
                    data: {
                        userName: username,
                        email: email,
                        password: password,
                    },
                });
                console.log(result.data);
                if (!result.data.success) {
                    setMsg({
                        msg: result.data.message,
                        color: "red",
                    });
                    setshowMsg(true);
                } else if (result.success === 500) {
                    setMsg({
                        msg: "Internal Server Error",
                        color: "red",
                    });
                    setshowMsg(true);
                } else {
                    setMsg({
                        msg: "Verification Mail has been sent to your Gmail!",
                        color: "green",
                    });
                    setshowMsg(true);
                }
            }
        }
    };

    return ReactDOM.createPortal(
        <div
            className="UserLoginMainDiv AnnotateJs_Component wrapper"
            style={{
                width: `${loginCard ? "40vw" : "70vw"}`,
            }}
        >
            {loginCard ? (
                <div className="UserLoginContent AnnotateJs_Component">
                    <header>
                        <h1 style={{ fontWeight: "normal", fontSize: "2rem" }}>
                            Welcome {login ? "Back" : ""} to
                        </h1>
                        <h1 style={{ fontWeight: "700" }}>AnnotateJs</h1>
                    </header>
                    <section>
                        {/* <div className="social-login">
                        <button>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                alt="google"
                                width="20"
                            />
                            <span>Google</span>
                        </button>
                        <button>
                            <img
                                src="https://cdn.freebiesupply.com/logos/large/2x/facebook-2-logo-svg-vector.svg"
                                alt="facebook"
                                width="10"
                            />
                            <span>Facebook</span>
                        </button>
                    </div> */}
                        <form action="" className="login-form">
                            {!login ? (
                                <>
                                    <div className="input-group">
                                        <label htmlFor="username">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            id="username"
                                            value={username}
                                            onChange={(e) =>
                                                setusername(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="username">Email</label>
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            id="email"
                                            value={email}
                                            onChange={(e) =>
                                                setemail(e.target.value)
                                            }
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="input-group">
                                    <label htmlFor="username">
                                        Username or Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Username or Email"
                                        id="username"
                                        value={email}
                                        onChange={(e) =>
                                            setemail(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <label htmlFor="password">password</label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setpassword(e.target.value)
                                    }
                                />
                            </div>
                            {login ? null : (
                                <div className="input-group">
                                    <label htmlFor="password">
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        id="password"
                                        value={checkPassWord}
                                        onChange={(e) =>
                                            setCheckPassWord(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                            <div
                                className="LoginPageMsg"
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                {showMsg ? (
                                    <p
                                        style={{
                                            color: msg.color,
                                        }}
                                    >
                                        {msg.msg}
                                    </p>
                                ) : null}
                            </div>
                            <div className="input-group">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        submitLoginDetails();
                                    }}
                                >
                                    {login ? "Login" : "Signin"}
                                </button>
                            </div>
                        </form>
                    </section>
                    <footer>
                        <p className="UserLoginContentFooter">
                            {login
                                ? "Don't have an account?"
                                : "Have an account?"}
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#20BDFF",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setLogin((prev) => !prev);
                                }}
                            >
                                {login ? " Register" : " Login"}
                            </span>
                        </p>
                    </footer>
                </div>
            ) : (
                <div
                    className="UserLoginContent AnnotateJs_Component"
                    style={{
                        padding: "2rem 5rem",
                    }}
                >
                    <header>
                        <h1 style={{ fontWeight: "normal", fontSize: "2rem" }}>
                            You don't have access to Annotate on this Page
                        </h1>
                        <p style={{ fontWeight: "bold", fontSize: "2rem"}}>¯\_(ツ)_/¯</p>
                        <p>
                            You can Login from another account{" "}
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    color: "#20BDFF",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    localStorage.removeItem(
                                        "AnnotateJsUserToken"
                                    );
                                    setloginCard(true);
                                }}
                            >
                                here
                            </span>
                        </p>
                    </header>
                </div>
            )}
        </div>,
        document.getElementById("AnnotateJs_UserLoginPage")
    );
};
