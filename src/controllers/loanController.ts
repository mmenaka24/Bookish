import { Request, Response, Router } from "express";
import { z } from "zod";

import auth from "../auth";
import Author from "../classes/author";
import Book from "../classes/book";
import db from "../db";
import Member from "../classes/member";
import Loan from "../classes/loan";

class BookController {
  router: Router = Router().use(auth);

  constructor() {
    this.router.get("/", this.getMyLoans.bind(this));
  }

  async getMyLoans(req: Request, res: Response) {
    if (!req.user) return res.status(403).send("must be signed in");

    let user = new Member(req.user as any);

    if (!user.userid) return res.status(403).send("must be signed in");

    let loans = await Loan.getByUser(user.userid);

    console.log(loans);

    let result = await Promise.all(
      loans.map(async (e) => {
        let book = await e.Book;
        console.log(book);
        return {
          title: book.title,
          dueDate: e.duedate,
        };
      })
    );

    return res.send(result);
  }
}

export default new BookController().router;
