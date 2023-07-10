import db from "../db";

export default class Member {
  username: string;
  password: string;
  userid?: number;

  constructor({
    username,
    password,
    userid,
  }: {
    username: string;
    password: string;
    userid?: number;
  }) {
    this.username = username;
    this.password = password;
    this.userid = userid;
  }

  async save() {
    await db.none(
      "INSERT INTO Member VALUES ($<username>, $<password>);",
      this
    );
  }
}
