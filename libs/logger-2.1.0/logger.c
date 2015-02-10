#include "logger.h"

#ifdef __MACH__
#include <sys/time.h>

#define CLOCK_REALTIME 0
//clock_gettime is not implemented on OSX
int clock_gettime(int clk_id, struct timespec* t) {
    struct timeval now;
    int rv = gettimeofday(&now, NULL);
    if (rv) return rv;
    t->tv_sec  = now.tv_sec;
    t->tv_nsec = now.tv_usec * 1000;
    return 0;
}
#endif

const unsigned int LOG_TIME_FMT = strlen("2012-12-31 12:59:59.123") + 1;

const char* LOG_LEVEL_STRINGS[] = {"DEBUG\0",
                                   "INFO\0",
                                   "WARN\0",
                                   "ERROR\0",
                                   "FATAL\0"};

Logger * Logger_create( void )
{
    Logger *l = (Logger *)malloc(sizeof(Logger));
    if ( l == NULL )
        return NULL;

    l->level = LOG_INFO;
    l->fp    = stdout;

    return l;
}

void Logger_free(Logger *l)
{
    if ( l != NULL ) {
        if ( fileno(l->fp) != STDOUT_FILENO )
            fclose(l->fp);
        free(l);
    }
}

void log_add(Logger *l, int level, const char *msg)
{
    if (level < l->level) return;

    char timestr[LOG_TIME_FMT];
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    logger_timespec2str(timestr, LOG_TIME_FMT, &ts);
    fprintf(l->fp, "%s [%s] %s\n",
            timestr,
            LOG_LEVEL_STRINGS[level],
            msg);
}

void log_debug(Logger *l, const char *fmt, ...)
{
    va_list ap;
    char msg[LOG_MAX_MSG_LEN];

    va_start(ap, fmt);
    vsnprintf(msg, sizeof(msg), fmt, ap);
    log_add(l, LOG_DEBUG, msg);
    va_end(ap);
}

void log_info(Logger *l, const char *fmt, ...)
{
    va_list ap;
    char msg[LOG_MAX_MSG_LEN];

    va_start(ap, fmt);
    vsnprintf(msg, sizeof(msg), fmt, ap);
    log_add(l, LOG_INFO, msg);
    va_end(ap);
}

void log_warn(Logger *l, const char *fmt, ...)
{
    va_list ap;
    char msg[LOG_MAX_MSG_LEN];

    va_start(ap, fmt);
    vsnprintf(msg, sizeof(msg), fmt, ap);
    log_add(l, LOG_WARN, msg);
    va_end(ap);
}

void log_error(Logger *l, const char *fmt, ...)
{
    va_list ap;
    char msg[LOG_MAX_MSG_LEN];

    va_start(ap, fmt);
    vsnprintf(msg, sizeof(msg), fmt, ap);
    log_add(l, LOG_ERROR, msg);
    va_end(ap);
}

int logger_timespec2str(char *buf, unsigned int len, struct timespec *ts) {
    int ret;
    struct tm t;

    tzset();
    if (localtime_r(&(ts->tv_sec), &t) == NULL)
        return 1;

    ret = strftime(buf, len, "%F %T", &t);
    if (ret == 0)
        return 2;
    len -= ret - 1;

    ret = snprintf(&buf[strlen(buf)], len, ".%03ld", ts->tv_nsec/1000000);
    if (ret >= len)
        return 3;

    return 0;
}
