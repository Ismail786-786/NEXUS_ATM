#include "../include/ATMEngine.h"
#include <iostream>
#include <ctime>
#include <iomanip>
#include <sstream>

ATMEngine::ATMEngine(const Account& acc, double initialCashInventory)
    : currentAccount(acc), atmCashInventory(initialCashInventory), transactionCounter(1000) {}

std::string ATMEngine::generateTransactionId() {
    transactionCounter++;
    return "TXN-" + std::to_string(transactionCounter);
}

std::string ATMEngine::getCurrentTimestamp() {
    std::time_t t = std::time(nullptr);
    std::tm* now = std::localtime(&t);
    std::ostringstream ss;
    ss << std::put_time(now, "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

bool ATMEngine::login(const std::string& accNum, const std::string& enteredPin) {
    if (currentAccount.isLocked) {
        std::cout << "[SECURITY] Account is locked due to multiple failed login attempts.\n";
        return false;
    }

    if (currentAccount.accountNumber == accNum) {
        if (currentAccount.pin == enteredPin) {
            currentAccount.failedAttempts = 0;
            std::cout << "[AUTH] Login successful for Account: " << accNum << "\n";
            return true;
        } else {
            currentAccount.failedAttempts++;
            std::cout << "[AUTH] Invalid PIN. Failed attempts: " << currentAccount.failedAttempts << "/3\n";
            if (currentAccount.failedAttempts >= 3) {
                currentAccount.isLocked = true;
                std::cout << "[SECURITY] Maximum attempts reached. Account has been locked.\n";
            }
            return false;
        }
    }
    std::cout << "[AUTH] Account not found.\n";
    return false;
}

void ATMEngine::logout() {
    std::cout << "[AUTH] Session closed for Account: " << currentAccount.accountNumber << "\n";
}

bool ATMEngine::isAccountLocked() const {
    return currentAccount.isLocked;
}

double ATMEngine::getBalance() const {
    return currentAccount.balance;
}

bool ATMEngine::deposit(double amount) {
    if (amount <= 0) {
        std::cout << "[ERROR] Deposit amount must be greater than zero.\n";
        return false;
    }

    currentAccount.balance += amount;
    std::string txnId = generateTransactionId();
    std::string timeStr = getCurrentTimestamp();

    // Push transaction to Custom Stack (LIFO)
    transactionStack.push(Transaction(txnId, "DEPOSIT", amount, currentAccount.balance, "SUCCESS", timeStr));
    std::cout << "[SUCCESS] Deposited Rs." << amount << " | New Balance: Rs." << currentAccount.balance << "\n";
    return true;
}

bool ATMEngine::withdraw(double amount) {
    if (amount <= 0) {
        std::cout << "[ERROR] Withdrawal amount must be greater than zero.\n";
        return false;
    }
    if (amount > currentAccount.balance) {
        std::cout << "[FAILED] Insufficient balance for withdrawal.\n";
        std::string txnId = generateTransactionId();
        transactionStack.push(Transaction(txnId, "WITHDRAWAL", amount, currentAccount.balance, "FAILED", getCurrentTimestamp()));
        return false;
    }
    if (amount > atmCashInventory) {
        std::cout << "[FAILED] ATM has insufficient cash inventory to dispense this amount.\n";
        std::string txnId = generateTransactionId();
        transactionStack.push(Transaction(txnId, "WITHDRAWAL", amount, currentAccount.balance, "FAILED", getCurrentTimestamp()));
        return false;
    }

    currentAccount.balance -= amount;
    atmCashInventory -= amount;
    std::string txnId = generateTransactionId();
    std::string timeStr = getCurrentTimestamp();

    // Push transaction to Custom Stack (LIFO)
    transactionStack.push(Transaction(txnId, "WITHDRAWAL", amount, currentAccount.balance, "SUCCESS", timeStr));
    std::cout << "[SUCCESS] Withdrew Rs." << amount << " | Remaining Balance: Rs." << currentAccount.balance << "\n";
    return true;
}

bool ATMEngine::transfer(double recipientAccNum, double amount) {
    if (amount <= 0 || amount > currentAccount.balance) {
        std::cout << "[FAILED] Transfer failed: Invalid amount or insufficient balance.\n";
        return false;
    }

    currentAccount.balance -= amount;
    std::string txnId = generateTransactionId();
    std::string timeStr = getCurrentTimestamp();

    transactionStack.push(Transaction(txnId, "TRANSFER", amount, currentAccount.balance, "SUCCESS", timeStr));
    std::cout << "[SUCCESS] Transferred Rs." << amount << " to Account #" << recipientAccNum << " | Balance: Rs." << currentAccount.balance << "\n";
    return true;
}

void ATMEngine::enqueueCustomerRequest(const std::string& customerId, const std::string& requestType) {
    customerQueue.enqueue(customerId, requestType);
    std::cout << "[QUEUE] Customer " << customerId << " (" << requestType << ") added to service queue.\n";
}

void ATMEngine::processNextCustomerInQueue() {
    if (customerQueue.isEmpty()) {
        std::cout << "[QUEUE] No customers waiting in line.\n";
        return;
    }
    QueueNode frontCust = customerQueue.front();
    customerQueue.dequeue();
    std::cout << "[QUEUE] Serving customer ID: " << frontCust.customerId << " for [" << frontCust.requestType << "].\n";
}

int ATMEngine::getQueueSize() const {
    return customerQueue.size();
}

int ATMEngine::getTransactionCount() const {
    return transactionStack.size();
}

Stack& ATMEngine::getTransactionHistory() {
    return transactionStack;
}

double ATMEngine::getAtmCashInventory() const {
    return atmCashInventory;
}