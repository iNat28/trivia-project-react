#include "pch.h"
#include "JsonResponsePacketSerializer.h"

Buffer JsonResponsePacketSerializer::serializeResponse(const Response& response)
{
	//Fills the buffer of size 5
	Buffer buffer(5);
	buffer[0] = static_cast<Byte>(response.getResponseCode());

	return buffer;
}

Buffer JsonResponsePacketSerializer::serializeResponse(const ErrorResponse& errResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::message] = errResponse.message;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, errResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetRoomResponse& getRoomResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::rooms] = getRoomResponse.rooms;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getRoomResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetPlayersInRoomResponse& getPlayersInRoomResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::playersInRoom] = getPlayersInRoomResponse.players;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getPlayersInRoomResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetUserStatsResponse& getUserStatsResponse)
{
	json jsonToSerialize;
	jsonToSerialize = getUserStatsResponse.userStats;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getUserStatsResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetHighScoresResponse& getHighScoresResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::highScores] = getHighScoresResponse.highScores;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getHighScoresResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetRoomStateResponse& getRoomStateResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::roomStatus] = getRoomStateResponse.roomStatus;
	jsonToSerialize[Keys::playersInRoom] = getRoomStateResponse.players;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getRoomStateResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetQuestionResponse& getQuestionResponse)
{
	json jsonToSerialize = getQuestionResponse.question;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getQuestionResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const SubmitAnswerResponse& submitAnswerResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::correctAnswerIndex] = submitAnswerResponse.correctAnswerIndex;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, submitAnswerResponse);
}

Buffer JsonResponsePacketSerializer::serializeResponse(const GetGameResultsResponse& getGameResultsResponse)
{
	json jsonToSerialize;
	jsonToSerialize[Keys::playersResults] = getGameResultsResponse.playersResults;

	return JsonResponsePacketSerializer::serializeJson(jsonToSerialize, getGameResultsResponse);
}

Buffer JsonResponsePacketSerializer::serializeJson(const json& jsonToSerialize, const Response& response)
{
	std::vector<unsigned char> jsonBuffer = json::to_bson(jsonToSerialize);
	Buffer totalBuffer;
	char sizeBuffer[MSG_LEN_SIZE] = "";

	//Adds the response code
	totalBuffer.push_back(static_cast<Byte>(response.getResponseCode()));

	//Adds the json message with the number of bytes
	totalBuffer.insert(totalBuffer.end(), jsonBuffer.begin(), jsonBuffer.end());
	return totalBuffer;
}