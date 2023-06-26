#pragma once
#include "pch.h"
#include "RequestHandlerFactory.h"
#include "LoggedUserRequestHandler.h"
#include "Constants.h"
#include "LoggedUser.h"

class RequestHandlerFactory;

class MenuRequestHandler : public LoggedUserRequestHandler
{
public:
	MenuRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user);

	virtual RequestResult handleRequest(RequestInfo& requestInfo) override;
private:
	RequestHandlerFactory& m_handlerFactory;
	using requests_func_t = RequestResult(MenuRequestHandler::*)(RequestInfo&);
	static const umap<Codes, MenuRequestHandler::requests_func_t> m_requests;

	RequestResult _signout(RequestInfo& requestInfo);
	RequestResult _getRooms(RequestInfo& requestInfo);
	RequestResult _getPlayersInRoom(RequestInfo& requestInfo);
	RequestResult _getUserStats(RequestInfo& requestInfo);
	RequestResult _getHighScores(RequestInfo& requestInfo);
	RequestResult _joinRoom(RequestInfo& requestInfo);
	RequestResult _createRoom(RequestInfo& requestInfo);
};
