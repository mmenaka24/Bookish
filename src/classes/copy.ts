export default class Copy {
  private ISBN: String;
  CopyID: number;

  constructor(ISBN: String, CopyID: number) {
    this.ISBN = ISBN;
    this.CopyID = CopyID;
  }

  get Book() {
    //todo make this return a book object
    return null;
  }
}
