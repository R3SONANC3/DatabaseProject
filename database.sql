CREATE TABLE Categories (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(255) UNIQUE,
    CONSTRAINT categoryNameUnique UNIQUE (categoryName)
);



CREATE TABLE Emails (
    emailID INT AUTO_INCREMENT PRIMARY KEY,
    messageID VARCHAR(255) UNIQUE NOT NULL,
    date DATETIME NOT NULL,
    senderEmail VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    recipientEmail VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL ,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
