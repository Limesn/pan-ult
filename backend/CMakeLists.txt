file(GLOB_RECURSE BACKEND_SOURCES
    src/*.cpp
)

list(REMOVE_ITEM BACKEND_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp)

add_library(pan_ult_core STATIC ${BACKEND_SOURCES})
target_include_directories(pan_ult_core PUBLIC src include)

find_package(Drogon REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(mysqlclient REQUIRED)
target_link_libraries(pan_ult_core PUBLIC
    Drogon::Drogon
    OpenSSL::SSL
    OpenSSL::Crypto
    mysqlclient
    pthread
)

add_executable(pan_ult_server src/main.cpp)
target_link_libraries(pan_ult_server PRIVATE pan_ult_core)