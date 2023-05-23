import forge from "node-forge";

export interface AuthKey {
    key: string,
    valid: number
}

/**
 * Create a sha-256 string based on time and user id
 * @param {number} userId Id of user
 * @param {number} timeValid Amount of time it's valid in months
 * @return {{key: string, valid: number}} Returns key string a valid to date
 */
function create(userId: number, timeValid: number = 1): AuthKey {
    let sha256: forge.md.sha256.MessageDigest = forge.md.sha256.create();
    let key: string = sha256.update(userId.toString() + Date.now().toString()).digest().toHex();
    let date: number = Date.now() + Date.UTC(1970, timeValid);

    return {key: key, valid: date};
}

export {create as authKeyCreate};