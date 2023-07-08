export type TokenType = string;

function getToken() {
    return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)) as TokenType;
}

export function generateToken(tokens: Map<TokenType, unknown>) {
    let token = getToken();
    let i = 10;

    do {
        token = getToken();
    } while (tokens.has(token) && i-- > 0);

    if (i <= 0) {
        throw Error('Unable to generate new token');
    }

    return token;
}
