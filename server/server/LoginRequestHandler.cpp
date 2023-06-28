#include "pch.h"
#include "LoginRequestHandler.h"

LoginRequestHandler::LoginRequestHandler(RequestHandlerFactory& handlerFactory) :
	m_handlerFactory(handlerFactory)
{
}

RequestResult LoginRequestHandler::handleRequest(RequestInfo& requestInfo)
{
	return this->handleAllRequests(requestInfo, *this, this->m_requests);
}

RequestResult LoginRequestHandler::_login(RequestInfo& requestInfo)
{
	LoginRequest loginRequest = JsonRequestPacketDeserializer::deserializeLoginRequest(requestInfo.buffer);
	
	//Throws an Exception if the login doesn't work
	this->m_handlerFactory.getLoginManager().login(loginRequest.username, loginRequest.password);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			LoginResponse()
		),
		this->m_handlerFactory.createMenuRequestHandler(this->m_handlerFactory.getLoginManager().getUser(loginRequest.username))
	);
}

RequestResult LoginRequestHandler::_signup(RequestInfo& requestInfo)
{
	SignupRequest signupRequest = JsonRequestPacketDeserializer::deserializeSignupRequest(requestInfo.buffer);

	//Throws an Exception if the signup doesn't work
	this->m_handlerFactory.getLoginManager().signup(signupRequest.username, signupRequest.password, signupRequest.email);

	return RequestResult(
		JsonResponsePacketSerializer::serializeResponse(
			SignupResponse()
		),
		this->m_handlerFactory.createMenuRequestHandler(this->m_handlerFactory.getLoginManager().getUser(signupRequest.username))
	);
}

const umap<Codes, LoginRequestHandler::requests_func_t> LoginRequestHandler::m_requests = {
	{ Codes::LOGIN, &LoginRequestHandler::_login },
	{ Codes::SIGNUP, &LoginRequestHandler::_signup }
};