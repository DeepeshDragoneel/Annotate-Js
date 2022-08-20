import { describe, test, expect } from "@jest/globals";
import { app } from "../src/app";
import request from "supertest";
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
import * as dataBaseQueries from "../src/database/dataQueries";
import {
    DomainResultType,
    DomainToUsersType,
    UserResultType,
    PageOfDomainType,
    CommentType,
    QueryType,
} from "../src/types";

const commentReq = {
    comment: "This is a test comment",
    itemBeingCommented: "This is a test item",
    pageOfDomain: "This is a test page",
    userToken: "This is a test token",
    domain: "This is a test domain",
};
const userResult = [
    {
        userId: 1,
        userName: "deepesh",
        email: "deepesh@gmail.com",
        password: "deepesh",
        newAccount: 0,
    },
] as UserResultType[];
const domainResult = [
    {
        domainId: 1,
        domainName: "www.deepesh.com",
    },
] as DomainResultType[];
const pageOfDomainResult = [
    {
        id: 1,
        domainId: 1,
        pageName: "home",
    },
] as PageOfDomainType[];
const domainToUsersResult = [
    {
        domainId: 1,
        email: "deepesh@gmail.com",
        isAdmin: 1,
    },
] as DomainToUsersType[];

describe("Testing Post Comment", () => {
    beforeEach(async () => {
        jest.spyOn(jwt, "verify").mockImplementation(() => {
            return {
                userId: 1,
                username: "test",
                email: "deepesh@gmail.com",
            };
        }),
            jest
                .spyOn(dataBaseQueries, "getUserById")
                .mockImplementation(async () => {
                    return userResult;
                });
        jest.spyOn(dataBaseQueries, "findDomain").mockImplementation(
            async () => {
                return domainResult;
            }
        );
        jest.spyOn(dataBaseQueries, "getPageOfDomain").mockImplementation(
            async () => {
                return pageOfDomainResult;
            }
        );
        jest.spyOn(dataBaseQueries, "insertComment").mockImplementation(
            async () => {
                return;
            }
        );
        jest.spyOn(
            dataBaseQueries,
            "insertIntoPagesOfDomain"
        ).mockImplementation(async () => {
            return pageOfDomainResult;
        });
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
    test("should return a Comment Postested message", async () => {
        const result = await request(app).post("/postComment").send(commentReq);
        expect(result.body).toEqual({
            success: true,
            message: "Comment Posted",
        });
    });
    test("Should return jwt error", async () => {
        jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("jwt error");
        });
        const result = await request(app).post("/postComment").send(commentReq);
        expect(result.body).toEqual({
            success: false,
            message: "Error posting comment",
        });
    });
    test("Should return user not found error", async () => {
        jest.spyOn(dataBaseQueries, "getUserById").mockImplementation(
            async () => {
                return [];
            }
        );
        const result = await request(app).post("/postComment").send(commentReq);
        expect(result.body).toEqual({
            success: false,
            message: "User not found",
        });
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
    });
    test("Should return domain not found error", async () => {
        jest.spyOn(dataBaseQueries, "findDomain").mockImplementation(
            async () => {
                return [];
            }
        );
        const result = await request(app).post("/postComment").send(commentReq);
        expect(result.body).toEqual({
            success: false,
            message: "Domain not found",
        });
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findDomain).toHaveBeenCalledTimes(1);
    });
    test("Should create new Page when page not found", async () => {
        jest.spyOn(dataBaseQueries, "getPageOfDomain").mockImplementation(
            async () => {
                return [];
            }
        );
        const result = await request(app).post("/postComment").send(commentReq);
        expect(result.body).toEqual({
            success: true,
            message: "Comment Posted",
        });
        expect(dataBaseQueries.getPageOfDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.insertIntoPagesOfDomain).toHaveBeenCalledTimes(
            1
        );
    });
});

