
#ifndef _THREADPOOL_H_
#define _THREADPOOL_H_

#include <unistd.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <errno.h>
#include <time.h> 

typedef enum {
  PENDING,
  RUNNING,
  CANCELLED,
  SUCCEEDED,
  FAILED
} JobStatus;

typedef struct Job {
  pthread_mutex_t* mutex;
  void* function;
  JobStatus status;
} Job;

typedef struct threadpool {
  
} threadpool;


threadpool* threadPoolInit(int minThreads, int maxThreads);

void threadPoolQueueWork(threadpool* pool, void* function, void* args);

void threadPoolDestroy(threadpool* pool);

#endif
