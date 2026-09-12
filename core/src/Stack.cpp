#include "../include/Stack.h"
#include <stdexcept>

Stack::Stack() : topNode(nullptr), count(0) {}

Stack::~Stack() {
    clear();
}

// Push a transaction onto the top of the stack (LIFO)
void Stack::push(const Transaction& transaction) {
    StackNode* newNode = new StackNode(transaction);
    newNode->next = topNode;
    topNode = newNode;
    count++;
}

// Remove and return the top transaction
Transaction Stack::pop() {
    if (isEmpty()) {
        throw std::underflow_error("Stack Underflow: No transactions to pop.");
    }
    StackNode* temp = topNode;
    Transaction poppedData = temp->data;
    topNode = topNode->next;
    delete temp;
    count--;
    return poppedData;
}

// View the top transaction without removing it
Transaction Stack::peek() const {
    if (isEmpty()) {
        throw std::underflow_error("Stack is empty: No transaction to peek.");
    }
    return topNode->data;
}

// Check if the stack has no elements
bool Stack::isEmpty() const {
    return topNode == nullptr;
}

// Get the current number of transactions in the stack
int Stack::size() const {
    return count;
}

// Clear all elements to prevent memory leaks
void Stack::clear() {
    while (!isEmpty()) {
        StackNode* temp = topNode;
        topNode = topNode->next;
        delete temp;
    }
    count = 0;
}