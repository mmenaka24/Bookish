import db from "../db";

export default class Author {
  Name: String;
  AuthorID?: number;

  constructor({ Name, AuthorID }: { Name: String; AuthorID?: number }) {
    this.Name = Name;
    this.AuthorID = AuthorID;
  }

  async save() {
    await db.none("INSERT INTO Author VALUES ($1)", this.Name);
    let data = await db.one("SELECT * FROM Author WHERE name = $1", this.Name);

    console.log(data);

    this.AuthorID = data.authorid;
  }
}
