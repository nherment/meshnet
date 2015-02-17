#include <stdio.h>
#include "logger.h"

#include "linkedlist.h"

typedef struct Command_t {
  unsigned int term;
  unsigned int nodeId;
  unsigned int prevLogIndex;
  unsigned int prevLogTerm;
  //logEntry* entries[],
  unsigned int commitIndex;
} Command_t;

void threadFunc(void *arg) {
  
//	Command_t *command = arg;
//	printf("command: %d\n", command->term);
  printf("command\n");
//  free(command);
}

void describe(void(*func)()) {
  if(func != NULL) {
    func();
  }
}

int main( int argc, const char* argv[] ) {
//  Logger *l = Logger_create();
//  l->level = LOG_DEBUG;
  List* l = initList();

  describe((void) { printf("hello world\n"); });
  {
    printf("BLOCK\n");
  }
  
//  Logger_free(l);
	return 0;
}

