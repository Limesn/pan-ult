cmake_minimum_required(VERSION 3.16)

if(CMAKE_SOURCE_DIR STREQUAL CMAKE_CURRENT_SOURCE_DIR)
    project(pan_ult_backend LANGUAGES CXX)
    set(CMAKE_CXX_STANDARD 17)
    set(CMAKE_CXX_STANDARD_REQUIRED ON)
endif()

file(GLOB_RECURSE BACKEND_SOURCES
    src/*.cpp
)

list(REMOVE_ITEM BACKEND_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp)

add_library(pan_ult_core STATIC ${BACKEND_SOURCES})
target_include_directories(pan_ult_core PUBLIC src include)

find_package(Drogon REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(MYSQLCLIENT REQUIRED IMPORTED_TARGET mysqlclient)
target_link_libraries(pan_ult_core PUBLIC
    Drogon::Drogon
    OpenSSL::SSL
    OpenSSL::Crypto
    PkgConfig::MYSQLCLIENT
    pthread
)

add_executable(pan_ult_server src/main.cpp)
target_link_libraries(pan_ult_server PRIVATE pan_ult_core)