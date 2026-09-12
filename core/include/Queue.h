#ifndef QUEUE_H
#define QUEUE_H

#include <string>

// Node structure for the Linked List implementation of the Queue
struct QueueNode {
    std::string customerId;
    std::string requestType; // e.g., "WITHDRAWAL", "DEPOSIT", "BALANCE_CHECK"
    QueueNode* next;

    QueueNode(std::string id, std::string type) : customerId(id), requestType(type), next(nullptr) {}
};

class Queue {
private:
    QueueNode* frontNode; // Pointer to the front of the queue
    QueueNode* rearNode;  // Pointer to the rear of the queue
    int count;            // Track number of elements

public:
    Queue();
    ~Queue();

    void enqueue(const std::string& customerId, const std::string& requestType);
    void dequeue();
    QueueNode front() const;
    bool isEmpty() const;
    int size() const;
    void clear();
};

#endif // QUEUE_H