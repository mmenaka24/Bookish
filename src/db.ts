import "dotenv/config";
import { DataTypes, INTEGER, Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL || "";
if (!DATABASE_URL) throw new Error("DATABASE_URL must be provided");

const db = new Sequelize(DATABASE_URL);

const Author = db.define("Author", {
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AuthorID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});

const Member = db.define("Member", {
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});

const Book = db.define("Book", {
  ISBN: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AuthorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Author",
      key: "AuthorID",
    },
  },
});

const Copy = db.define("Copy", {
  CopyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  ISBN: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Book",
      key: "ISBN",
    },
  },
});

const Loan = db.define("Loan", {
  CopyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "Copy",
      key: "CopyID",
    },
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Member",
      key: "UserID",
    },
  },
  DueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default db;
