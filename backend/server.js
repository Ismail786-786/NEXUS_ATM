const express = require('express');
const cors = require('cors');
const db = require('../database/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory FIFO Queue Simulation for Branch Service
let branchQueue = [
    { ticket: 'Q-101', name: 'Rahul S.', service: 'Cash Deposit' },
    { ticket: 'Q-102', name: 'Priya M.', service: 'PIN Reset' },
    { ticket: 'Q-103', name: 'Mohammed Ismail', service: 'Statement Print' }
];

// 1. Authenticate Account
app.post('/api/atm/login', (req, res) => {
    try {
        const { accountNumber, pin } = req.body;
        const account = db.prepare(`SELECT * FROM accounts WHERE accountNumber = ?`).get(accountNumber);

        if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });
        if (account.isLocked) return res.status(403).json({ success: false, message: 'Account is locked.' });

        if (account.pin === pin) {
            res.json({ success: true, message: 'Login successful', holderName: account.holderName, accountType: account.accountType, balance: account.balance });
        } else {
            res.status(401).json({ success: false, message: 'Invalid PIN.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Deposit Money
app.post('/api/atm/deposit', (req, res) => {
    try {
        const { accountNumber, amount } = req.body;
        if (amount <= 0) return res.status(400).json({ success: false, message: 'Invalid deposit amount.' });

        const account = db.prepare(`SELECT balance FROM accounts WHERE accountNumber = ?`).get(accountNumber);
        if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });

        const newBalance = account.balance + parseFloat(amount);
        db.prepare(`UPDATE accounts SET balance = ? WHERE accountNumber = ?`).run(newBalance, accountNumber);

        const txnId = 'TXN-' + Date.now();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        db.prepare(`INSERT INTO transactions VALUES (?, ?, 'DEPOSIT', ?, ?, 'SUCCESS', ?)`)
          .run(txnId, accountNumber, amount, newBalance, timestamp);

        res.json({ success: true, newBalance, transactionId: txnId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Withdraw Money with AI Fraud Risk Score
app.post('/api/atm/withdraw', (req, res) => {
    try {
        const { accountNumber, amount } = req.body;
        if (amount <= 0) return res.status(400).json({ success: false, message: 'Invalid withdrawal amount.' });

        const account = db.prepare(`SELECT balance FROM accounts WHERE accountNumber = ?`).get(accountNumber);
        if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });

        if (amount > account.balance) {
            return res.status(400).json({ success: false, message: 'Insufficient balance.' });
        }

        // AI Fraud heuristic check
        let fraudRisk = amount > 25000 ? 'HIGH RISK (Verified by PIN)' : 'LOW RISK (Normal Velocity)';

        const newBalance = account.balance - parseFloat(amount);
        db.prepare(`UPDATE accounts SET balance = ? WHERE accountNumber = ?`).run(newBalance, accountNumber);

        const txnId = 'TXN-' + Date.now();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        db.prepare(`INSERT INTO transactions VALUES (?, ?, 'WITHDRAWAL', ?, ?, 'SUCCESS', ?)`)
          .run(txnId, accountNumber, amount, newBalance, timestamp);

        res.json({ success: true, newBalance, transactionId: txnId, fraudRisk });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Inter-Account Fund Transfer
app.post('/api/atm/transfer', (req, res) => {
    try {
        const { senderAcc, recipientAcc, amount } = req.body;
        if (amount <= 0) return res.status(400).json({ success: false, message: 'Invalid transfer amount.' });
        if (senderAcc === recipientAcc) return res.status(400).json({ success: false, message: 'Cannot transfer to same account.' });

        const sender = db.prepare(`SELECT balance FROM accounts WHERE accountNumber = ?`).get(senderAcc);
        const recipient = db.prepare(`SELECT balance FROM accounts WHERE accountNumber = ?`).get(recipientAcc);

        if (!sender) return res.status(404).json({ success: false, message: 'Sender account not found.' });
        if (!recipient) return res.status(404).json({ success: false, message: 'Recipient account not found.' });
        if (amount > sender.balance) return res.status(400).json({ success: false, message: 'Insufficient balance.' });

        const newSenderBal = sender.balance - parseFloat(amount);
        const newRecipientBal = recipient.balance + parseFloat(amount);

        db.prepare(`UPDATE accounts SET balance = ? WHERE accountNumber = ?`).run(newSenderBal, senderAcc);
        db.prepare(`UPDATE accounts SET balance = ? WHERE accountNumber = ?`).run(newRecipientBal, recipientAcc);

        const txnId = 'TXN-' + Date.now();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        db.prepare(`INSERT INTO transactions VALUES (?, ?, 'TRANSFER', ?, ?, 'SUCCESS', ?)`)
          .run(txnId, senderAcc, amount, newSenderBal, timestamp);

        res.json({ success: true, newBalance: newSenderBal, transactionId: txnId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Micro-Philanthropy Donation
app.post('/api/atm/donate', (req, res) => {
    try {
        const { accountNumber, amount, cause } = req.body;
        if (amount <= 0) return res.status(400).json({ success: false, message: 'Invalid donation amount.' });

        const account = db.prepare(`SELECT balance FROM accounts WHERE accountNumber = ?`).get(accountNumber);
        if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });
        if (amount > account.balance) return res.status(400).json({ success: false, message: 'Insufficient balance.' });

        const newBalance = account.balance - parseFloat(amount);
        db.prepare(`UPDATE accounts SET balance = ? WHERE accountNumber = ?`).run(newBalance, accountNumber);

        const txnId = 'DONATE-' + Date.now();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        db.prepare(`INSERT INTO transactions VALUES (?, ?, ?, ?, ?, 'SUCCESS', ?)`)
          .run(txnId, accountNumber, `DONATION (${cause})`, amount, newBalance, timestamp);

        res.json({ success: true, newBalance, transactionId: txnId, message: `Thank you for donating ₹${amount} to ${cause}!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Change PIN
app.post('/api/atm/change-pin', (req, res) => {
    try {
        const { accountNumber, oldPin, newPin } = req.body;
        const account = db.prepare(`SELECT * FROM accounts WHERE accountNumber = ?`).get(accountNumber);

        if (!account || account.pin !== oldPin) {
            return res.status(401).json({ success: false, message: 'Incorrect old PIN.' });
        }
        if (!newPin || newPin.length < 4) {
            return res.status(400).json({ success: false, message: 'PIN must be at least 4 digits.' });
        }

        db.prepare(`UPDATE accounts SET pin = ? WHERE accountNumber = ?`).run(newPin, accountNumber);
        res.json({ success: true, message: 'PIN updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Get Transaction History Stack
app.get('/api/atm/history/:accNum', (req, res) => {
    try {
        const { accNum } = req.params;
        const rows = db.prepare(`SELECT * FROM transactions WHERE accountNumber = ? ORDER BY timestamp DESC LIMIT 20`).all(accNum);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Smart Queue Endpoints (FIFO Queue Simulation)
app.get('/api/atm/queue', (req, res) => {
    res.json(branchQueue);
});

app.post('/api/atm/queue/take', (req, res) => {
    const { name, service } = req.body;
    const ticketNum = `Q-${100 + branchQueue.length + 1}`;
    const newEntry = { ticket: ticketNum, name: name || 'Valued Customer', service: service || 'General ATM / Cash' };
    branchQueue.push(newEntry);
    res.json({ success: true, ticket: ticketNum, position: branchQueue.length });
});

app.listen(PORT, () => {
    console.log(`[NEXUS BACKEND] Express server running on http://localhost:${PORT}`);
});