#include <stdio.h>
#include "logger.h"

int main( int argc, const char* argv[] ) {
  Logger *l = Logger_create();
  l->level = LOG_DEBUG;

  log_info(l, "Hello world");
  
  Logger_free(l);
}
