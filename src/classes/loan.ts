export default class Loan {
  CopyID: number;
  UserID: number;
  DueDate: Date;

  constructor(CopyID: number, UserID: number, DueDate: Date) {
    this.CopyID = CopyID;
    this.CopyID = CopyID;
    this.DueDate = DueDate;
  }

  get Author() {
    //todo make this return an author object
    return null;
  }
}
