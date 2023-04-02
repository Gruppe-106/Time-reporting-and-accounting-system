import forge from "node-forge";

export interface AuthKey {
    key: string,
    valid: number
}

function create(userId: number, timeValid: number = 1): AuthKey {
    let sha256: forge.md.sha256.MessageDigest = forge.md.sha256.create();
    let key: string = sha256.update(userId.toString() + Date.now().toString()).digest().toHex();
    let date: number = Date.now() + Date.UTC(1970, timeValid);

    return {key: key, valid: date};
}

export {create as authKeyCreate};