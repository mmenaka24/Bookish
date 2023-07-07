import "dotenv/config";
import express, { Request, Response } from "express";

import books from "./controllers/books";
import bookcontroller from "./controllers/bookcontroller";

const router = express.Router();

router.get("/books", async (req: Request, res: Response) => {
  let bks = await books();
  res.send(JSON.stringify(bks));
});

router.use("/book", bookcontroller);

export default router;
