import { HubConnection } from "@aspnet/signalr";
import * as signalR from '@aspnet/signalr';
import { Util } from './util';

export class Broker {
    myName: string;
    Id: string;
    callsFunc;
    Call;
    connection: HubConnection;
    constructor(Id, callsFunc, Call, onNameChange) {
        this.Id = Id;
        this.callsFunc = callsFunc;
        this.Call = Call;

        this.connection = new signalR.HubConnectionBuilder().withUrl("/signalR/ConnectPeers").build();
        this.connection.on("NewUserInfo", (user) => {
            if (user.peerId == this.Id) {
                this.myName = user.name;
                onNameChange(this.myName);
            } else {
                console.log("new user: " + user.name);
                this.Call(user);
            }
        });
        this.connection.on("UserQuit", peerId => {
            console.log("User " + peerId + " quitted");
            var callsWithPeer = this.callsFunc().filter(c => c.peer == peerId);
            if (callsWithPeer.length > 0) {
                var callId = callsWithPeer[0].id;
                Util.DeleteElement(callId);
            }
        });
        window.onbeforeunload = () => {
            this.connection.invoke("Quit", this.Id);
        };
    }
    async StartConnection(CallId: number) {
        await this.connection.start();
        var res = await this.connection.invoke("NewUser", this.Id, CallId) as boolean;
        if(!res) {
            alert("Something went wrong with sending new user info");
        }
    }
}