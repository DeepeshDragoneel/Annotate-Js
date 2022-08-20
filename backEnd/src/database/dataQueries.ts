import { Connect, Query } from "../config/mysql";
import { connection, redisClient } from "../database/db";
import logging from "../config/logging";

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

export const findDomain = async (
    domainName: string
): Promise<DomainResultType[] | undefined> => {
    try {
        const temp = await redisClient.get(`findDomain-${domainName}`);
        if (temp) {
            // const temp = await redisClient.get(`findDomain-${domainName}`);
            return JSON.parse(temp);
        }
        let query =
            "SELECT * FROM registeredDomains WHERE domainName = '" +
            domainName +
            "'";
        const results = (await Query(connection!, query)) as DomainResultType[];
        await redisClient.set(
            `findDomain-${domainName}`,
            JSON.stringify(results)
        );
        return results;
    } catch (error: any) {
        // logging.error("FIND_DOMAIN", error);
        console.log(error);
    }
};
export const addNewDomain = async (
    domainName: string
): Promise<DomainResultType[] | undefined> => {
    try {
        const query =
            "INSERT INTO registeredDomains (domainName) VALUES ('" +
            domainName +
            "')";
        await Query(connection!, query);
        await redisClient.del(`findDomain-${domainName}`);
        const results = await findDomain(domainName);
        return results;
    } catch (error: any) {
        logging.error("FIND_DOMAIN", error);
    }
};

export const deleteDomainUsers = async (domainId: number): Promise<void> => {
    try {
        const allUsers = (await Query(
            connection!,
            `SELECT * FROM domainToUsers WHERE domainId = ${domainId}`
        )) as DomainToUsersType[];
        for (const user of allUsers) {
            `findUserToDomain-${domainId}-${user.email}`;
            await redisClient.del(`findUserToDomain-${domainId}-${user.email}`);
        }
        const query = `DELETE FROM domainToUsers WHERE domainId = ${domainId}`;
        await Query(connection!, query);
    } catch (error: any) {
        logging.error("DELETE_DOMAIN_USER", error);
    }
};

export const findUserToDomain = async (
    domain: string,
    email: string
): Promise<DomainToUsersType[] | undefined> => {
    try {
        const temp = await redisClient.get(
            `findUserToDomain-${domain}-${email}`
        );
        if (temp) {
            return JSON.parse(temp);
        }
        let query = `SELECT * FROM domainToUsers WHERE domainId = (SELECT domainId FROM registeredDomains WHERE domainName = '${domain}') AND email = '${email}'`;
        const results = (await Query(
            connection!,
            query
        )) as DomainToUsersType[];
        const domainInfo = await findDomain(domain);
        if (
            domainInfo !== null &&
            domainInfo !== undefined &&
            domainInfo.length > 0
        ) {
            const domainId = domainInfo![0].domainId;
            await redisClient.set(
                `findUserToDomain-${domainId}-${email}`,
                JSON.stringify(results)
            );
        }
        return results;
    } catch (error: any) {
        logging.error("FIND_USER_TO_DOMAIN", error);
    }
};

export const addAllowedUsers = async (
    domainId: number,
    email: string
): Promise<void> => {
    try {
        const query = `INSERT INTO domainToUsers (domainId, email, isAdmin) VALUES (${domainId}, '${email}', 0)`;
        const temp = await redisClient.get(
            `findUserToDomain-${domainId}-${email}`
        );
        if (temp) {
            await redisClient.del(`findUserToDomain-${domainId}-${email}`);
        }
        await Query(connection!, query);
    } catch (error: any) {
        logging.error("ADD_ALLOWED_USER", error);
    }
};

export const addAdminUsers = async (
    domainId: number,
    email: string
): Promise<void> => {
    let query = `DELETE FROM domainToUsers WHERE domainId = ${domainId} AND email = '${email}'`;
    await Query(connection!, query);

    const temp = await redisClient.get(`findUserToDomain-${domainId}-${email}`);
    if (temp) {
        await redisClient.del(`findUserToDomain-${domainId}-${email}`);
    }

    query = `INSERT INTO domainToUsers (domainId, email, isAdmin) VALUES (${domainId}, '${email}', 1)`;
    await Query(connection!, query);
};

export const findUser = async (
    email: string
): Promise<UserResultType[] | undefined> => {
    try {
        const temp = await redisClient.get(`findUser-${email}`);
        if (temp) {
            return JSON.parse(temp);
        }
        let query = `SELECT * FROM users WHERE email = '${email}'`;
        const results = (await Query(connection!, query)) as UserResultType[];
        if (results.length === 0) {
            query = `SELECT * FROM users WHERE userName = '${email}'`;
            const results = (await Query(
                connection!,
                query
            )) as UserResultType[];
        }
        if (results.length > 0) {
            await redisClient.set(`findUser-${email}`, JSON.stringify(results));
        }
        return results;
    } catch (error: any) {
        logging.error("FIND_USERS", error);
    }
};

export const addUser = async (
    userName: string,
    email: string,
    password: string
): Promise<void> => {
    try {
        const query = `INSERT INTO users (userName, email, password) VALUES ('${userName}', '${email}', '${password}')`;
        await Query(connection!, query);
    } catch (error: any) {
        logging.error("CREATE_USER", error);
    }
};

