DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS operation;

CREATE TABLE account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0
);

CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER REFERENCES account(id) ON DELETE CASCADE DEFAULT 0
);

CREATE TABLE operation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    price INTEGER NOT NULL,
    date TEXT,
    category_id INTEGER,
    user_id INTEGER REFERENCES account(id) ON DELETE CASCADE
);

-- Données pour la table "account"
INSERT INTO account (username, password, balance) VALUES
                                                      ('john_doe', 'password123', 1500.75),
                                                      ('alice_smith', 'securepass', 2000.50),
                                                      ('bob_jones', 'pass123', 1200.00),
                                                      ('emma_white', 'secretword', 1800.25),
                                                      ('michael_black', 'mypass', 2500.90);

-- Données pour la table "category"
INSERT INTO category (title, user_id) VALUES
    ('Groceries', 0),
    ('Shopping', 0),
    ('Bills', 0),
    ('Entertainment', 0),
    ('Travel', 0),
    ('Health', 0),
    ('Home', 0),
    ('Education', 0);

-- Données pour la table "operation"
INSERT INTO operation (price, date, category_id, user_id) VALUES
                                                              (75.50, '2024-01-27', 1, 1),
                                                              (120.75, '2024-01-26', 2, 2),
                                                              (50.00, '2024-01-25', 3, 3),
                                                              (35.20, '2024-01-24', 1, 4),
                                                              (80.30, '2024-01-23', 2, 5),
                                                              (25.60, '2024-01-22', 4, 1),
                                                              (90.00, '2024-01-21', 5, 2),
                                                              (40.50, '2024-01-20', 3, 3),
                                                              (60.75, '2024-01-19', 1, 4),
                                                              (55.20, '2024-01-18', 2, 5);
