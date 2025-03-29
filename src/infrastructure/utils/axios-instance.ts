import axios from "axios";
import http from "node:http";
import https from "node:https";

export const axiosInstance = axios.create({
    httpAgent: new http.Agent({keepAlive: true}),
    httpsAgent: new https.Agent({keepAlive: true})
});
