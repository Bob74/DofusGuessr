
export default function sendRestMessage(method, endpoint, content) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(content);
}

