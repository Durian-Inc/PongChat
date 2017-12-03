"use strict";

var ws = null;
var newMsg = "";
var chatContent = "";
var username = null;
var joined = false;


function created() {
    ws = new WebSocket("ws://" + "localhost:8000" + "/ws")
    ws.addEventListener("message", function(e) {
        var msg = JSON.parse(e.data);
        var msgNode = document.createTextNode(newMsg);
        var msgPara = document.createElement("p");
        msgPara.appendChild(msgNode);
        msgPara.setAttribute("class", "talktext");
        var newClientMsg = document.createElement("div");
        newClientMsg.setAttribute("class", "talk-bubble tri-right left-top");
        newClientMsg.appendChild(msgPara)
        var chatList = document.getElementById("chat__list");
        chatList.appendChild(newClientMsg);
    });
}

function send() {
    
    if (newMsg != "") {
        placeMessageInDiv();
        changeSize();
        ws.send(
            JSON.stringify({
                username: username,
                message: newMsg
            }));
        newMsg = "";
        
    }
}

function join() {
    if (!username) {
        console.log("You must choose a username");
        return;
    }
    username = $("<p>").html(username).text();
    joined = true;
}

var submitButton = document.getElementById("chat__send");
submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (submitButton.innerHTML != "Send") {
        username = document.getElementById("chat__message").value;
        join();
        submitButton.innerHTML = "Send";
    } else {
        newMsg = document.getElementById("chat__message").value;
        send();
    }
    return false;
}, true);

function placeMessageInDiv(){
    var msgNode = document.createTextNode(newMsg);
    var msgPara = document.createElement("p");
    msgPara.appendChild(msgNode);
    msgPara.setAttribute("class", "talktext");
    var newClientMsg = document.createElement("div");
    newClientMsg.setAttribute("class", "talk-bubble tri-right left-top");
    newClientMsg.appendChild(msgPara)
    var chatList = document.getElementById("chat__list");
    chatList.appendChild(newClientMsg);

}

function changeSize(){

    var game_box = document.getElementById("pong-box");
    var random_width = Math.floor(Math.random() * 100);
    game_box.style.width = random_width+"%";
    
}

created();
