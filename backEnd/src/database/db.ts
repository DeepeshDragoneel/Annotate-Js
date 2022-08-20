import { createClient } from "redis";
import { Connect } from "../config/mysql";
import logging from "../config/logging";
import { config as Config } from "../config/config";

export let connection: any = undefined;
export let redisClient: any = undefined;

export const connectToDB = async () => {
    try {
        connection = await Connect();
        logging.info("Data Base", "Connected to REDIS and MYSQL DB");
        // redisClient = redis.createClient(Config.redis.port, Config.redis.host);
        const url = Config.redis.url;
        redisClient = createClient({
            url: url,
            password: Config.redis.password,
        });
        let reconnectTime: any = null;
        const TimeOutError = () => {
            reconnectTime = setTimeout(() => {
                throw new Error("Redis connection failed");
            }, 10000);
        };

        redisClient.on("connect", function () {
            console.log("REDIS connected");
            clearTimeout(reconnectTime);
        });

        redisClient.on("error", function (e: Error) {
            console.log("Redis error: " + e);
            TimeOutError();
        });

        redisClient.on("end", () => {
            console.log("REDIS disconnected");
            TimeOutError();
        });
        redisClient.on("reconnecting", () => {
            console.log("REDIS reconnecting");
            clearTimeout(reconnectTime);
        });

        await redisClient.connect();

        return connection;
    } catch (err) {
        // logging.error("Data Base", err as string);
        console.log(err);
    }
};
