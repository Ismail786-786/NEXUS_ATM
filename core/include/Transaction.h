#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>

struct Transaction {
    std::string transactionId;
    std::string type;          // e.g., "WITHDRAWAL", "DEPOSIT", "TRANSFER"
    double amount;
    double balanceAfter;
    std::string status;        // e.g., "SUCCESS", "FAILED"
    std::string timestamp;

    // Constructor for easy initialization
    Transaction(std::string id, std::string t, double amt, double bal, std::string stat, std::string time)
        : transactionId(id), type(t), amount(amt), balanceAfter(bal), status(stat), timestamp(time) {}
};

#endif // TRANSACTION_H