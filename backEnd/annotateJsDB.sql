show databases;
CREATE DATABASE AnnotateJs;
USE AnnotateJs;

SHOW TABLES;

CREATE TABLE registeredDomains(
	domainId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    domainName VARCHAR(255) NOT NULL UNIQUE
);

DESC registeredDomains;

CREATE TABLE users(
	userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    googleId VARCHAR(255) NOT NULL UNIQUE
);

DESC users;

CREATE TABLE domainToUsers(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    domainId INT,
    userId INT,
    FOREIGN KEY(domainId) REFERENCES registeredDomains(domainId),
    FOREIGN KEY(userId) REFERENCES users(userId)
);
DESC domainToUsers;

INSERT INTO registeredDomains(domainName)
VALUES ("Unknown!");

SELECT * FROM registeredDomains;

INSERT INTO users(userName, email, googleId)
VALUES ("Zoro", "Zoro@gmail.com", "23454562342");

SELECT * FROM users;

INSERT INTO domainToUsers(domainId, userId)
VALUES (2, 4);

SELECT userName from registeredDomains
INNER JOIN domainToUsers
	on domainToUsers.domainId = registeredDomains.domainId
INNER JOIN users
	on domainToUsers.userId = users.userId
WHERE domainName = "Unknown!";
    