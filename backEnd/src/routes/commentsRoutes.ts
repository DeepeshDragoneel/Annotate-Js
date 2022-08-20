import express from "express";
const router = express.Router();
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");
import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";
import { connection } from "../database/db";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
import { SMTPClient } from "emailjs";
import console from "console";
import * as dataBaseQueries from "../database/dataQueries";

type UserResultType = {
    userId: number;
    userName: string;
    email: string;
    password: string;
};
type DomainToUsersType = {
    domainId: number;
    email: string;
    isAdmin: number;
};
type DomainResultType = {
    domainId: number;
    domainName: string;
};

type PageOfDomainType = {
    id: number;
    domainId: number;
    pageName: string;
};

type CommentType = {
    commentsId: number;
    pageOfDomainId: number;
    userId: number;
    message: string;
    elementIdentifier: string;
};

type QueryType = {
    pageNumber: number;
    pageOfDomain: string;
    domain: string;
    username: string;
    idx: number;
};

router.post(
    "/postComment",
    async (req: express.Request, res: express.Response) => {
        // console.log("postComment");
        try {
            const {
                comment,
                itemBeingCommented,
                pageOfDomain,
                userToken,
                domain,
            } = req.body;
            const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
            const userId = decoded.userId;

            const userResults = await dataBaseQueries.getUserById(userId);
            if (userResults === undefined || userResults.length === 0) {
                res.json({
                    success: false,
                    message: "User not found",
                });
                return;
            } else {
                const domainResult = await dataBaseQueries.findDomain(domain);
                if (
                    domainResult === null ||
                    domainResult === undefined ||
                    domainResult.length === 0
                ) {
                    res.json({
                        success: false,
                        message: "Domain not found",
                    });
                    return;
                }
                let pageResult = await dataBaseQueries.getPageOfDomain(
                    pageOfDomain
                );
                if (
                    pageResult === null ||
                    pageResult === undefined ||
                    pageResult.length === 0
                ) {
                    pageResult = await dataBaseQueries.insertIntoPagesOfDomain(
                        pageOfDomain,
                        domainResult![0].domainId
                    );
                }
                // console.log(pageResult);
                const commentResult = await dataBaseQueries.insertComment(
                    pageResult![0].pageName,
                    pageResult![0].id,
                    userId,
                    comment,
                    itemBeingCommented
                );
                res.json({
                    success: true,
                    message: "Comment Posted",
                });
                return;
            }
        } catch (err) {
            // logging.error("Comments", err as string);
            console.log(err);
            res.status(504).json({
                success: false,
                message: "Error posting comment",
            });
            return;
        }
    }
);

router.get(
    "/getComments",
    async (req: express.Request, res: express.Response) => {
        try {
            // console.log("asdasd", req.query.pageOfDomain);
            // const { pageOfDomain, domain } = req.body;
            let temp = req.query as unknown as QueryType;
            // console.log(temp);
            // const query = `SELECT * FROM comments WHERE pageOfDomainId = (SELECT id FROM pagesOfDomain WHERE pageName = '${temp.pageOfDomain}' AND domainId = (SELECT domainId FROM registeredDomains WHERE domainName = '${temp.domain}')`;
            let filter = "";
            if (temp.idx == 0) {
                filter = ` AND resolved = 0`;
            } else if (temp.idx == 1) {
                filter = ` AND userName = "${temp.username}" AND resolved = 0`;
                // console.log(filter);
            } else if (temp.idx == 2) {
                filter = ` AND resolved = 1`;
                // console.log(filter);
            }
            const commentResults =
                await dataBaseQueries.getCommentsByPageNumber(
                    temp.pageOfDomain,
                    filter,
                    temp.pageNumber
                );
            const commentCount = await dataBaseQueries.countOfLeftComments(
                temp.pageOfDomain
            );
            // console.log(commentResults);
            res.json({
                success: true,
                message: "Comments retrieved",
                comments: commentResults,
                hasMore: commentCount! > temp.pageNumber * 10 + 10,
            });
            return;
        } catch (err) {
            // logging.error("Comments", err as string);
            console.log(err);
            res.status(500).send(err);
            return;
        }
    }
);

router.post(
    "/resolveComment",
    async (req: express.Request, res: express.Response) => {
        try {
            const { commentId, token, domain } = req.body;
            console.log(req.body);
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded.userId;
            const userResults = await dataBaseQueries.getUserById(userId);
            if (userResults === undefined || userResults.length === 0) {
                res.json({
                    success: false,
                    message: "User not found",
                });
                return;
            } else {
                const newResults = await dataBaseQueries.findUserToDomain(
                    domain,
                    userResults[0].email
                );
                if (
                    newResults === undefined ||
                    newResults.length === 0 ||
                    newResults[0].isAdmin === 0
                ) {
                    res.json({
                        success: false,
                        message: "User not authorized",
                    });
                    return;
                }
                const commentResults = await dataBaseQueries.getCommentById(
                    commentId
                );
                if (
                    commentResults === undefined ||
                    commentResults.length === 0
                ) {
                    res.json({
                        success: false,
                        message: "Comment not found",
                    });
                    return;
                } else {
                    await dataBaseQueries.resolveComment(commentId);
                    res.json({
                        success: true,
                        message: "Comment resolved",
                    });
                    return;
                }
            }
        } catch (err) {
            // logging.error("Comments", err as string);
            console.log(err);
            res.status(500).send(err);
            return;
        }
    }
);

exports.routes = router;
