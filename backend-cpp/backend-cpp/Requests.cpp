#include "pch.h"
#include "Requests.h"

LoginRequest::LoginRequest(string username, string password) : 
	username(username), password(password)
{
}

SignupRequest::SignupRequest(string username, string password, string email) :
	email(email), LoginRequest(username, password)
{
}

RoomIdRequest::RoomIdRequest(unsigned int roomId) :
	roomId(roomId)
{
}

CreateRoomRequest::CreateRoomRequest(Room room) : 
	room(room)
{
}

SubmitAnswerRequest::SubmitAnswerRequest(unsigned int answerIndex, double answerTime) :
	answerIndex(answerIndex), answerTime(answerTime)
{
}
