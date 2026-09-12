#ifndef ATM_ENGINE_H
#define ATM_ENGINE_H

#include "Account.h"
#include "Stack.h"
#include "Queue.h"
#include <string>

class ATMEngine {
private:
    Account currentAccount;
    Stack transactionStack;
    Queue customerQueue;
    double atmCashInventory; // Total physical cash inside the ATM machine
    int transactionCounter;

    std::string generateTransactionId();
    std::string getCurrentTimestamp();

public:
    ATMEngine(const Account& acc, double initialCashInventory);

    // Authentication & Session Management
    bool login(const std::string& accNum, const std::string& enteredPin);
    void logout();
    bool isAccountLocked() const;

    // Banking Operations
    double getBalance() const;
    bool deposit(double amount);
    bool withdraw(double amount);
    bool transfer(double recipientAccNum, double amount);

    // Queue & History integration
    void enqueueCustomerRequest(const std::string& customerId, const std::string& requestType);
    void processNextCustomerInQueue();
    int getQueueSize() const;
    int getTransactionCount() const;
    Stack& getTransactionHistory();
    double getAtmCashInventory() const;
};

#endif // ATM_ENGINE_H