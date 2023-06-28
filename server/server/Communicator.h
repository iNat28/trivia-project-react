
#pragma once
#include "pch.h"
#include "Exception.h"
#include "IRequestHandler.h"
#include "RequestHandlerFactory.h"
#include "LoginRequestHandler.h"
#include "MenuRequestHandler.h"

#pragma comment(lib, "Ws2_32.lib")

#define ADDRESS "127.0.0.1"
#define PORT 40200
#define CLIENT_MSG "Hello"
#define CLIENT_BUFFER_MAX 5

class Communicator
{
public:
	Communicator(IDatabase& database);

	void startHandleRequests();
private:
	umap<SOCKET, sptr<IRequestHandler>> m_clients;
	RequestHandlerFactory m_handlerFactory;
	SOCKET m_serverSocket;

	void _bindAndListen();
	friend void s_handleNewClient(Communicator& communicator, SOCKET socket, sptr<IRequestHandler> handler);
	static void s_getFromSocket(SOCKET socket, char* buffer, int length);
	static void s_sendToSocket(SOCKET socket, char* buffer, int length);
};