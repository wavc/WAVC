import { HubConnection } from "@aspnet/signalr";
import * as signalR from '@aspnet/signalr';
import { Util } from './util';

export class Broker {
    myName: string;
    connectionId: string;
    callsFunc;
    call;
    callId: string;
    connection: HubConnection;
    userId: string;
    constructor(connectionId, callsFunc, Call, onNameChange) {
        this.connectionId = connectionId;
        this.callsFunc = callsFunc;
        this.call = Call;

        this.connection = new signalR.HubConnectionBuilder().withUrl("/signalR/ConnectPeers", {
            accessTokenFactory : () => localStorage.getItem('token').toString()
          }).build();
        this.connection.on("NewUserInfo", (user) => {
            console.log(user);
            if (user.peerId == this.connectionId) {
                this.myName = user.name;
                onNameChange(this.myName);
            } else {
                this.call(user);
            }
        });
        this.connection.on("UserQuit", peerId => {
            var callWithPeer = this.callsFunc()[peerId];
            if (callWithPeer !== undefined) {
                Util.DeleteElement(peerId);
            }
        });
        window.onbeforeunload = () => {
            this.connection.invoke("Quit", this.connectionId, this.callId);
        };
    }
    async StartConnection(UserId: string, callId: string) {
        await this.connection.start();
        this.userId = UserId;
        this.callId = callId;
        var res = await this.connection.invoke("NewUser", UserId, this.connectionId, callId) as boolean;
        if(!res) {
            alert("Something went wrong with sending new user info");
        }
    }
}