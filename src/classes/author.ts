import db from "../db";

export default class Author {
  name: String;
  authorid?: number;

  constructor({ name, authorid }: { name: String; authorid?: number }) {
    this.name = name;
    this.authorid = authorid;
  }

  async save() {
    let { authorid } = await db.one(
      "INSERT INTO Author VALUES ($1) RETURNING authorid",
      this.name
    );

    this.authorid = authorid;
  }

  //static means applies to whole class as a concept rather than individual instance of the class
  static async getOrCreateAuthor({
    AuthorID,
    Name,
  }: {
    AuthorID?: number | undefined;
    Name?: string | undefined;
  }): Promise<Author> {
    if (AuthorID) {
      return this.getAuthorByID(AuthorID);
    }

    if (Name) {
      return this.getOrCreateAuthorByName(Name);
    }

    //this only happens if none of the above 'if' things happen
    throw "you must specify an author name or ID";
  }

  static async getAuthorByID(id: number) {
    //find author with the matching author id
    let result = await db.oneOrNone(
      "SELECT * FROM Author WHERE authorid = $1",
      id
    );

    //error as no author with that author id
    if (!result) throw `Author with id '${id}' not found`;

    //create new author
    return new Author(result);
  }

  static async getOrCreateAuthorByName(name: string) {
    //find authors with matching name
    let result = await db.manyOrNone(
      "SELECT * FROM Author WHERE name = $1",
      name
    );

    if (result.length > 1) {
      //error if multiple authors have same name, and no author id has been provided
      throw "Many authors with that name; please provide more detail (eg, author ID).";
    }
    if (result.length) {
      return new Author(result[0]);
    } else {
      let authorObj = new Author({ name });
      await authorObj.save();
      return authorObj;
    }
  }
}
