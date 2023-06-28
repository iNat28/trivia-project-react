#pragma once
#include "LoggedUserRequestHandler.h"
#include "RequestHandlerFactory.h"

class RequestHandlerFactory;

class GameRequestHandler :
	public LoggedUserRequestHandler
{
public:
	GameRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user, Game& game);

	virtual RequestResult handleRequest(RequestInfo& requestInfo) override;
private:
	RequestHandlerFactory& m_handlerFactory;
	using requests_func_t = RequestResult(GameRequestHandler::*)(RequestInfo&);
	static const umap<Codes, GameRequestHandler::requests_func_t> m_requests;
	Game& m_game;

	RequestResult _getQuestion(RequestInfo& requestInfo);
	RequestResult _submitAnswer(RequestInfo& requestInfo);
	RequestResult _getGameResults(RequestInfo& requestInfo);
	RequestResult _leaveGame(RequestInfo& requestInfo);
	void _deleteGameIfEmpty();
};

