'use strict';

function checkOAuth() {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken === null) {
        location.assign('/#access_expired=true');
    } else {
        const now = new Date();
        let expiresAt = localStorage.getItem('expires_at');
        expiresAt = new Date(expiresAt);
        if (now > expiresAt) {
            location.assign('/#access_expired=true');
        }
    }

    return accessToken;
}

// Google oauth required
let accessToken = checkOAuth();
console.log(accessToken);
