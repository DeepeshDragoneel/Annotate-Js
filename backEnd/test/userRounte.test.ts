// import test, { describe } from "node:test";
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
} from "../src/types";

describe("Testing Add Users to the Domian", () => {
    const userList = {
        allowedUsers: ["deepeshash444@gmail.com"],
        domain: "www.deepesh.com",
        adminUsers: ["zoro@gmail.com"],
    };
    const domainResult = [
        {
            domainId: 1,
            domainName: "www.deepesh.com",
        },
    ] as DomainResultType[];

    beforeEach(() => {
        jest.spyOn(dataBaseQueries, "findDomain").mockImplementation(
            async () => {
                return domainResult;
            }
        );
        jest.spyOn(dataBaseQueries, "deleteDomainUsers").mockImplementation(
            async () => {
                return;
            }
        );
        jest.spyOn(dataBaseQueries, "addAllowedUsers").mockImplementation(
            async () => {
                return;
            }
        );
        jest.spyOn(dataBaseQueries, "addAdminUsers").mockImplementation(
            async () => {
                return;
            }
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    }),
        test("should have message on successfull addition of users", async () => {
            const response = await request(app)
                .post("/addUsers")
                .send(userList);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                "Successfully added users to domain"
            );
            expect(dataBaseQueries.findDomain).toHaveBeenCalledTimes(1);
            expect(dataBaseQueries.deleteDomainUsers).toHaveBeenCalledTimes(1);
            expect(dataBaseQueries.addAllowedUsers).toHaveBeenCalledTimes(1);
            expect(dataBaseQueries.addAdminUsers).toHaveBeenCalledTimes(1);
        });

    test("should have message on failure of addition of users", async () => {
        const response = await request(app).post("/addUsers").send({});
        // expect(response.status).toBe(400);
        expect(response.body.message).toBe("Error adding users to domain");
        expect(dataBaseQueries.findDomain).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.deleteDomainUsers).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.addAllowedUsers).toHaveBeenCalledTimes(0);
        expect(dataBaseQueries.addAdminUsers).toHaveBeenCalledTimes(0);
    });

    test("Should add domain if domain doesn't exist", async () => {
        jest.spyOn(dataBaseQueries, "findDomain").mockImplementation(
            async () => {
                return [];
            }
        );
        jest.spyOn(dataBaseQueries, "addNewDomain").mockImplementation(
            async () => {
                return domainResult;
            }
        );
        const response = await request(app).post("/addUsers").send(userList);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Successfully added users to domain"
        );
        expect(dataBaseQueries.findDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.addNewDomain).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.deleteDomainUsers).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.addAllowedUsers).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.addAdminUsers).toHaveBeenCalledTimes(1);
    });
});

