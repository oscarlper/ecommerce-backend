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
    },
    firebase: {
        "type": "service_account",
        "project_id": "ecommerce-backend-94ad9",
        "private_key_id":process.env.FIREBASE_API_KEY,
        "private_key":process.env.FIREBASE_PRIVATE_KEY,
        "client_email": "firebase-adminsdk-37o0h@ecommerce-backend-94ad9.iam.gserviceaccount.com",
        "client_id": "103909696947852742830",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-37o0h%40ecommerce-backend-94ad9.iam.gserviceaccount.com"
    }
};
