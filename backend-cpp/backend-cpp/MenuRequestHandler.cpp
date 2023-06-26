#include "pch.h"
#include "MenuRequestHandler.h"

MenuRequestHandler::MenuRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user) :
	LoggedUserRequestHandler(user), m_handlerFactory(handlerFactory)
{
}

RequestResult MenuRequestHandler::handleRequest(RequestInfo& requestInfo)
{
	return this->handleAllRequests(requestInfo, *this, this->m_requests);
}

RequestResult MenuRequestHandler::_signout(RequestInfo& requestInfo)
{
	//Throws an Exception if the login doesn't work
	this->m_handlerFactory.getLoginManager().logout(this->m_user);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			LogoutResponse()
		),
		this->m_handlerFactory.createLoginRequestHandler()
	);
}

RequestResult MenuRequestHandler::_getRooms(RequestInfo& requestInfo)
{
	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			GetRoomResponse(this->m_handlerFactory.getRoomManager().getRooms())
		),
		requestInfo.currentHandler
	);
}

RequestResult MenuRequestHandler::_getPlayersInRoom(RequestInfo& requestInfo)
{
	GetPlayersInRoomRequest::RoomIdRequest getPlayersInRoomRequest = JsonRequestPacketDeserializer::deserializeRoomIdRequest(requestInfo.buffer);

	return RequestResult(
			JsonResponsePacketSerializer::serializeResponse(
				GetPlayersInRoomResponse(this->m_handlerFactory.getRoomManager().getUsersInRoom(getPlayersInRoomRequest.roomId))
		),
		requestInfo.currentHandler
	);
}

RequestResult MenuRequestHandler::_getUserStats(RequestInfo& requestInfo)
{
	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			GetUserStatsResponse(this->m_handlerFactory.getStatisticsManager().getUserStats(this->m_user))
		),
		requestInfo.currentHandler
	);
}

RequestResult MenuRequestHandler::_getHighScores(RequestInfo& requestInfo)
{
	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			GetHighScoresResponse(this->m_handlerFactory.getStatisticsManager().getHighScores())
		),
		requestInfo.currentHandler
	);
}

RequestResult MenuRequestHandler::_joinRoom(RequestInfo& requestInfo)
{
	JoinRoomRequest::RoomIdRequest joinRoomRequest = JsonRequestPacketDeserializer::deserializeRoomIdRequest(requestInfo.buffer);

	this->m_handlerFactory.getRoomManager().getRoom(joinRoomRequest.roomId).addUser(this->m_user);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			JoinRoomResponse()
		),
		this->m_handlerFactory.createRoomMemberRequestHandler(
			this->m_user,
			this->m_handlerFactory.getRoomManager().getRoom(joinRoomRequest.roomId)
		)
	);
}

RequestResult MenuRequestHandler::_createRoom(RequestInfo& requestInfo)
{
	CreateRoomRequest createRoomRequest = JsonRequestPacketDeserializer::deserializeCreateRoomRequest(requestInfo.buffer);

	this->m_handlerFactory.getRoomManager().createRoom(createRoomRequest.room);
	
	Room& room = this->m_handlerFactory.getRoomManager().getRoom(createRoomRequest.room.getId());
	room.addUser(this->m_user);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			CreateRoomResponse()
		),
		this->m_handlerFactory.createRoomAdminRequestHandler(this->m_user, room)
	);
}

const umap<Codes, MenuRequestHandler::requests_func_t> MenuRequestHandler::m_requests = {
	{ Codes::LOGOUT, &MenuRequestHandler::_signout },
	{ Codes::GET_ROOM, &MenuRequestHandler::_getRooms },
	{ Codes::GET_PLAYERS_IN_ROOM, &MenuRequestHandler::_getPlayersInRoom },
	{ Codes::USER_STATS, &MenuRequestHandler::_getUserStats },
	{ Codes::HIGH_SCORES, &MenuRequestHandler::_getHighScores },
	{ Codes::JOIN_ROOM, &MenuRequestHandler::_joinRoom },
	{ Codes::CREATE_ROOM, &MenuRequestHandler::_createRoom }
};