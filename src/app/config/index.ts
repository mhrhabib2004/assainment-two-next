import dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.join(process.cwd(),'.env')})

export default {
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABSE_URl,
    port: process.env.PORT,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    sp: {
        sp_endpoint: process.env.SP_ENDPOINT, // ShurjoPay endpoint
        sp_username: process.env.SP_USERNAME, // ShurjoPay username
        sp_password: process.env.SP_PASSWORD, // ShurjoPay password
        sp_prefix: process.env.SP_PREFIX, // ShurjoPay prefix
        sp_return_url: process.env.SP_RETURN_URL, // ShurjoPay return URL
    },
}