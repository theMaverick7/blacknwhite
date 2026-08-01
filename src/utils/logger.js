import pino from "pino";

const logger = pino({
    name: "BlacknWhite",
    level: process.env.name === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

export default logger;