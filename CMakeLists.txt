cmake_minimum_required (VERSION 2.8)


project (Meshnet C)

file(GLOB_RECURSE Meshnet_HEADERS
  "src/*.h"
)
file(GLOB_RECURSE Meshnet_SOURCES
  "src/*.c"
)
file(GLOB_RECURSE Libs_HEADERS
  "libs/*.h"
)
file(GLOB_RECURSE Libs_SOURCES
  "libs/*.c"
)

add_executable(Meshnet ${Meshnet_SOURCES} ${Meshnet_HEADERS} ${Libs_SOURCES} ${Libs_HEADERS} )

include_directories( ${CMAKE_CURRENT_SOURCE_DIR}/libs/logger-2.1.0 )
