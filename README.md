### config.js
```js
module.exports = {
    server: {
        port: 8801,
        signKey: 'JA00FOg$u2dhF6m2siAnuVYu4xR1bO@k',
        sessionKey: 'DS@7rfvsq70XSPyoZ3bjdpKOiM3UE8OR',
        mongoUri: 'mongodb+srv://admin:admin@arma3italy-eufgo.mongodb.net/test?retryWrites=true'
    },
    steam: {
        verify: 'http://localhost:8801/auth/steam/return',
        realm: 'http://localhost:8801/auth/',
        apiKey: '8E5D5A4C69D001BA20C1B71834DD0C56',
        useSession: false
    }
}
```