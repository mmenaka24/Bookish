import Book from "../classes/book";
import db from "../db";

export default async function (): Promise<Book[]> {
  let books = await db.many("SELECT * From Book");
  return books.map((e) => new Book(e));
}
