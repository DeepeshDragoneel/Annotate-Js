import express from "express";
const router = express.Router();
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
import Domain = require("../models/domains");
import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";
import { connection } from "../database/db";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
import { SMTPClient } from "emailjs";
import * as dataBaseQueries from "../database/dataQueries";

type DomainResultType = { domainId: number; domainName: string };
type UserResultType = {
    userId: number;
    userName: string;
    email: string;
    password: string;
    newAccount: number;
};

type DomainToUsersType = {
    domainId: number;
    email: string;
    isAdmin: number;
};

const NAMESPACE = "usersRoute";

router.post(
    "/addUsers",
    async (req: express.Request, res: express.Response) => {
        try {
            const allowedUsers = req.body.allowedUsers;
            const adminUsers = req.body.adminUsers;
            const domainName = req.body.domain;
            console.log(allowedUsers);
            if (
                allowedUsers === undefined ||
                adminUsers === undefined ||
                domainName === undefined
            ) {
                throw new Error("Missing parameters");
            }
            //creating or fetching domain Id
            let domainId: number;
            let results = await dataBaseQueries.findDomain(domainName);
            logging.info(NAMESPACE, "All Domains: ", results);
            if (
                results === null ||
                results === undefined ||
                results.length === 0
            ) {
                logging.info(NAMESPACE, "Adding Domain");
                results = await dataBaseQueries.addNewDomain(domainName);
            }
            domainId = results![0].domainId;
            console.log("Domain Id: ", domainId);
            //Removing all users from domain
            await dataBaseQueries.deleteDomainUsers(domainId);

            //Creating or fetching users
            for (let i = 0; i < allowedUsers.length; i++) {
                // console.log(allowedUsers[i]);
                await dataBaseQueries.addAllowedUsers(
                    domainId,
                    allowedUsers[i]
                );
            }

            //Creating or fetching admin users
            console.log(adminUsers);
            for (let i = 0; i < adminUsers.length; i++) {
                dataBaseQueries.addAdminUsers(domainId, adminUsers[i]);
            }
            res.json({
                message: "Successfully added users to domain",
            });
            return;
        } catch (err) {
            // logging.error(NAMESPACE, err as string);
            res.json({
                message: "Error adding users to domain",
            });
            // console.log(err);
            return;
        }
    }
);

router.post(
    "/userLogin",
    async (req: express.Request, res: express.Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const domain = req.body.domain;
        // //logging.info("USER LOGIN", "User login");
        try {
            let results = await dataBaseQueries.findUser(email);
            //logging.info("USER LOGIN", "User: ", results);
            if (results === undefined || results!.length === 0) {
                //logging.info("USER LOGIN", "User not found");
                res.status(200).json({
                    success: false,
                    message: "User not found",
                });
            } else {
                if (results[0].password === password) {
                    // //logging.info("USER LOGIN", "User found");
                    const token = jwt.sign(
                        {
                            userId: results[0].userId,
                            userName: results[0].userName,
                            email: results[0].email,
                        },
                        process.env.JWT_SECRET_KEY
                    );

                    const newResults = await dataBaseQueries.findUserToDomain(
                        domain,
                        email
                    );
                    let temp = 0;
                    // console.log("newResults: ", newResults);
                    if (newResults === undefined || newResults.length === 0) {
                        res.status(200).json({
                            success: true,
                            message: "User found",
                            access: false,
                        });
                        return;
                    }
                    if (newResults.length !== 0 && newResults !== undefined) {
                        temp = newResults[0].isAdmin;
                    }
                    // console.log(temp);
                    res.status(200).json({
                        success: true,
                        message: "User found",
                        token: token,
                        userName: results[0].userName,
                        userId: results[0].userId,
                        email: results[0].email,
                        isAdmin: temp,
                        access: true,
                    });
                } else {
                    // //logging.info("USER LOGIN", "Wrong password");
                    res.status(200).json({
                        success: false,
                        message: "Wrong password",
                    });
                }
            }
        } catch (err) {
            logging.error("USER LOGIN", err as string);
            res.status(200).json({
                success: false,
                message: "Error Logging user",
            });
        }
    }
);

router.post(
    "/checkUser",
    async (req: express.Request, res: express.Response) => {
        const token = req.body.AnnotateJsUserToken;
        const domain = req.body.domain;
        // //logging.info("CHECK USER", "Checking user");
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // //logging.info("CHECK USER", "User found");
            const results = await dataBaseQueries.findUserToDomain(
                domain,
                decoded.email
            );
            if ((results === undefined || results.length) === 0) {
                res.status(200).json({
                    success: true,
                    message: "User Not Found",
                    access: false,
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "User found",
                userName: decoded.userName,
                access: true,
            });
        } catch (err) {
            //logging.error("CHECK USER", err as string);
            res.status(200).json({
                success: false,
                message: "User Not Found",
                access: false,
            });
        }
    }
);

router.post(
    "/userRegister",
    async (req: express.Request, res: express.Response) => {
        // //logging.info("USER REGISTER", "User register");
        try {
            const userName = req.body.userName;
            const email = req.body.email;
            const password = req.body.password;
            if (
                userName === undefined ||
                email === undefined ||
                password === undefined
            ) {
                throw new Error("Missing parameters");
            }
            const results = await dataBaseQueries.findUser(email);
            if (results === undefined || results.length === 0) {
                const token = jwt.sign(
                    {
                        userName: userName,
                        email: email,
                        password: password,
                    },
                    process.env.JWT_SECRET_KEY
                );
                let transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.GMAIL,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                });
                let info = await transporter.sendMail({
                    from: "annotatejs@gmail.com",
                    to: email,
                    subject: "AnnotateJS Registration",
                    text: "Dont share this link to anyone!",
                    html: `<h2>Please click on the below link to verfiy your Account</h2><br/><a href=${process.env.BACKEND_URL}/verifyUser?token=${token}>Verify Account</a>`,
                });
                res.status(200).json({
                    success: true,
                    message: "Email sent to the user",
                });
            } else {
                // logging.info("USER REGISTER", "User already exists");
                res.status(200).json({
                    success: false,
                    message: "User already exists",
                });
            }
        } catch (err) {
            //logging.error("USER REGISTER", err as string);
            res.status(200).json({
                success: false,
                message: err,
            });
        }
    }
);

router.get(
    "/verifyUser",
    async (req: express.Request, res: express.Response) => {
        const token = req.query.token!;
        //logging.info("VERIFY USER", "Verifying user");
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            //logging.info("VERIFY USER", "Adding user");
            await dataBaseQueries.addUser(
                decoded.userName,
                decoded.email,
                decoded.password
            );
            //logging.info("VERIFY USER", "User added");
            res.set("Content-Type", "text/html");
            res.status(200).send(
                Buffer.from(
                    "<h1>User added</h1><br/><h3>You can now Login with your credentials!</h3>"
                )
            );
        } catch (err) {
            //logging.error("VERIFY USER", err as string);
            res.set("Content-Type", "text/html");
            res.status(504).send(Buffer.from("<h1>Error Adding User</h1>"));
        }
    }
);

router.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

exports.routes = router;
