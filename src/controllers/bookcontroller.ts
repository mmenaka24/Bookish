import { Request, Response, Router } from "express";
import { z } from "zod";

import auth from "../auth";
import Author from "../classes/author";
import Book from "../classes/book";
import db from "../db";
import Copy from "../classes/copy";

class BookController {
  router: Router = Router().use(auth);

  constructor() {
    this.router.post("/add", this.addBook.bind(this));
    this.router.get("/get/:ISBN", this.getBook.bind(this));
    this.router.get("/list", this.list.bind(this));
  }

  //searches for title/author specified. If none specified, shows alphabetical list of all books
  async list(req: Request, res: Response) {
    try {
      let query = z
        .object({
          title: z.string().optional(),
          author: z.string().optional(),
        })
        .parse(req.query);
      console.log(query);
      return res.send(await Book.search(query));
    } catch (e) {
      return res.send(await Book.getList());
    }
  }

  //find the desired book in the Book table in the database with the matching ISBN number (if it exists), and send this back
  async getBook(request: Request, response: Response) {
    let { ISBN } = request.params;
    let book = await db.oneOrNone(
      `SELECT b.title, COUNT(c) AS total_copies, COUNT(l) as loaned_copies, COUNT(c) - COUNT(l) as availible_copies
        FROM book b
          LEFT JOIN copy c
          ON b.isbn = c.isbn
          LEFT JOIN loan l
          ON c.copyid = l.copyid
        WHERE (b.isbn = $1)
        GROUP BY (b.title);`,
      ISBN
    );

    if (!book) {
      return response.status(404).send(`Book with ISBN ${ISBN} not found`);
    }

    let loans = await db.manyOrNone(
      `
    SELECT l.duedate, m.username
    FROM copy c
    RIGHT JOIN loan l
    ON c.copyid = l.copyid
    LEFT JOIN member m
    ON l.userid = m.userid
    WHERE (c.isbn = $1);`,
      ISBN
    );

    response.send({ book, loans });
  }

  //add a book to the Book table in the database
  async addBook(request: Request, response: Response) {
    let data = z
      .object({
        Title: z.string().nonempty(),
        ISBN: z.string(),
        Copies: z.coerce.number().positive(),
        Author: z.object({
          AuthorID: z.coerce.number().optional(),
          Name: z.string().optional(),
        }),
      })
      .safeParse(request.body);

    if (!data.success) {
      return response.status(400).send(data.error.message);
    }

    //set the ISBN and Title of the book we want to add
    let body = data.data;
    let author = await Author.getOrCreateAuthor(body.Author);
    let { ISBN, Title, Copies } = body;

    //add the book to the database
    let book = new Book({
      isbn: ISBN,
      title: Title,
      authorid: author.authorid!,
    });

    book.save();

    //add the copies to the copy table
    let copies = await Promise.all(
      Array(Copies)
        .fill(1)
        .map(async () => {
          let c = new Copy(ISBN);
          await c.save();
          return c;
        })
    );

    return response.send({
      ...book,
      barcodes: copies.map((e) => e.giveBarcode()),
    });
  }
}

export default new BookController().router;
