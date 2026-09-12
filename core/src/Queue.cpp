#include "../include/Queue.h"
#include <stdexcept>

Queue::Queue() : frontNode(nullptr), rearNode(nullptr), count(0) {}

Queue::~Queue() {
    clear();
}

// Add a customer request to the rear of the queue (FIFO)
void Queue::enqueue(const std::string& customerId, const std::string& requestType) {
    QueueNode* newNode = new QueueNode(customerId, requestType);
    if (rearNode == nullptr) {
        // If queue is empty, front and rear both point to the new node
        frontNode = rearNode = newNode;
    } else {
        rearNode->next = newNode;
        rearNode = newNode;
    }
    count++;
}

// Remove the customer request from the front of the queue
void Queue::dequeue() {
    if (isEmpty()) {
        throw std::underflow_error("Queue Underflow: No customers to dequeue.");
    }
    QueueNode* temp = frontNode;
    frontNode = frontNode->next;

    // If front becomes null, rear must also become null
    if (frontNode == nullptr) {
        rearNode = nullptr;
    }
    delete temp;
    count--;
}

// View the customer request at the front without removing it
QueueNode Queue::front() const {
    if (isEmpty()) {
        throw std::underflow_error("Queue is empty: No customer at the front.");
    }
    return *frontNode;
}

// Check if the queue is empty
bool Queue::isEmpty() const {
    return frontNode == nullptr;
}

// Get the total number of customers waiting in the queue
int Queue::size() const {
    return count;
}

// Clear all queue nodes to prevent memory leaks
void Queue::clear() {
    while (!isEmpty()) {
        dequeue();
    }
}