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
        self.chatContent += '<div class="chip">' +
            msg.username + "</div>" + "<br/>";

        var element = document.getElementById("chat-messages");
        element.scrollTop = element.scrollHeight;
    });
}

function send() {
    if (newMsg != "") {
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

created();
