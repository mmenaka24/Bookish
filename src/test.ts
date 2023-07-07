import Author from "./classes/author";

async function main() {
  let frank = new Author({ Name: "jack" });
  await frank.save();
  console.log(frank.AuthorID);
  process.exit();
}
main();
