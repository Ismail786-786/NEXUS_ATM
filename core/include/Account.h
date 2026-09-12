#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

struct Account {
    std::string accountNumber;
    std::string pin;
    double balance;
    int failedAttempts;
    bool isLocked;

    Account(std::string accNum, std::string p, double bal)
        : accountNumber(accNum), pin(p), balance(bal), failedAttempts(0), isLocked(false) {}
};

#endif // ACCOUNT_H