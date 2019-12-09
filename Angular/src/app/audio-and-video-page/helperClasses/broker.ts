import { HubConnection } from "@aspnet/signalr";
import * as signalR from '@aspnet/signalr';
import { Util } from './util';

export class Broker {
    myName: string;
    Id: string;
    callsFunc;
    Call;
    connection: HubConnection;
    UserId: string;
    constructor(Id, callsFunc, Call, onNameChange) {
        this.Id = Id;
        this.callsFunc = callsFunc;
        this.Call = Call;

        this.connection = new signalR.HubConnectionBuilder().withUrl("/signalR/ConnectPeers").build();
        this.connection.on("NewUserInfo", (user) => {
            if (user.peerId == this.Id) {
                this.myName = user.name;
                onNameChange(this.myName);
            } else if(user.id == this.UserId) {
                this.Call(user);
            }
        });
        this.connection.on("UserQuit", peerId => {
            var callWithPeer = this.callsFunc()[peerId];
            if (callWithPeer !== undefined) {
                Util.DeleteElement(peerId);
            }
        });
        window.onbeforeunload = () => {
            this.connection.invoke("Quit", this.Id);
        };
    }
    async StartConnection(UserId: string, CallId: string) {
        await this.connection.start();
        this.UserId = UserId;
        var res = await this.connection.invoke("NewUser", UserId, this.Id, CallId) as boolean;
        if(!res) {
            alert("Something went wrong with sending new user info");
        }
    }
}