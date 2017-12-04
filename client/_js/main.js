"use strict";

var ws = null;
var newMsg = "";
var chatContent = "";
var username = "";
var joined = false;

var packet;

function created() {
    ws = new WebSocket("ws://" + window.location.host + "/ws")
    ws.addEventListener("message", function(e) {
        var msg = JSON.parse(e.data);
            var msgNode = document.createTextNode(msg.username + ": " + msg.message);
            var msgPara = document.createElement("p");
            msgPara.appendChild(msgNode);
            msgPara.setAttribute("class", "talktext");
            var newClientMsg = document.createElement("div");
            newClientMsg.setAttribute("class", "talk-bubble tri-right left-top");
            newClientMsg.appendChild(msgPara)
            var newMsgWrapper = document.createElement("div");
            newMsgWrapper.setAttribute("class", "msgWrapper");
            newMsgWrapper.appendChild(newClientMsg)
            var chatList = document.getElementById("chat__list");
            chatList.appendChild(newMsgWrapper);

            $("#chat__back").scrollTop($("#chat__back")[0].scrollHeight);
    });

}

function send() {

    if (newMsg != "") {
        //placeMessageInDiv();
        //changeSize();
        var msgJSON = JSON.stringify({
                    username: username,
                    message: newMsg
                  });
        ws.send(msgJSON);
        newMsg = "";
        document.getElementById("chat__message").value = "";
        updateScroll();

    }
}

function join() {
    username = document.getElementById("chat__message").value;
    if (username == "") {
        alert("You must choose a username.");
        return;
    }
    submitButton.innerHTML = "Send";
    document.getElementById("chat__message").value = "";
    document.getElementById("chat__message").placeholder = "Message";
    joined = true;
}

var submitButton = document.getElementById("chat__send");
submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (username == "") {
        username = document.getElementById("chat__message").value;
        join();
    } else {
        newMsg = document.getElementById("chat__message").value;
        send();
    }
    return false;
}, true);

function updateScroll() {
    var element = document.getElementById("chat__back");
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

function placeMessageInDiv() {
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

created();

var input = document.getElementById("chat__float");
var chat = document.getElementById("chat__back");
var pong = document.getElementById("pong");
var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;

h = h - 60;

if(h >= w && 2/3 * h <= w) {
    // For 9:16 phones
    var newH = 2/3 * h;
    pong.style.width = newH + "px";
    pong.style.height = pong.style.height;
    chat.style.height = h - newH + "px";
} else if(2/3 * h >= w && h >= w) {
    // For tall phones
    var newH = w;
    pong.style.height = newH + "px";
    pong.style.width = pong.style.height
    chat.style.height = h - newH + "px";
} else if(2/3 * w > h) {
    // For 16:9 Desktops
    pong.style.width = h + "px";
    pong.style.height = pong.style.width;
    chat.style.height = h + "px";
    chat.style.width = w - h + "px";
    input.style.width = w - h + "px";
} else {
    // For 4:3 computers
    var newH = 2/3 * w;
    pong.style.height = newH + "px";
    pong.style.width = pong.style.height;
    chat.style.height = h - newH + "px";
}