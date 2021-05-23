const tmi = require('tmi.js');
const ws = require('ws');

const wss = new ws.Server({ 
    port: 7287,
    clientTracking: true
});
wss.on('listening', () => {
    console.log('wss active');
});
wss.on('connection', (ws, req) => {
    console.log('ws connected')
    ws.send('hello');
});
wss.on('close', function close() {
    console.log('wss shutdown');
});

const chat = new tmi.Client({
	channels: [ 'DustinKazi' ]
});

chat.connect();

chat.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}-${tags['color']}: ${message}`);
    let cmd = "name:" + `${tags['display-name']}:${tags['color']}`;
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(cmd);
        }
    });
});