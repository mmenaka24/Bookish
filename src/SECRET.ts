const SECRET = process.env.SECRET || "";
if (!SECRET) throw new Error("SECRET must be provided");

export default SECRET;
