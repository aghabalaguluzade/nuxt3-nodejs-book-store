import { defineEventHandler, getMethod, setResponseHeaders } from 'h3';

export default defineEventHandler(async (event) => {
  const headers = {
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Expose-Headers": "Content-Type, Authorization"
  };

  setResponseHeaders(event, headers);

  if (getMethod(event) === 'OPTIONS') {
    event.res.statusCode = 204;
    event.res.statusMessage = "No Content";
    return;
  }
});
