find_package(GTest REQUIRED)

file(GLOB TEST_SOURCES unit/*.cpp)
add_executable(pan_ult_tests ${TEST_SOURCES})
target_link_libraries(pan_ult_tests PRIVATE
    pan_ult_core
    GTest::gtest
    GTest::gtest_main
)

add_test(NAME unit_tests COMMAND pan_ult_tests)