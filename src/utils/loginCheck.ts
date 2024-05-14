export function isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
}