(async function () {

    const ws = await connectToServer();

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
    };
    /*
        document.body.onmousemove = (evt) => {
            const messageBody = { x: evt.clientX, y: evt.clientY };
            ws.send(JSON.stringify(messageBody));
            console.log(messageBody);
        };*/

    var keys = [];

    window.addEventListener('keydown', (e) => {
        if ((e.key == 'w' ||
            e.key == 'a' ||
            e.key == 's' ||
            e.key == 'd' ||
            e.key == 'e' ||
            e.key == 'q')
            && keys.indexOf(e.key) == -1) {
            keys.push(e.key)
            //client.publish(mqttTopic, this.keys.toString());
            const obj = {
                kp: keys
            };
            ws.send(JSON.stringify(obj));
            console.log(JSON.stringify(obj))
        }
        //console.log(e.key, this.keys);
    });
    window.addEventListener('keyup', (e) => {
        if ((e.key == 'w' ||
            e.key == 'a' ||
            e.key == 's' ||
            e.key == 'd' ||
            e.key == 'e' ||
            e.key == 'q')) {
            keys.splice(keys.indexOf(e.key), 1);
            //client.publish(mqttTopic, this.keys.toString());
            const obj = {
                kp: keys
            };
            ws.send(JSON.stringify(obj));
            console.log(JSON.stringify(obj))
        }
        //console.log(e.key, this.keys);
    });//key press engine by franks laboratory https://www.youtube.com/c/Frankslaboratory

    async function connectToServer() {
        const ws = new WebSocket('ws://localhost:3000/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });
    }

    function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
            return existing;
        }

        const template = document.getElementById('cursor');
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName('path')[0];

        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);
        document.body.appendChild(cursor);
        return cursor;
    }

})();
