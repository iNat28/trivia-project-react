#include "pch.h"
#include "Server.h"

Server::Server() : m_database(make_shared<SqliteDataBase>()), m_handlerFactory(*m_database), m_communicator(*m_database)
{
}

void Server::run()
{
	std::thread t_connector(Server::adminInput);
	t_connector.detach();

	this->m_communicator.startHandleRequests();
}

void Server::adminInput()
{
	std::string input;

	while (input != "EXIT")
	{
		std::cin >> input;
	}

	//Closes the whole program
	std::exit(EXIT_SUCCESS);
}