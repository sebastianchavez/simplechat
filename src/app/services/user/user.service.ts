import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, CollectionReference, Query } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireMessaging } from '@angular/fire/messaging'
import { map } from 'rxjs/operators'
import * as firebase from 'firebase/app';
import { User } from '../../models/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(
      private angularFirestore: AngularFirestore,
      private angularFireAuth: AngularFireAuth,
      private angularFireMessaging:AngularFireMessaging
    ) { 
    this.userCollection = angularFirestore.collection<User>('users')
    }

    register(email: string, password: string){
      return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
   }

   login(email: string, password: string){
     return this.angularFireAuth.signInWithEmailAndPassword(email, password)
   }

   saveUser(user: User){
    return new Promise(async (resolve, reject) => {
      try {
        const data = { ...user };
        const result = await this.userCollection.doc(user.id).set(data);
        resolve(result)
      } catch (e: any) {
        reject(e.message)
      }
    })
   }

   checkStatus(){
     return this.angularFireAuth.authState
   }

   getUserByEmail(email){
    this.userCollection = this.angularFirestore.collection<User>('users',  (ref => ref.where('email', '==', email)))
    return this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as User))
    )
   }

   getUsers(myUser){
    this.userCollection = this.angularFirestore.collection<User>('users', (ref => ref.where('email', '!=', myUser)))
    return this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as User))
    )
   }

   logout(){
     return this.angularFireAuth.signOut()
   }

   getUserById(userId): Promise<User>{
     return new Promise(async (resolve, reject) => {
       this.userCollection = this.angularFirestore.collection<User>('users', (ref => ref.where('id', '==', userId)))
       this.userCollection.snapshotChanges().pipe(
         map(actions => actions.map(a => a.payload.doc.data() as User))
       ).subscribe(res => {
         resolve(res[0])
       },err => {
         reject(err)
       })
     })
    }
  }
