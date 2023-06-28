#include "pch.h"
#include "Exception.h"

std::stringstream Exception::ex;

Exception::Exception() : exception(ex.str().c_str())
{
	//Resets the exeption string stream
	ex.str("");
	ex.clear();
}

Exception::Exception(const char* str) : exception(str)
{
}