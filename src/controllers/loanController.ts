import { Request, Response, Router } from "express";
import { z } from "zod";

import auth from "../auth";
import Author from "../classes/author";
import Book from "../classes/book";
import db from "../db";
import Member from "../classes/member";
import Loan from "../classes/loan";
import moment from "moment";

class LoanController {
  router: Router = Router().use(auth);

  constructor() {
    this.router.get("/", this.getMyLoans.bind(this));
    this.router.post("/checkout", this.checkout.bind(this));
  }

  async getMyLoans(req: Request, res: Response) {
    if (!req.user) return res.status(403).send("must be signed in");
    let user = new Member(req.user as any);
    if (!user.userid) return res.status(403).send("must be signed in");

    let loans = await Loan.getByUser(user.userid);

    let result = await Promise.all(
      loans.map(async (e) => {
        let book = await e.Book;
        return {
          title: book.title,
          dueDate: e.duedate,
        };
      })
    );

    return res.send(result);
  }

  async checkout(req: Request, res: Response) {
    if (!req.user) return res.status(403).send("must be signed in");
    let user = new Member(req.user as any);
    if (!user.userid) return res.status(403).send("must be signed in");

    let data = z
      .object({
        CopyID: z.coerce.number(),
      })
      .safeParse(req.body);

    if (!data.success) {
      return res.status(400).send(data.error.message);
    }

    let { CopyID } = data.data;
    if (await Loan.isOnLoan(CopyID))
      return res.status(400).send("copy is already on loan");

    let dueDate = moment().add(14, "days");

    let loan = new Loan({
      copyid: CopyID,
      userid: user.userid,
      duedate: dueDate.toDate(),
    });

    await loan.save();

    return res.send(dueDate.calendar());
  }

  async returnbook(req: Request, res: Response) {
    if (!req.user) return res.status(403).send("must be signed in");
    let user = new Member(req.user as any);
    if (!user.userid) return res.status(403).send("must be signed in");

    let data = z
      .object({
        CopyID: z.coerce.number(),
      })
      .safeParse(req.body);

    if (!data.success) {
      return res.status(400).send(data.error.message);
    }

    let { CopyID } = data.data;

    let success = await new Loan({
      copyid: CopyID,
      duedate: new Date(),
      userid: 0,
    }).delete();

    if (success) return res.send("success");
    return res.status(400).send("book not on loan");
  }
}

export default new LoanController().router;
