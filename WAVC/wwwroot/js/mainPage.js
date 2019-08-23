var minLen = 2;
/*var deleteSuccessfulMessage = '<span class="success">Yay</span>';
var deleteUnSuccessfulMessage = '<span class="no-success">Nay</span>';*/

async function Search() {
    var q = document.getElementById("search").value;
    if (q.length >= minLen) {
        var result = await SendAJAX("GET", "/Home/Search?query=" + q)
        var list = JSON.parse(result);
        var res = "";
        for (var i = 0; i < list.length; i++) {
            res +=
                '<a href="javascript:void(0);" onclick="SendFriendRequest(event)" data-id="' + list[i].id + '"\>' +
                    list[i].name + ' ' + list[i].surname +
                '</a><br>';
        }
        document.getElementById("results").innerHTML = res;

    }
}

function GoToFriend(e) {
    var linkElement = e.target;
    while (linkElement.nodeName.toLowerCase() != "a") {
        linkElement = linkElement.parentNode;
    }
    var name = linkElement.children[0].innerHTML;
    var surname = linkElement.children[1].innerHTML;
    var id = GetIdWithoutPrefix("friend", linkElement.parentNode);
    var state = { name, surname, id };
    var title = name + " " + surname;
    var url = FixURL(name + "." + surname);
    history.pushState(state, title, url);
    ChangedHistory({ state });
}
window.onpopstate = (e) => { ChangedHistory(e) };

function ChangedHistory(stateEvent) {
    if (stateEvent == undefined) return;
    state = stateEvent.state;
    var deleteButton;
    if (state == null)
        deleteButton = "";
    else
        deleteButton = 
            '<a href="javascript:void(0);" onclick="DeleteFriend()">\
                Delete ' + state.name + ' ' + state.surname + '\
            </a><br>';
    document.getElementById("delete-button-container").innerHTML = deleteButton;
}

async function DeleteFriend() {
    var friendId = history.state.id;
    var result = await connection.invoke("DeleteFriend", friendId);
    console.log(result);
    /*var resultContainer = document.getElementById("delete-result");
    if (result)
        resultContainer.innerHTML = deleteSuccessfulMessage;
    else
        resultContainer.innerHTML = deleteUnSuccessfulMessage;*/

    DeleteElement(history.state.id + "-friend");

    history.pushState(null, "Home", "/");
    ChangedHistory({ state: null });
}

var connection;
SetUpRealTimeConnection();

function SendFriendRequestResponse(e, accept) {
    var divElement = e.target;
    while (divElement.nodeName.toLowerCase() != "div") {
        divElement = divElement.parentNode;
    }
    var name = divElement.children[0].innerHTML;
    var surname = divElement.children[1].innerHTML;
    var friendId = GetIdWithoutPrefix("request", divElement);
    connection.invoke("SendFriendRequestResponse", friendId, accept);

    DeleteElement(divElement.id);
    if (accept) {
        DisplayNewFriend(friendId, name, surname);
    }
}

function SendFriendRequest(e) {
    var linkElement = e.target;
    while (linkElement.nodeName.toLowerCase() != "a") {
        linkElement = linkElement.parentNode;
    }
    var id = linkElement.getAttribute("data-id");
    connection.invoke("SendFriendRequest", id);
}

async function SetUpRealTimeConnection() {

    connection = new signalR.HubConnectionBuilder().withUrl("/friend_request").build();

    connection.on("RecieveFriendRequest", (userId, userName, userSurname) => {
        DisplayNewRequest(userId, userName, userSurname);
    });

    connection.on("RecieveFriendRequestResponse", (userId, userName, userSurname) => {
        DisplayNewFriend(userId, userName, userSurname);
    });

    connection.on("FriendDeleted", (userId) => {
        DeleteElement(userId + "-friend");
    });
    await connection.start();
}

function FixURL(url) {
    if (document.location.pathname == "/Home/Index") { //in this case Index is being replaced with url, so I add it manually
        return "Index/" + url;
    }
    else return url;
}

function GetIdWithoutPrefix(prefix, element) {
    return new RegExp("(.*)-" + prefix).exec(element.id)[1];
}

function DisplayNewFriend(userId, userName, userSurname) {
    document.getElementById("friends-container").innerHTML +=
        '<li id="' + userId + '-friend">\
            <a href="javascript:void(0);" onclick="GoToFriend(event)">\
                <span class="name">'+ userName + '</span> <span class="surname">' + userSurname + '</span>\
            </a >\
        </li >';
}

function DisplayNewRequest(userId, userName, userSurname) {
    document.getElementById("requests-container").innerHTML +=
        '<div id="' + userId + '-request">\
            <span class="name">'+ userName + '</span> <span class="surname">' + userSurname + '</span><br />\
            <a href="javascript:void(0);" onclick="SendFriendRequestResponse(event, true)">Yes</a>\
            <a href="javascript:void(0);" onclick="SendFriendRequestResponse(event, false)">No</a>\
        </div>'
}