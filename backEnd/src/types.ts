export type DomainResultType = { domainId: number; domainName: string };
export type DomainToUsersType = {
    domainId: number;
    email: string;
    isAdmin: number;
};

export type UserResultType = {
    userId: number;
    userName: string;
    email: string;
    password: string;
    newAccount: number;
};

export type PageOfDomainType = {
    id: number;
    domainId: number;
    pageName: string;
};

export type CommentType = {
    commentsId: number;
    pageOfDomainId: number;
    userId: number;
    message: string;
    elementIdentifier: string;
};

export type QueryType = {
    pageNumber: number;
    pageOfDomain: string;
    domain: string;
    username: string;
    idx: number;
};
