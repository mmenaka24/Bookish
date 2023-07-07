export default class Member {
  Username: String;
  AccessToken: string;
  UserID: number;

  constructor(Username: String, AccessToken: string, UserID: number) {
    this.Username = Username;
    this.AccessToken = AccessToken;
    this.UserID = UserID;
  }
}