describe("Testing user Login", () => {
    const userList = {
        email: "deepesh@gmail.com",
        password: "deepesh",
        domain: "www.deepesh.com",
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

    const domainToUsersResult = [
        {
            domainId: 1,
            email: "deepesh@gmail.com",
            isAdmin: 1,
        },
    ] as DomainToUsersType[];

    beforeEach(() => {
        jest.spyOn(dataBaseQueries, "findUser").mockImplementation(async () => {
            return userResult;
        });
        jest.spyOn(dataBaseQueries, "findUserToDomain").mockImplementation(
            async () => {
                return domainToUsersResult;
            }
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should have message on successfull login", async () => {
        const response = await request(app).post("/userLogin").send(userList);
        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe("User found");
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("userName");
        expect(response.body).toHaveProperty("email");
        expect(response.body).toHaveProperty("isAdmin");
        expect(response.body).toHaveProperty("access");
        expect(response.body.access).toBe(true);
        expect(dataBaseQueries.findUser).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
    });
    test("should have message user not found", async () => {
        jest.spyOn(dataBaseQueries, "findUser").mockImplementation(async () => {
            return [];
        });
        const response = await request(app).post("/userLogin").send({
            email: "deepu@gmail.com",
            password: "deepu",
            domain: "www.deepesh.com",
        });
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe("User not found");
        expect(dataBaseQueries.findUser).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(0);
    });
    test("should have message wrong password", async () => {
        const response = await request(app)
            .post("/userLogin")
            .send({ ...userList, password: "wrongPassword" });
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe("Wrong password");
        expect(dataBaseQueries.findUser).toHaveBeenCalledTimes(1);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(0);
    });
});

describe("Testing checkUser", () => {
    const userList = {
        email: "deepesh@gmail.com",
        password: "deepesh",
        domain: "www.deepesh.com",
    };

    const domainToUsersResult = [
        {
            domainId: 1,
            email: "deepesh@gmail.com",
            isAdmin: 1,
        },
    ] as DomainToUsersType[];
    beforeEach(() => {});
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should have message User found", async () => {
        jest.spyOn(jwt, "verify").mockImplementation(async () => {
            return {
                email: "deepesh@gmail.com",
                domain: "www.deepesh.com",
            };
        });
        jest.spyOn(dataBaseQueries, "findUserToDomain").mockImplementation(
            async () => {
                return domainToUsersResult;
            }
        );
        const response = await request(app).post("/checkUser").send(userList);
        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe("User found");
        expect(response.body).toHaveProperty("access");
        expect(response.body.access).toBe(true);
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
    });
    test("should have message User not found", async () => {
        jest.spyOn(jwt, "verify").mockImplementation(async () => {
            return {
                email: "deepesh@gmail.com",
                domain: "www.deepesh.com",
            };
        });
        jest.spyOn(dataBaseQueries, "findUserToDomain").mockImplementation(
            async () => {
                return [];
            }
        );
        const response = await request(app).post("/checkUser").send(userList);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.access).toBeFalsy();
        expect(response.body.message).toBe("User Not Found");
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(1);
    });
    test("should have message jwt error", async () => {
        jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("jwt error");
        });
        const response = await request(app).post("/checkUser").send(userList);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe("User Not Found");
        expect(dataBaseQueries.findUserToDomain).toHaveBeenCalledTimes(0);
    });
});

describe("Testing userSignUp", () => {
    let transporter: any;
    const userList = {
        email: "deepesh@gmail.com",
        password: "deepesh",
        userName: "Deepesg",
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
    beforeEach(() => {
        transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
        jest.spyOn(transporter, "sendMail").mockImplementation(async () => {
            return {
                messageId: "123",
            };
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should have message User Already Exists", async () => {
        jest.spyOn(dataBaseQueries, "findUser").mockImplementation(async () => {
            return userResult;
        });
        const response = await request(app)
            .post("/userRegister")
            .send(userList);
        expect(response.status).toBe(200);
        expect(response.body.success).toBeFalsy();
        expect(response.body.message).toBe("User already exists");
        expect(dataBaseQueries.findUser).toHaveBeenCalledTimes(1);
    });
    test("should have message Email sent to the user", async () => {
        jest.spyOn(dataBaseQueries, "findUser").mockImplementation(async () => {
            return [];
        });
        const response = await request(app)
            .post("/userRegister")
            .send(userList);
        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe("Email sent to the user");
        expect(dataBaseQueries.findUser).toHaveBeenCalledTimes(1);
    });
});

describe("Testing user Verify", () => {
    const userList = {
        token: "123",
    };
    beforeEach(() => {
        jest.spyOn(jwt, "verify").mockImplementation(async () => {
            return {
                email: "deepesh@gmail.com",
                domain: "www.deepesh.com",
            };
        });
        jest.spyOn(dataBaseQueries, "addUser").mockImplementation(async () => {
            return;
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should have message User Added", async () => {
        const response = await request(app).get("/verifyUser").send(userList);
        expect(response.status).toBe(200);
        expect(response.text).toEqual(
            "<h1>User added</h1><br/><h3>You can now Login with your credentials!</h3>"
        );
        expect(dataBaseQueries.addUser).toHaveBeenCalledTimes(1);
    });
    test("should have message jwt error", async () => {
        jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("jwt error");
        });
        const response = await request(app).get("/verifyUser").send(userList);
        expect(response.status).toBe(504);
        expect(response.text).toEqual("<h1>Error Adding User</h1>");
        expect(dataBaseQueries.addUser).toHaveBeenCalledTimes(0);
    });
});
