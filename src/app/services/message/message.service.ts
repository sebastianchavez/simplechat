import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IMessage, IQueryMessages } from '../../models/interfaces/message.interface';
import { map } from 'rxjs/operators'

import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface Params {
  id: string;
  limit: number;
  lastDocument: any;
  order: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private appId: string = environment.appId
  private apiUrl: string = environment.apiUrl
  private url1: string = 'api/messages/get-messages'

  constructor(
    private socket: Socket,
    private http: HttpClient
    // private angularFirestore: AngularFirestore
  ) {
    // this.messageCollection = angularFirestore.collection<Message>('messages')
  }

  connected() {
    this.socket.connect();
  }

  getLastMessages(query: IQueryMessages): Promise<any> {
    return this.http.get(`${this.apiUrl}${this.url1}?appId=${query.appId}&conversationId=${query.conversationId}&limit=${query.limit}&page=${query.page}`).toPromise()
  }

  getMessages(userId: string) {
    return this.socket.fromEvent(`${this.appId} - msgToClient:${userId}`)
  }

  saveMessage(message: IMessage) {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = this.socket.emit('msgToServer', message)
        if (resp.connected) {
          resolve(message)
        } else {
          reject({ error: 'Problemas con socket', resp })
        }
      } catch (e: any) {
        reject(e.message)
      }
    })
  }

}