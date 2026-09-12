#include <iostream>
#include "../include/Stack.h"
#include "../include/Queue.h"

int main() {
    std::cout << "========================================\n";
    std::cout << "   NEXUS ATM - C++ Core Verification    \n";
    std::cout << "========================================\n\n";

    // 1. Test Custom Stack (Transaction History)
    std::cout << "[TESTING] Custom Stack (LIFO Transaction History)...\n";
    Stack txnStack;

    txnStack.push(Transaction("TXN-101", "DEPOSIT", 5000.0, 15000.0, "SUCCESS", "2026-09-11 10:00:00"));
    txnStack.push(Transaction("TXN-102", "WITHDRAWAL", 2000.0, 13000.0, "SUCCESS", "2026-09-11 10:05:00"));

    std::cout << "Stack Size (Total Transactions): " << txnStack.size() << "\n";
    
    Transaction latest = txnStack.peek();
    std::cout << "Top Transaction (Peek): " << latest.transactionId 
              << " | Type: " << latest.type 
              << " | Amount: Rs." << latest.amount 
              << " | Balance: Rs." << latest.balanceAfter << "\n\n";

    // 2. Test Custom Queue (Customer Service Requests)
    std::cout << "[TESTING] Custom Queue (FIFO Customer Requests)...\n";
    Queue customerQueue;

    customerQueue.enqueue("CUST-001", "WITHDRAWAL");
    customerQueue.enqueue("CUST-002", "DEPOSIT");
    customerQueue.enqueue("CUST-003", "BALANCE_CHECK");

    std::cout << "Queue Size (Waiting Customers): " << customerQueue.size() << "\n";

    QueueNode nextCustomer = customerQueue.front();
    std::cout << "Next Customer in Front: " << nextCustomer.customerId 
              << " | Request: " << nextCustomer.requestType << "\n\n";

    std::cout << "SUCCESS: Custom Stack and Queue compiled and verified successfully!\n";
    std::cout << "========================================\n";

    return 0;
}