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
    let { userid } = await db.one(
      "INSERT INTO Member VALUES ($<username>, $<password>) RETURNING userid;",
      this
    );
    this.userid = userid;
  }
}