export const getUserById = async (
    userId: number
): Promise<UserResultType[] | undefined> => {
    try {
        const temp = await redisClient.get(`getUserById-${userId}`);
        if (temp) {
            return JSON.parse(temp);
        }
        const query = `SELECT * FROM users WHERE userId = ${userId}`;
        const results = (await Query(connection!, query)) as UserResultType[];
        if (results !== undefined && results !== null && results.length > 0) {
            await redisClient.set(
                `getUserById-${userId}`,
                JSON.stringify(results)
            );
        }
        return results;
    } catch (error: any) {
        logging.error("GET_USER_BY_ID", error);
    }
};

export const getPageOfDomain = async (
    pageName: string
): Promise<PageOfDomainType[] | undefined> => {
    try {
        const temp = await redisClient.get(`getPageOfDomain-${pageName}`);
        if (temp) {
            return JSON.parse(temp);
        }
        console.log(pageName);
        const query = `SELECT * FROM pagesOfDomain WHERE pageName = '${pageName}'`;
        console.log(query);
        let pageResult = (await Query(
            connection!,
            query
        )) as PageOfDomainType[];
        if (
            pageResult !== undefined &&
            pageResult !== null &&
            pageResult.length > 0
        ) {
            await redisClient.set(
                `getPageOfDomain-${pageName}`,
                JSON.stringify(pageResult)
            );
        }
        return pageResult;
    } catch (error: any) {
        // logging.error("GET_PAGE_OF_DOMAIN", error);
        console.log(error);
    }
};

export const insertIntoPagesOfDomain = async (
    pageName: string,
    domainId: number
): Promise<PageOfDomainType[] | undefined> => {
    const query = `INSERT INTO pagesOfDomain (pageName, domainId) VALUES ('${pageName}', ${domainId})`;
    (await Query(connection!, query)) as PageOfDomainType[];
    const results = (await Query(
        connection!,
        `SELECT * FROM pagesOfDomain WHERE pageName = '${pageName}'`
    )) as PageOfDomainType[];
    return results;
};

export const insertComment = async (
    pageName: string,
    pageId: number,
    userId: number,
    comment: string,
    itemBeingCommented: string
): Promise<void> => {
    try {
        const query = `INSERT INTO comments (pageOfDomainId, userId, message, elementIdentifier, created_at) VALUES (${pageId}, ${userId}, '${comment}', '${itemBeingCommented}', '${new Date().toISOString()}')`;
        (await Query(connection!, query)) as CommentType[];
        if (redisClient.get(`countOfLeftComments_${pageName}`)) {
            // console.log("redis client exists", redisClient.get(pageName));
            redisClient.incr(`countOfLeftComments_${pageName}`);
        }
    } catch (error: any) {
        logging.error("INSERT_COMMENT", error);
    }
};

export const getCommentsByPageNumber = async (
    pageOfDomain: string,
    filter: string,
    pageNumber: number
): Promise<CommentType[] | undefined> => {
    try {
        const query = `SELECT * FROM comments INNER JOIN users ON comments.userId=users.userId WHERE pageOfDomainId=(SELECT id FROM pagesOfDomain WHERE pageName = '${pageOfDomain}')${filter} ORDER BY comments.created_at DESC LIMIT ${
            pageNumber * 10
        }, ${pageNumber * 10 + 10}`;
        // console.log(query);
        const commentResults = (await Query(
            connection!,
            query
        )) as CommentType[];
        return commentResults;
    } catch (error: any) {
        logging.error("GET_COMMENTS_BY_PAGE_NUMBER", error);
    }
};

export const countOfLeftComments = async (
    pageOfDomain: string
): Promise<number | undefined> => {
    try {
        if (redisClient.get(`countOfLeftComments_${pageOfDomain}`)) {
            let temp = await redisClient.get(
                `countOfLeftComments_${pageOfDomain}`
            );
            // console.log("redis client exists", temp);
            return parseInt(temp);
        }
        const query = `SELECT COUNT(*) FROM comments WHERE pageOfDomainId=(SELECT id FROM pagesOfDomain WHERE pageName = '${pageOfDomain}')`;
        const commentCount = (await Query(connection!, query)) as {
            commentsCountNumber: number;
        }[];
        let result = Object.values(
            JSON.parse(JSON.stringify(commentCount[0]))
        )[0] as number;
        // console.log(result);
        await redisClient.set(
            `countOfLeftComments_${pageOfDomain}`,
            result.toString()
        );
        return result;
    } catch (error: any) {
        logging.error("COUNT_OF_LEFT_COMMENTS", error);
    }
};

export const getCommentById = async (
    commentId: number
): Promise<CommentType[] | undefined> => {
    try {
        const query = `SELECT * FROM comments WHERE commentsId = ${commentId}`;
        const results = (await Query(connection!, query)) as CommentType[];
        return results;
    } catch (error: any) {
        logging.error("GET_COMMENT_BY_ID", error);
    }
};

export const resolveComment = async (commentId: number): Promise<void> => {
    try {
        const query = `UPDATE comments SET resolved = 1 WHERE commentsId = ${commentId}`;
        await Query(connection!, query);
    } catch (error: any) {
        logging.error("RESOLVE_COMMENT", error);
    }
};
