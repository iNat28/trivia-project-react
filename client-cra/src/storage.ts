import { LoginInfo } from './socket';

export function storeUserInfo(loginInfo: LoginInfo) {
    console.log('storing', loginInfo);
    sessionStorage.setItem('user', JSON.stringify(loginInfo));
}

export function lookupUserInfo(): LoginInfo | undefined {
    const userInfoStr = sessionStorage.getItem('user');
    if (!userInfoStr) {
        return undefined;
    }
    console.log(JSON.parse(userInfoStr));
    return JSON.parse(userInfoStr);
}
