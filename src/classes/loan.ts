import db from "../db";
import Book from "./book";

export default class Loan {
  copyid: number;
  userid: number;
  duedate: Date;

  constructor({
    copyid,
    userid,
    duedate,
  }: {
    copyid: number;
    userid: number;
    duedate: Date;
  }) {
    this.copyid = copyid;
    this.userid = userid;
    this.duedate = duedate;
  }

  async save() {
    await db.none(
      "INSERT INTO Loan VALUES ($<copyid>, $<userid>, $<duedate>);",
      this
    );
  }

  get Author() {
    //todo make this return an author object
    return null;
  }

  get Book(): Promise<Book> {
    return db
      .one(
        `SELECT * FROM book WHERE isbn = (
      SELECT isbn FROM copy WHERE copyid = $1
    );`,
        this.copyid
      )
      .then((e) => {
        return new Book(e);
      });
  }

  static async getByUser(userid: number) {
    return (
      await db.manyOrNone("SELECT * FROM loan WHERE userid = $1;", userid)
    ).map((e) => new Loan(e));
  }

  static async isOnLoan(id: number) {
    return Boolean(
      await db.oneOrNone("SELECT * FROM loan WHERE copyid = $1;", id)
    );
  }

  async delete() {
    return Boolean(
      await db.oneOrNone(
        "DELETE FROM Loan WHERE CopyID = $1 RETURNING *;",
        this.copyid
      )
    );
  }
}
