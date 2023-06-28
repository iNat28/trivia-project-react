#include "pch.h"
#include "Server.h"
#include "WSAInitializer.h"

int main()
{
	try
	{
		WSAInitializer wsainitializer;
		Server server;

		server.run();
	}
	catch (const std::exception& e)
	{
		std::cerr << e.what() << std::endl;
	}

	return 0;
}