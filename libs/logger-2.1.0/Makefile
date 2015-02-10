# Logger Makefile
uname_S := $(shell sh -c 'uname -s 2>/dev/null || echo not')

CC=gcc
AR=ar rcs
CFLAGS=-Wall -W -Wstrict-prototypes -Wwrite-strings
DEBUG?=-g -ggdb

LIBNAME=liblogger
MAJOR_VERSION := $(shell cat VERSION |cut -d\. -f1)
MINOR_VERSION := $(shell cat VERSION |cut -d\. -f2)

STLIBNAME=$(LIBNAME).a
STLIB_MAKE_CMD=$(CC) -o $(STLIBNAME) $(LDFLAGS)

DYLIBNAME=$(LIBNAME).so
DYLIB_MINOR_NAME=$(DYLIBNAME).$(MAJOR_VERSION).$(MINOR_VERSION)
DYLIB_MAJOR_NAME=$(DYLIBNAME).$(MAJOR_VERSION)
ifeq ($(uname_S),Darwin)
	DYLIBNAME=$(LIBNAME).dylib
	DYLIB_MAKE_CMD=$(CC) -dynamiclib -Wl,-install_name,$(DYLIB_MINOR_NAME) \
    		-o $(DYLIB_MINOR_NAME)
else
	DYLIB_MAKE_CMD=$(CC) -shared -Wl,-soname,$(DYLIB_MINOR_NAME) \
		-o $(DYLIB_MINOR_NAME)
endif

SRC=logger.c
OBJ=$(SRC:.c=.o)
PREFIX?=/usr/local
INSTALL_LIB_PATH=$(PREFIX)/lib
INSTALL_INCLUDE_PATH=$(PREFIX)/include
INSTALL?= cp -a

all: $(DYLIBNAME) $(STLIBNAME)
    
$(DYLIBNAME): $(DYLIB_MAJOR_NAME)
	ln -sf $< $@

$(DYLIB_MINOR_NAME): $(OBJ)
	$(DYLIB_MAKE_CMD) $<

$(DYLIB_MAJOR_NAME): $(DYLIB_MINOR_NAME)
	ln -sf $< $@

$(STLIBNAME): $(OBJ)
	$(AR) $(STLIBNAME) $<

.c.o:
	$(CC) $(CFLAGS) -fPIC -c $< -o $@

install: $(DYLIBNAME)
	mkdir -p $(INSTALL_INCLUDE_PATH) $(INSTALL_LIB_PATH)
	$(INSTALL) logger.h 	$(INSTALL_INCLUDE_PATH)
	$(INSTALL) $(DYLIBNAME) $(INSTALL_LIB_PATH)/$(DYLIB_MINOR_NAME)	
	cd $(INSTALL_LIB_PATH) && ln -sf $(DYLIB_MAJOR_NAME) $(DYLIB_MAJOR_NAME)
	cd $(INSTALL_LIB_PATH) && ln -sf $(DYLIB_MINOR_NAME) $(DYLIBNAME)

#test:
	#$(CC) $(CFLAGS) -g -ggdb test.c -o test -L. -llogger

clean:
	rm -f $(DYLIBNAME) $(DYLIB_MINOR_NAME) $(DYLIB_MAJOR_NAME) $(STLIBNAME) $(OBJ)
