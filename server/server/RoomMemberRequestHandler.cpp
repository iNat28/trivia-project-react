#include "pch.h"
#include "RoomMemberRequestHandler.h"

RoomMemberRequestHandler::RoomMemberRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user, Room& room) :
	AllRoomMembersRequestHandler(user, room), m_handlerFactory(handlerFactory)
{
}

RequestResult RoomMemberRequestHandler::handleRequest(RequestInfo& requestInfo)
{
	return this->handleAllRequests(requestInfo, *this, this->m_requests);
}

RequestResult RoomMemberRequestHandler::_leaveRoom(RequestInfo& requestInfo)
{
	this->m_room.removeUser(this->m_user);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			LeaveRoomResponse()
		),
		this->m_handlerFactory.createMenuRequestHandler(this->m_user)
	);
}

RequestResult RoomMemberRequestHandler::_getRoomState(RequestInfo& requestInfo)
{
	Buffer resultBuffer = this->_getRoomStateNoHandler(requestInfo);

	switch (this->m_room.getRoomStatus())
	{
	case RoomStatus::OPEN:
		return RequestResult(
			resultBuffer,
			requestInfo.currentHandler
		);
	case RoomStatus::CLOSED:
		return RequestResult(
			resultBuffer,
			this->m_handlerFactory.createMenuRequestHandler(this->m_user)
		);
	case RoomStatus::GAME_STARTED:
		return RequestResult(
			resultBuffer,
			this->m_handlerFactory.createGameRequestHandler(
				this->m_user,
				this->m_handlerFactory.getGameManager().getGame(this->m_room)
			)
		);
	}

	throw Exception("Room status not found!");
}

const umap<Codes, RoomMemberRequestHandler::requests_func_t> RoomMemberRequestHandler::m_requests = {
	{ Codes::LEAVE_ROOM, &RoomMemberRequestHandler::_leaveRoom },
	{ Codes::GET_ROOM_STATE, &RoomMemberRequestHandler::_getRoomState }
};