describe("Testing Get Comments", () => {
    let comments = [
        {
            commentsId: 1,
            message: "This is a test comment",
            elementIdentifier: "This is a test item",
            pageOfDomainId: 1,
            userId: 1,
        },
    ] as CommentType[];
    beforeEach(async () => {
        jest.spyOn(
            dataBaseQueries,
            "getCommentsByPageNumber"
        ).mockImplementation(async () => {
            return comments;
        });
        jest.spyOn(dataBaseQueries, "countOfLeftComments").mockImplementation(
            async () => {
                return 1;
            }
        );
    });
    afterEach(async () => {
        jest.resetAllMocks();
    });
    test("Should return all comments", async () => {
        let query = {
            pageOfDomain: "home",
            pageNumber: 1,
            idx: 0,
        };
        const result = await request(app).get("/getComments").query(query);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Comments retrieved");
        expect(result.body.comments).toEqual(comments);
        expect(result.body.hasMore).toBe(false);
        expect(dataBaseQueries.countOfLeftComments).toHaveBeenCalledTimes(1);
    });
    test("Should return Has More Pages", async () => {
        let query = {
            pageOfDomain: "home",
            pageNumber: 1,
            idx: 0,
        };
        jest.spyOn(dataBaseQueries, "countOfLeftComments").mockImplementation(
            async () => {
                return 30;
            }
        );
        const result = await request(app).get("/getComments").query(query);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Comments retrieved");
        expect(result.body.comments).toEqual(comments);
        expect(result.body.hasMore).toBe(true);
        expect(dataBaseQueries.getCommentsByPageNumber).toHaveBeenCalledTimes(
            1
        );
        expect(dataBaseQueries.countOfLeftComments).toHaveBeenCalledTimes(1);
    });
});

describe("Testing the process of Comments resolving", () => {
    const userResult = [
        {
            userId: 1,
            userName: "deepesh",
            email: "deepesh@gmail.com",
            password: "deepesh",
            newAccount: 0,
        },
    ] as UserResultType[];
    const domainToUsersResult = [
        {
            domainId: 1,
            email: "deepesh@gmail.com",
            isAdmin: 1,
        },
    ] as DomainToUsersType[];
    let comments = [
        {
            commentsId: 1,
            message: "This is a test comment",
            elementIdentifier: "This is a test item",
            pageOfDomainId: 1,
            userId: 1,
        },
    ] as CommentType[];
    beforeEach(() => {
        jest.spyOn(dataBaseQueries, "getUserById").mockImplementation(
            async () => {
                return userResult;
            }
        );
        jest.spyOn(dataBaseQueries, "findUserToDomain").mockImplementation(
            async () => {
                return domainToUsersResult;
            }
        );
        jest.spyOn(dataBaseQueries, "getCommentById").mockImplementation(
            async () => {
                return comments;
            }
        );
        jest.spyOn(jwt, "verify").mockImplementation(() => {
            return {
                userId: 1,
            };
        });
        jest.spyOn(dataBaseQueries, "resolveComment").mockImplementation(
            async () => {
                return;
            }
        );
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    test("Should return message Comment resolved", async () => {
        const query = {
            commentId: 1,
            token: "123",
            domain: "www.deepesh.com",
        };
        const result = await request(app).post("/resolveComment").query(query);
        expect(result.body.success).toBe(true);
        expect(result.body.message).toBe("Comment resolved");
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.getCommentById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.resolveComment).toHaveBeenCalledTimes(1);
    });
    test("Should return message User not found", async () => {
        jest.spyOn(dataBaseQueries, "getUserById").mockImplementation(
            async () => {
                return [];
            }
        );
        const query = {
            commentId: 1,
            token: "123",
            domain: "www.deepesh.com",
        };
        const result = await request(app).post("/resolveComment").query(query);
        expect(result.body.success).toBe(false);
        expect(result.body.message).toBe("User not found");
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.getCommentById).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.resolveComment).toHaveBeenCalledTimes(0);
    });
    test("Should return User not authorized", async () => {
        jest.spyOn(dataBaseQueries, "findUserToDomain").mockImplementation(
            async () => {
                return [];
            }
        );
        const query = {
            commentId: 1,
            token: "123",
            domain: "www.deepesh.com",
        };
        const result = await request(app).post("/resolveComment").query(query);
        expect(result.body.success).toBe(false);
        expect(result.body.message).toBe("User not authorized");
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.getCommentById).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.resolveComment).toHaveBeenCalledTimes(0);
    });
    test("Should return Comment not found", async () => {
        jest.spyOn(dataBaseQueries, "getCommentById").mockImplementation(
            async () => {
                return [];
            }
        );
        const query = {
            commentId: 1,
            token: "123",
            domain: "www.deepesh.com",
        };
        const result = await request(app).post("/resolveComment").query(query);
        expect(result.body.success).toBe(false);
        expect(result.body.message).toBe("Comment not found");
        expect(dataBaseQueries.getUserById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.getCommentById).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.resolveComment).toHaveBeenCalledTimes(0);
    });
});
