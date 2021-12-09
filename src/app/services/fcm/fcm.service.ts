import { EventEmitter, Injectable } from '@angular/core';
// import { Firebase } from '@ionic-native/firebase/ngx';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx'
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  messages: OSNotificationPayload[] = []
  userId

  pushListener = new EventEmitter<OSNotificationPayload>();
  constructor(
    private oneSignal: OneSignal
  ) {
    // this.loadMessages()
  }

  async initPush() {

    // this.firebase.getToken()
    //   .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
    //   .catch(error => console.error('Error getting token', error));

    // this.firebase.onNotificationOpen()
    //   .subscribe(data => console.log(`User opened a notification ${data}`));

    // this.firebase.onTokenRefresh()
    //   .subscribe((token: string) => console.log(`Got a new token ${token}`));

  }



  async registerPush() {
    this.oneSignal.startInit('5d808629-c29c-4159-83a8-dc059c494994', '330722857405');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(async (notification) => {
      await this.notificationRecieved(notification)
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (notification) => {
      await this.notificationRecieved(notification.notification)
    });

    this.oneSignal.getIds().then(x => {
      this.userId = x.userId
    })

    this.oneSignal.endInit();
  }

  async notificationRecieved(notification: OSNotification) {


    const { payload } = notification

    const isExists = this.messages.find(m => m.notificationID === payload.notificationID)

    if (isExists) {
      return
    }

    this.messages.unshift(payload)
    this.pushListener.emit(payload)

  }

}
