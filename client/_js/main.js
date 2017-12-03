"use strict";

var ws = null;
var newMsg = "";
var chatContent = "";
var username = null;
var joined = false;


function created() {
    ws = new WebSocket("ws://" + "131.151.90.241:10000" + "/ws")
    ws.addEventListener("message", function(e) {
        var msg = JSON.parse(e.data);
        var msgNode = document.createTextNode(msg.message);
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
        //placeMessageInDiv();
        //changeSize();
        ws.send(
            JSON.stringify({
                username: username,
                message: newMsg
            }));
        newMsg = "";
        document.getElementById("chat__message").value = "";
        updateScroll();

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

function changeSize() {

    var game_box = document.getElementById("pong-box");
    var random_width = Math.floor(Math.random() * 100);
    game_box.style.width = random_width + "%";

}

created();
document.getElementById("pong-box").style.height = "500px";
document.getElementById("pong-box").style.width = "500px";
//function resize() {
// var screenHeight = document.documentElement.offsetheight;
// var screenWidth = document.documentElement.offsetWidth;
// if (parseInt(screenHeight * (2 / 3)) <= parseInt(screenWidth) && parseInt(screenHeight) >= screenWidth) {
//     document.getElementById("pong-box").style.width = (2 / 3) * screenHeight + "px";
//     document.getElementById("pong-box").style.height = document.getElementById("pong-box").style.width + "px";
// } else if ((2 / 3) * screenHeight >= screenWidth && screenHeight >= screenWidth) {
//     document.getElementById("pong-box").style.width = str(screenWidth) + "px";
//     document.getElementById("pong-box").style.height = document.getElementById("pong-box").style.width;
// } else if (screenWidth >= screenHeight && (2 / 3) * screenWidth <= screenHeight) {
//     document.getElementById("pong-box").style.height = (2 / 3) * screenWidth;
//     document.getElementById("pong-box").style.width = document.getElementById("pong-box").style.height;
// } else {
//     document.getElementById("pong-box").style.width = screenHeight;
//     document.getElementById("pong-box").style.height = document.getElementById("pong-box").style.width;
// }
//}