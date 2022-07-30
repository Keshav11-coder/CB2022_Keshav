window.addEventListener('load', () => {
    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', (e) => {
                if ((e.key == 'w' ||
                    e.key == 'a' ||
                    e.key == 's' ||
                    e.key == 'd' ||
                    e.key == 'e' ||
                    e.key == 'q')
                    && this.keys.indexOf(e.key) == -1) {
                    this.keys.push(e.key)
                    //client.publish(mqttTopic, this.keys.toString());
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
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    //client.publish(mqttTopic, this.keys.toString());
                }
                //console.log(e.key, this.keys);
            });
        }
        //key press engine by franks laboratory https://www.youtube.com/c/Frankslaboratory
    }

    const input = new InputHandler();
});