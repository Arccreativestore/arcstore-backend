import { NextFunction, Request, Response } from "express";

export default (allowedOrigins: Array<string>) => {
  return function request(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin as string;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT,POST,GET,DELETE,PATCH,UPDATE"
      );
      return res.status(200).json({});
    }
    next();
  };
};
