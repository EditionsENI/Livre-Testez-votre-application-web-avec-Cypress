CREATE DATABASE IF NOT EXISTS blog_cypress;
USE blog_cypress;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL, 
    role ENUM('USER', 'ADMIN') NOT NULL
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT NOT NULL
);

CREATE TABLE users_temp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL,
    token VARCHAR(50) NOT NULL
);

INSERT INTO users (username, password, email, role) VALUES ('testuser', 'testpassword', 'testuser@testvulnerabilities.fr', 'ADMIN');
INSERT INTO users (username, password, email, role) VALUES ('user1', 'pass1', 'user1@testvulnerabilities.fr', 'USER');
INSERT INTO users (username, password, email, role) VALUES ('user2', 'pass2', 'user2@testvulnerabilities.fr', 'USER');
