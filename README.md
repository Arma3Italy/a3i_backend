### config.js
```js
module.exports = {
    server: {
        port: 8801,
        signKey: string,
        sessionKey: string,
        mongoUri: mongoURI
    },
    steam: {
        verify: 'http://localhost:8801/auth/steam/return',
        realm: 'http://localhost:8801/auth/',
        apiKey: string,
        useSession: false
    }
}
```
