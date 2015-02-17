
#include "linkedlist.h"
#include <stdlib.h>
#include <stdio.h>


List* linkedListInit() {
  return malloc(sizeof(List));
}

unsigned int linkedListPush(List* list, void* data) {

  if(list == NULL) {
    return 0;
  }

  LinkedListElement* element = malloc(sizeof(Element));
  if(list->lastElement != NULL) {
    element->previous = list->lastElement;
    element->data = data;
  } else {
    list->lastElement = element;
    list->firstElement = element;
  }
  list->lastElement = element;
  list->size ++;
  
  return list->size;
}

void* linkedListPop(LinkedList* list) {

  if(list == NULL) {
    return 0;
  }

  if(list->lastElement != NULL) {
    void* data = list->lastElement->data;
    list->lastElement->data = NULL;
    Element* removedElement = list->lastElement;
    list->lastElement = list->lastElement->previous;
    list->lastElement->next = NULL;
    free(removedElement);
    list->size --;
    return data;
  }
  
  return NULL;
}

void* linkedListShift(LinkedList* list) {

  if(list == NULL) {
    return 0;
  }

  if(list->firstElement != NULL) {
   
    void* data = list->firstElement->data;
    LinkedListElement* removedElement = list->firstElement;
    list->firstElement = list->firstElement->next;
    if(list->lastElement == removedElement) {
      list->lastElement = list->firstElement;
    }
    free(removedElement);
    list->size --;
    return data;
  }
  
  return NULL;
}
