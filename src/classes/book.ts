import barcode from "../barcode";
import db from "../db";

export default class Book {
  isbn: String;
  title: string;
  private authorid: number;

  constructor({
    isbn,
    title,
    authorid,
  }: {
    isbn: String;
    title: string;
    authorid: number;
  }) {
    this.isbn = isbn;
    this.title = title;
    this.authorid = authorid;
  }

  get Author() {
    //todo make this return an author object
    return null;
  }

  async save() {
    await db.none(
      "INSERT INTO Book VALUES ($<isbn>, $<title>, $<authorid>);",
      this
    );
  }

  static async getList() {
    //get all books from the database
    let books = await db.many("SELECT * From Book ORDER BY title ASC");
    //return as a list of objects of the 'Book' class
    return books.map((e) => new Book(e));
  }

  static async search({
    title,
    author,
  }: {
    title?: string | undefined;
    author?: string | undefined;
  }): Promise<Book[]> {
    if (author) author = `%${author}%`;
    if (title) title = `%${title}%`;

    if (title && author) {
      let books = await db.manyOrNone(
        //check 1. titles match or are similar, 2. author id is the author id of an author which matches or is similar
        `SELECT * From Book WHERE 
          title ILIKE $<title> 
        AND 
          authorid in (
            SELECT authorid From Author WHERE name ILIKE $<author>
          )
        ORDER BY title ASC;`,
        { author, title }
      );

      return books.map((e) => new Book(e));
    }

    if (title) {
      console.log(title);
      let books = await db.manyOrNone(
        `SELECT * From Book WHERE 
          title ILIKE $<title>
        ORDER BY title ASC;`,
        { title }
      );

      return books.map((e) => new Book(e));
    }

    if (author) {
      let books = await db.manyOrNone(
        `SELECT * From Book WHERE 
          authorid in (
            SELECT authorid From Author WHERE name ILIKE $<author>
          )
        ORDER BY title ASC`,
        { author }
      );

      return books.map((e) => new Book(e));
    }

    return this.getList();
  }
}
