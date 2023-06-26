#include "pch.h"
#include "JsonRequestPacketDeserializer.h"

/*
Usage: this fucntion gets a vector of bytes and makes it into a login struct using deserialization.
Input: vector<Byte>.
Output: LoginRequest object.
*/
LoginRequest JsonRequestPacketDeserializer::deserializeLoginRequest(const Buffer& buffer)
{
	json jsonFromBson = json::from_bson(buffer);
	
	return LoginRequest(
		jsonFromBson[Keys::username],
		jsonFromBson[Keys::password]
	);
}
/*
Usage: this fucntion gets a vector of bytes and makes it into a signup struct using deserialization.
Input: vector<Byte>.
Output: SignupRequest object.
*/
SignupRequest JsonRequestPacketDeserializer::deserializeSignupRequest(const Buffer& buffer)
{
	json jsonFromBson = json::from_bson(buffer);
	
	return SignupRequest(
		jsonFromBson[Keys::username],
		jsonFromBson[Keys::password],
		jsonFromBson[Keys::email]
	);
}

RoomIdRequest JsonRequestPacketDeserializer::deserializeRoomIdRequest(const Buffer& buffer)
{
	json jsonFromBson = json::from_bson(buffer);

	return RoomIdRequest(
		jsonFromBson[Keys::roomId]
	);
}

CreateRoomRequest JsonRequestPacketDeserializer::deserializeCreateRoomRequest(const Buffer& buffer)
{
	json jsonFromBson = json::from_bson(buffer);

	return CreateRoomRequest(
		Room(RoomData(
			0,
			jsonFromBson[Keys::roomName],
			{ },
			jsonFromBson[Keys::maxPlayers],
			jsonFromBson[Keys::questionsCount],
			jsonFromBson[Keys::timePerQuestion]
		))
	);
}

SubmitAnswerRequest JsonRequestPacketDeserializer::deserializeSubmitAnswerRequest(const Buffer& buffer)
{
	json jsonFromBson = json::from_bson(buffer);

	return SubmitAnswerRequest(
		jsonFromBson[Keys::answerIndex],
		jsonFromBson[Keys::answerTime]
	);
}