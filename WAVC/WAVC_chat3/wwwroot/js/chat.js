"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("RecieveMessage", function (user, message) {
    console.log("Message Recieved!!!");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var li = document.createElement("li");
    li.classList.add("message-left");
    var span1 = document.createElement("span");
    span1.classList.add("author");
    span1.innerText = user + ": ";
    var span2 = document.createElement("span");
    span2.innerText = msg;
    li.appendChild(span1);
    li.appendChild(span2);
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    console.log(user +": "+ message);
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    var li = document.createElement("li");
    li.classList.add("message-right");
    var span1 = document.createElement("span");
    span1.innerText = message;
    li.appendChild(span1);
    document.getElementById("messagesList").appendChild(li);
    event.preventDefault();
});