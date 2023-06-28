#pragma once
#include "AllRoomMembersRequestHandler.h"
#include "RequestHandlerFactory.h"

class RoomAdminRequestHandler :
	public AllRoomMembersRequestHandler
{
public:
	RoomAdminRequestHandler(RequestHandlerFactory& handlerFactory, LoggedUser& user, Room& room);

	virtual RequestResult handleRequest(RequestInfo& requestInfo) override;
private:
	using requests_func_t = RequestResult(RoomAdminRequestHandler::*)(RequestInfo&);
	static const umap<Codes, RoomAdminRequestHandler::requests_func_t> m_requests;
	RequestHandlerFactory& m_handlerFactory;

	RequestResult _closeRoom(RequestInfo& requestInfo);
	RequestResult _startGame(RequestInfo& requestInfo);
	RequestResult _getRoomState(RequestInfo& requestInfo);
};