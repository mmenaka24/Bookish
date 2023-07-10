import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import SECRET from "../SECRET";
import Member from "../classes/member";
import db from "../db";

class authController {
  router: Router = Router();

  constructor() {
    this.router.post("/login", this.login.bind(this));
    this.router.post("/register", this.register.bind(this));
  }

  //checking username and password exist/match
  async login(req: Request, res: Response) {
    //want username and password to be the body of the request
    let { username, password } = req.body;

    //check that username and password are strings
    if (typeof username !== "string") {
      res.status(400).send("invalid username");
      return;
    }
    if (typeof password !== "string") {
      res.status(400).send("invalid password");
      return;
    }

    //find the row of the 'member' table in the database which matches the username
    let user = await db.one(
      "SELECT * FROM member WHERE username = $1",
      username
    );

    //check that 1. username exists in member table 2. password matches
    if (user && password !== user.password) {
      res.status(403).send("incorrect username or password");
      return;
    }

    //construct the token
    let token = jwt.sign({ foo: "bar" }, SECRET, {
      subject: String(user.userid),
    });

    res.send(token);
  }

  async register(req: Request, res: Response) {
    let data = z
      .object({
        username: z.string().nonempty(),
        password: z.string().nonempty(),
      })
      .safeParse(req.body);

    if (!data.success) {
      return res.status(400).send(data.error.message);
    }

    let { username, password } = data.data;

    let user = new Member({ username, password });
    try {
      await user.save();
      return res.send(user);
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  }
}

export default new authController().router;
