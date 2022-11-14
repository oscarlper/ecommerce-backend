dotenv.config();
const DB_USER=process.env.DB_USER
const DB_PASSWORD=process.env.DB_PASSWORD
const DB_NAME=process.env.DB_NAME
const DB_CLUSTER=process.env.DB_CLUSTER

import dotenv from "dotenv";

const TIEMPO_EXPIRACION = 600000;

export default {
    TIEMPO_EXPIRACION,
    mongodb: {
    connectionString: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    }
};
