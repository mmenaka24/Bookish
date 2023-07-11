import db from "../db";

export default class Author {
  name: String;
  authorid?: number;

  constructor({ name, authorid }: { name: String; authorid?: number }) {
    this.name = name;
    this.authorid = authorid;
  }

  async save() {
    let result = await db.models.Author.create({
      name: this.name,
    });

    this.authorid = result.getDataValue("AuthorID");
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
    let result = await db.models.Author.findOne({
      where: {
        AuthorID: id,
      },
    });

    //error as no author with that author id
    if (!result) throw `Author with id '${id}' not found`;

    //create new author
    return new Author(result as any);
  }

  static async getOrCreateAuthorByName(name: string) {
    //find authors with matching name
    let result = await db.models.Author.findAll({
      where: {
        Name: name,
      },
    });

    if (result.length > 1) {
      //error if multiple authors have same name, and no author id has been provided
      throw "Many authors with that name; please provide more detail (eg, author ID).";
    }
    if (result.length) {
      return new Author(result[0] as any);
    } else {
      let authorObj = new Author({ name });
      await authorObj.save();
      return authorObj;
    }
  }
}
