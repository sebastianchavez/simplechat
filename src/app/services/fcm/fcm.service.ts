import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
  ) { }

  async initPush(){


    
    // const getToken = await this.firebaseNative.messaging().getToken()
    // console.log('getToken:', getToken)
    // this.firebaseNative.messaging().
    // console.log('getPlatform:',Capacitor.getPlatform())
  }

  async registerPush(){
    // PushNotifications.requestPermissions().then((permission) => {
    //   console.log({permission})
    //   PushNotifications.register()
    //   if(permission.receive){
    //   } else {

    //   }
    // }).catch(error => {
    //   console.log({error})
    // })

    // PushNotifications.addListener('registration', (token) => {
    //   console.log('token:', token)
    // })

    // PushNotifications.addListener('registrationError', (error) => {
    //   console.log('error:', error)
    // })

    // PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    //   console.log('notification:', notification)
    // })

    // PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
    //   const data = notification.notification.data
    //   console.log('action performed:', notification.notification)
    //   console.log('data:', data)
    // })

    // PushNotifications.removeAllDeliveredNotifications()
  }
}
