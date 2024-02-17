//INFO: b64url compatible encoding/decoding

export function enc_b64url(aStr) { return btoa(aStr).replace(/\+/g,'-').replace(/\//g,'_').replace(/\=+$/m,'') }
export function enc_b64url_r(aStr) { return atob(aStr.replace(/-/g,'+').replace(/_/g,'/')) }


