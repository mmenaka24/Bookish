import { Request, Response, Router } from "express";

import { auth } from "../auth";
import { z } from "zod";
import db from "../db";
import Author from "../classes/author";

class BookController {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(auth);
    this.router.get("/:ISBN", this.getBook.bind(this));
    this.router.post("/add", this.addBook.bind(this));
  }

  getBook(request: Request, response: Response) {}

  async addBook(request: Request, response: Response) {
    let data = z
      .object({
        Title: z.string().nonempty(),
        ISBN: z.string(),
        Author: z.object({
          AuthorID: z.coerce.number().optional(),
          Name: z.string().optional(),
        }),
      })
      .safeParse(request.body);

    if (!data.success) {
      return response.status(400).send(data.error.message);
    }

    let body = data.data;
    let author = body.Author;
    let authorObj: Author;
    if (author.AuthorID) {
      let result = await db.oneOrNone(
        "SELECT * FROM Author WHERE authorid = $1",
        author.AuthorID
      );
      if (!result)
        return response
          .status(404)
          .send(`Author with id '${author.AuthorID}' not found`);
      authorObj = new Author(result);
    } else if (author.Name) {
      let result = await db.many(
        "SELECT * FROM Author WHERE name = $1",
        author.Name
      );
      if (result.length > 1) {
        return response
          .status(400)
          .send("Many authors with that name; please provide more detail.");
      }

      if (result.length) {
        authorObj = new Author(result[0]);
      } else {
        authorObj = new Author({ Name: author.Name });
        await authorObj.save();
      }
    } else {
      return response.send("you must specify an author name or ID");
    }
  }
}

export default new BookController().router;
