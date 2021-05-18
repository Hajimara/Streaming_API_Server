import WebSocket from 'ws';

const socket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Connect New Client', ip);

    ws.on('message', (message) => {
      console.log(message);
    });
    ws.on('error', (error) => {
      console.error(error);
    });
    ws.on('close', () => {
      console.log('Disconnect Client', ip);
      clearImmediate(ws.interval);
    });

    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트에게 메시지 전송했습니다.');
      }
    }, 3000);
  });
};

export default socket;
