cmake_minimum_required(VERSION 3.12)
project(NexusATM)

# Set C++ standard to C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories for headers
include_directories(core/include)

# Source files for the C++ Core engine
set(CORE_SOURCES
    core/src/Stack.cpp
    core/src/Queue.cpp
    core/src/main_cli.cpp
)

# Create the executable target
add_executable(nexus_atm ${CORE_SOURCES})