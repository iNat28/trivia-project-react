
#pragma once
#include "pch.h"

/*
I wanted to create an exception class that was similar to std::cout, 
where someone could add something to the exception, and then throw it

This works by using Exception::ex, which being a stringstream allows just that

When an Exception object is created, it converts ex to a string, 
and uses it in the std::exception constructor and resets ex

Exception also has a string constructor 
which just passes the string to the parent std::exception
*/

class Exception : public std::exception
{
public:
	Exception();
	Exception(const char* str);

	static std::stringstream ex;
};

