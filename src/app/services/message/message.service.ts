import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Message } from '../../models/interfaces/message.interface';
import { map } from 'rxjs/operators'

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
  private messageCollection: AngularFirestoreCollection<Message>;
  
  constructor(
        private angularFirestore: AngularFirestore
      ) { 
        this.messageCollection = angularFirestore.collection<Message>('messages')
      }

      getMessages(params: Params){
        console.log({params})
        this.messageCollection = this.angularFirestore.collection<Message>('messages', (ref => ref
          .where('conversationId', '==', params.id)
          .orderBy(params.order, 'desc')
          .limit(params.limit)
          ))

        return this.messageCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => a.payload.doc.data() as Message))
        )
      }

      saveMessage(message: Message){
        return new Promise(async (resolve, reject) => {
          try {
            const id = this.angularFirestore.createId()
            const msg = { ...message, id}
            const result = await this.messageCollection.doc(id).set(msg);
            resolve(result)
          } catch (e: any) {
            reject(e.message)
          }
        })
      }
 
  }