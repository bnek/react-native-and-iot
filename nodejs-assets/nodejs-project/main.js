const Client = require('azure-iot-device').Client;
const Protocol = require('azure-iot-device-http').Http;
const Message = require('azure-iot-device').Message;
var rn_bridge = require('rn-bridge');

rn_bridge.channel.on('message', (msg) => {
    const message = generateMessage(msg);
    sendLog('Sending message: ' + message.getData());
    client.sendEvent(message);
});

function sendErr(theErr) {
    rn_bridge.channel.send('Err: ' + theErr);
}

function sendLog(theMsg) {
    rn_bridge.channel.send('Msg: ' + theMsg);
}

function messageHandler(msg) {
    sendLog('Received message: Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg);
}

function generateMessage(messageText) {
    const data = JSON.stringify({
        deviceId: 'iot-brick',
        text: messageText,
    });
    const message = new Message(data);
    return message;
}

const client = Client.fromConnectionString(
    '<DEVICE_CONNECTION_STRING>',
    Protocol,
);

client.on('connect', () => sendLog('Client connected'));
client.on('error', (err) => sendErr(err.message));
client.on('message', messageHandler);

client.open().catch((err) => {
  sendErr('Could not connect: ' + err.message);
});
