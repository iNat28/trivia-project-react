#pragma once
#include "Room.h"

struct LoginRequest
{
	LoginRequest(string username, string password);

	string username;
	string password;
};

struct SignupRequest : LoginRequest
{
	SignupRequest(string username, string password, string email);

	string email;
};

struct RoomIdRequest
{
	RoomIdRequest(unsigned int roomId);

	unsigned int roomId;
};

struct GetPlayersInRoomRequest : RoomIdRequest
{
	using RoomIdRequest::RoomIdRequest;
};

struct JoinRoomRequest : RoomIdRequest
{
	using RoomIdRequest::RoomIdRequest;
};

struct CreateRoomRequest
{
	CreateRoomRequest(Room room);

	Room room;
};

struct SubmitAnswerRequest
{
	SubmitAnswerRequest(unsigned int answerIndex, double answerTime);

	unsigned int answerIndex;
	double answerTime;
};