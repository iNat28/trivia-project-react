#pragma once
#include "pch.h"
#include "RequestHandlerFactory.h"
#include "IRequestHandler.h"
#include "JsonRequestPacketDeserializer.h"
#include "JsonResponsePacketSerializer.h"
#include "IDatabase.h"
#include "MenuRequestHandler.h"

class RequestHandlerFactory;

class LoginRequestHandler : public IRequestHandler
{
public:
	LoginRequestHandler(RequestHandlerFactory& handlerFactory);

	virtual RequestResult handleRequest(RequestInfo& requestInfo) override;
private:
	RequestHandlerFactory& m_handlerFactory;
	using requests_func_t = RequestResult (LoginRequestHandler::*)(RequestInfo&);
	static const umap<Codes, LoginRequestHandler::requests_func_t> m_requests;
	
	RequestResult _login(RequestInfo& requestInfo);
	RequestResult _signup(RequestInfo& requestInfo);
};