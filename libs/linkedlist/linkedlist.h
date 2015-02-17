

#ifndef __LINKEDLIST_H_
#define __LINKEDLIST_H_

#define printError(fmt, ...) printf("%s:%d: " fmt, __FILE__, __LINE__, __VA_ARGS__);

#include <stddef.h>
#include <stdio.h>

typedef struct LinkedListElement {
  struct LinkedListElement* next;
  struct LinkedListElement* previous;
  void* data;
} LinkedListElement;

typedef struct LinkedList {
  Element* firstElement;
  Element* lastElement;
  unsigned int size;
} LinkedList;

List* initLinkedList();

/** Adds a new element to the end, and returns the new length */
unsigned int push(LinkedList* list, void* data);

/** Removes the last element, and returns that element */
void* linkedListPop(LinkedList* list);

/** Removes the first element, and returns that element */
void* linkedListShift(LinkedList* list);

#endif
