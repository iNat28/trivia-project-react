#include "pch.h"
#include "AllRoomMembersRequestHandler.h"

AllRoomMembersRequestHandler::AllRoomMembersRequestHandler(LoggedUser& user, Room& room) :
	LoggedUserRequestHandler(user), m_room(room)
{
}

//getting room state of room
Buffer AllRoomMembersRequestHandler::_getRoomStateNoHandler(RequestInfo& requestInfo)
{
	return JsonResponsePacketSerializer::serializeResponse(
		GetRoomStateResponse(
			this->m_room.getRoomStatus(),
			this->m_room.getAllUsers()
		)
	);
}