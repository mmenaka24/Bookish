CREATE TABLE
    Author (
        Name varchar(128),
        AuthorID SERIAL PRIMARY KEY
    );

CREATE TABLE
    Member (
        Username varchar(128) UNIQUE,
        Password varchar(128),
        UserID SERIAL PRIMARY KEY
    );

CREATE TABLE
    Book (
        ISBN varchar(13) PRIMARY KEY,
        Title varchar(128),
        AuthorID integer REFERENCES Author
    );

CREATE TABLE
    Copy (
        CopyID SERIAL PRIMARY KEY,
        ISBN varchar(13) REFERENCES Book
    );

CREATE TABLE
    Loan (
        CopyID integer PRIMARY KEY references Copy,
        UserID integer REFERENCES member,
        DueDate date NOT NULL
    );