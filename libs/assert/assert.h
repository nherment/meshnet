
#ifndef __ASSERT_H_
#define __ASSERT_H_

#include "linkedlist.h"

typedef struct TestSuite {
  char* name;
  LinkedList *list;
} TestSuite;

TestSuite* ASSERT_DESCRIBE_SUITE(char* name);
void ASSERT_ADD_TEST(TestSuite* testSuite, void(*func)());
void ASSERT_TRUE(bool val);

#endif
