
#include "assert.h"


TestSuite* ASSERT_DESCRIBE_SUITE(char* name) {
  TestSuite* testSuite = malloc(sizeof(TestSuite));
  testSuite->name = name;
  testSuite->list = linkedListInit();
  return testSuite;
}

void ASSERT_ADD_TEST(TestSuite* testSuite, void(*func)()) {
  
}

void ASSERT_TRUE(bool val) {

}
