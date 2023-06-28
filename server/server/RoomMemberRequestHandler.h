#pragma once
#include "AllRoomMembersRequestHandler.h"
#include "RequestHandlerFactory.h"

class RoomMemberRequestHandler :
	public AllRoomMembersRequestHandler
{
public:
	RoomMemberRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user, Room& room);

	virtual RequestResult handleRequest(RequestInfo& requestInfo) override;
private:
	using requests_func_t = RequestResult(RoomMemberRequestHandler::*)(RequestInfo&);
	static const umap<Codes, RoomMemberRequestHandler::requests_func_t> m_requests;
	RequestHandlerFactory& m_handlerFactory;

	RequestResult _leaveRoom(RequestInfo& requestInfo);
	RequestResult _getRoomState(RequestInfo& requestInfo);
};