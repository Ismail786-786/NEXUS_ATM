#ifndef STACK_H
#define STACK_H

#include "Transaction.h"

// Node structure for the Linked List implementation of the Stack
struct StackNode {
    Transaction data;
    StackNode* next;

    StackNode(Transaction t) : data(t), next(nullptr) {}
};

class Stack {
private:
    StackNode* topNode; // Pointer to the top of the stack
    int count;          // Track the number of elements

public:
    Stack();
    ~Stack();

    void push(const Transaction& transaction);
    Transaction pop();
    Transaction peek() const;
    bool isEmpty() const;
    int size() const;
    void clear();
};

#endif // STACK_H