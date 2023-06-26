#pragma once
#include "pch.h"
#include "Constants.h"
#include "Requests.h"
#include "Keys.h"

class JsonRequestPacketDeserializer
{
public:
	static LoginRequest deserializeLoginRequest(const Buffer& buffer);
	static SignupRequest deserializeSignupRequest(const Buffer& buffer);
	static RoomIdRequest deserializeRoomIdRequest(const Buffer& buffer);
	static CreateRoomRequest deserializeCreateRoomRequest(const Buffer& buffer);
	static SubmitAnswerRequest deserializeSubmitAnswerRequest(const Buffer& buffer);
};