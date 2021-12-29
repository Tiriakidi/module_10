const wsUri = "wss://echo-ws-service.herokuapp.com";

let websocket;

function writeToScreen(message, classValue, location = false) {
    let conteiner = document.createElement("div");
    conteiner.classList.add(`conteiner_${classValue}`);
    document.querySelector(".output").appendChild(conteiner);
    if(location) {
        let pre = document.createElement("a");
        pre.classList.add(classValue)
        pre.href = message;
        pre.textContent = "Гео-локация";
        conteiner.appendChild(pre);
    } else {
        let pre = document.createElement("div");
        pre.classList.add(classValue);
        pre.innerHTML = message; 
        conteiner.appendChild(pre);
    }   
};

document.querySelector(".j-btn-send").addEventListener("click", () => { 
    const message = document.querySelector(".input-task3").value;
    writeToScreen(message, "message");

    const msgInfo = {
        type: "text",
        content: message
    };

    jsonString = JSON.stringify(msgInfo)
    websocket.send(jsonString);   
});

//Locations callback 

const error = () => {alert("Невозможно получить ваше местоположение")};
  
const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    
    let locationInfo = {
        type: "location",
        content: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    };

    writeToScreen(locationInfo.content, "message", locationInfo.type)

    jsonString = JSON.stringify(locationInfo);
    websocket.send(jsonString);    
};
  
document.querySelector(".j-btn-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation не поддерживается вашим браузером");
    } else {
        console.log('Определение местоположения…');
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

window.onload = () => {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        console.log("CONNECTED");
    };
    websocket.onmessage = function(evt) {
        const reply = JSON.parse(evt.data);
        if (reply.type == "text") {
            writeToScreen(reply.content, "response");
        } else {
            console.log(reply.content)
        }
    };
    websocket.onclose = function(evt) {
        console.log("DISCONNECTED");
    };
    websocket.onerror = function(evt) {
        console.log("ERROR");
    };
}

