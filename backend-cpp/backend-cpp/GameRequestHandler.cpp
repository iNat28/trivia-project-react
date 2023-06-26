#include "pch.h"
#include "GameRequestHandler.h"

GameRequestHandler::GameRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user, Game& game) :
	LoggedUserRequestHandler(user), m_handlerFactory(handlerFactory), m_game(game)
{
}

RequestResult GameRequestHandler::handleRequest(RequestInfo& requestInfo)
{
	return this->handleAllRequests(requestInfo, *this, this->m_requests);
}

RequestResult GameRequestHandler::_getQuestion(RequestInfo& requestInfo)
{
	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			GetQuestionResponse(this->m_game.getQuestion(this->m_user))
		),
		requestInfo.currentHandler
	);
}

RequestResult GameRequestHandler::_submitAnswer(RequestInfo& requestInfo)
{
	SubmitAnswerRequest submitAnswerRequest = JsonRequestPacketDeserializer::deserializeSubmitAnswerRequest(requestInfo.buffer);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			SubmitAnswerResponse(this->m_game.submitAnswer(this->m_user, submitAnswerRequest.answerIndex, submitAnswerRequest.answerTime))
		),
		requestInfo.currentHandler
	);
}

RequestResult GameRequestHandler::_getGameResults(RequestInfo& requestInfo)
{
	GetGameResultsResponse getGameResultsResponse(this->m_game.getGameResults(this->m_user));
	
	this->_deleteGameIfEmpty();

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(getGameResultsResponse),
		this->m_handlerFactory.createMenuRequestHandler(this->m_user)
	);
}

RequestResult GameRequestHandler::_leaveGame(RequestInfo& requestInfo)
{
	this->_deleteGameIfEmpty();

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			LeaveGameResponse()
		),
		this->m_handlerFactory.createMenuRequestHandler(this->m_user)
	);
}

void GameRequestHandler::_deleteGameIfEmpty()
{
	this->m_game.removePlayer(this->m_user);

	if (this->m_game.allPlayersGotResults())
	{
		this->m_handlerFactory.getRoomManager().closeRoom(this->m_game.getRoom());
		this->m_handlerFactory.getGameManager().deleteGame(this->m_game);
	}
}

const umap<Codes, GameRequestHandler::requests_func_t> GameRequestHandler::m_requests = {
	{ Codes::GET_QUESTION, &GameRequestHandler::_getQuestion },
	{ Codes::SUBMIT_ANSWER, &GameRequestHandler::_submitAnswer },
	{ Codes::GET_GAME_RESULTS, &GameRequestHandler::_getGameResults },
	{ Codes::LEAVE_GAME, &GameRequestHandler::_leaveGame },
};
