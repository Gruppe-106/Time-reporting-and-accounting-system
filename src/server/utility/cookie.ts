export function getCookies(cookieString: string): Map<string, string> {
    let cookies: Map<string, string> = new Map<string, string>();
    for (const cookie of cookieString.split("; ")) {
        let data = cookie.trim().split('=')
        cookies.set(data[0], data[1]);
    }
    return cookies;
}