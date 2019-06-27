var connection, myName;
function SetUpConnection() {
    connection = new signalR.HubConnectionBuilder().withUrl("/conn_peer").build();
    connection.on("NewUserInfo", user => {
        if (user.peerId == peer.id)
            myName = user.name;
        else {
            console.log("new user: " + user.name);
            MakeCall(user);
        }
    });
    connection.on("UserQuit", peerId => {
        console.log("User " + peerId + " quitted");
        var callId = calls.filter(c => c.peer == peerId)[0].id;
        DeleteParent(callId);
    });
    
    WaitForObject(peer, (p) => typeof(p.id)==="undefined", (object) => {
        connection.start().then(() => {
            connection.invoke("NewUser", peer.id);
        }).catch(err => console.log(err));
    });
    window.onbeforeunload = () => {
        connection.invoke("Quit", peer.id);
    };
}