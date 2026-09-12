const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'nexus_atm.db');
const db = new DatabaseSync(dbPath);

console.log('[DB] Connected to SQLite database successfully.');

// Initialize Tables with extended fields
db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
        accountNumber TEXT PRIMARY KEY,
        pin TEXT NOT NULL,
        holderName TEXT NOT NULL,
        accountType TEXT DEFAULT 'Savings',
        balance REAL NOT NULL,
        isLocked INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS transactions (
        transactionId TEXT PRIMARY KEY,
        accountNumber TEXT,
        type TEXT,
        amount REAL,
        balanceAfter REAL,
        status TEXT,
        timestamp TEXT,
        FOREIGN KEY(accountNumber) REFERENCES accounts(accountNumber)
    );
`);

// Seed test accounts if empty
const countRow = db.prepare(`SELECT COUNT(*) as count FROM accounts`).get();
if (countRow.count === 0) {
    db.prepare(`INSERT INTO accounts (accountNumber, pin, holderName, accountType, balance, isLocked) VALUES (?, ?, ?, ?, ?, ?)`).run('123456', '1234', 'Mohammed Ismail H.', 'Savings', 45000.00, 0);
    db.prepare(`INSERT INTO accounts (accountNumber, pin, holderName, accountType, balance, isLocked) VALUES (?, ?, ?, ?, ?, ?)`).run('987654', '5678', 'Ayesha Khan', 'Current', 125000.00, 0);
    console.log('[DB] Seeded test accounts successfully.');
}

module.exports = db;