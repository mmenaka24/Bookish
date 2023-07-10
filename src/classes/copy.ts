import barcode from "../barcode";
import db from "../db";

export default class Copy {
  private isbn: String;
  copyid?: number;

  constructor(isbn: String, copyid?: number) {
    this.isbn = isbn;
    this.copyid = copyid;
  }

  async save() {
    let { copyid } = await db.one(
      "INSERT INTO Copy (ISBN) VALUES ($1) RETURNING copyid;",
      this.isbn
    );
    this.copyid = copyid;
  }

  get Book() {
    //todo make this return a book object
    return null;
  }

  giveBarcode() {
    return barcode(`ISBN: ${this.isbn}, copyID: ${this.copyid}`);
  }
}
