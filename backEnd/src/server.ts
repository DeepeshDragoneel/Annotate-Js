import { config } from "./config/config";
import { Sequelize } from "sequelize";
import { connectToDB } from "./database/db";
import { app } from "./app";

// const sequelize = new Sequelize({
//     host: config.mysql.host,
//     database: config.mysql.database,
//     username: config.mysql.user,
//     password: config.mysql.password,
//     dialect: "mysql",
//     port: 3306,
//     logging: console.log,
//     dialectOptions: {
//         ssl: "Amazon RDS",
//     },
//     pool: { maxConnections: 5, maxIdleTime: 30 },
//     language: "en",
// });

// const connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database,
//     port: 3306,
//     ssl: "Amazon RDS",
// });

// connection.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//     }
// });

// connection.query(
//     "SELECT * FROM registeredDomains",
//     function (error: Error, results: any, fields: any) {
//         if (error) throw error;
//         console.log("The solution is: ", results);
//     }
// );
connectToDB()
    .then(() => {
        app.listen(config.server.port, () => {
            console.log("Listening on port: ", config.server.port);
        }).on("error", (e: Error) => {
            console.log("Error happened: ", e.message);
        });
    })
    .catch((err: Error) => {
        console.log("Error happened: ", err.message);
    });
