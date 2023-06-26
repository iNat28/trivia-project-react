#pragma once
#include "LoggedUserRequestHandler.h"

class AllRoomMembersRequestHandler :
	public LoggedUserRequestHandler
{
protected:
	AllRoomMembersRequestHandler(LoggedUser& user, Room& room);

	Room& m_room;

	Buffer _getRoomStateNoHandler(RequestInfo& requestInfo);
};

