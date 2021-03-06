import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import * as Collections from 'typescript-collections';

@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  private readonly BaseUrl = '/signalR';
  private connectionHubs = new Collections.Dictionary<string, signalR.HubConnection>();

  constructor() { }

  public startConnection = (url: string, callback= undefined): signalR.HubConnection => {
    const fullUrl = this.BaseUrl + url;
    console.log('Trying to establish connection to ' + fullUrl);
    if (this.connectionHubs.containsKey(fullUrl)) {
      console.log('Connection has been already established. Nothing to do...');
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(fullUrl, {
        accessTokenFactory : () => localStorage.getItem('token').toString()
      })
      .build();

    connection
      .start()
      .then(() => this.onConnected(callback))
      .catch((error) => console.error(error));

    this.connectionHubs.setValue(url, connection);
    return connection;
  }

  public getConnection = (url: string) => {
    return this.connectionHubs.getValue(url);
  }

  private onConnected = (callback) => {
    if (callback !== undefined) {
      callback();
      console.log('Connected to SignalR Successfully!');
    }
  }
}
