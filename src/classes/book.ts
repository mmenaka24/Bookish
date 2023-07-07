import db from "../db";

export default class Book {
  ISBN: String;
  Title: string;
  private AuthorID: number;

  constructor({
    isbn,
    title,
    authorid,
  }: {
    isbn: String;
    title: string;
    authorid: number;
  }) {
    this.ISBN = isbn;
    this.Title = title;
    this.AuthorID = authorid;
  }

  get Author() {
    //todo make this return an author object
    return null;
  }

  async save() {
    await db.none(
      "INSERT INTO Book VALUES ($<ISBN>, $<Title>, $<AuthorID>);",
      this
    );
  }
}
