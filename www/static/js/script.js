const ws = new WebSocket("ws://127.0.0.1:8090/ws");

// Listen for possible errors
ws.addEventListener('error', (event) => {
  console.log('WebSocket error: ', event);
});

//ws.onmessage = async function(event)
//{
//    message = JSON.parse(event.data);
//    console.log(message);
//};

// Listen for messages
ws.addEventListener('message', (event) => {
    let message = JSON.parse(event.data);
    if ('client_id' in message) {
        console.log('Token received:', message.client_id);

        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/client/action/ready", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "login_id": message.client_id
        }));

    } else {
        console.error('Malformed message')
    }
});

