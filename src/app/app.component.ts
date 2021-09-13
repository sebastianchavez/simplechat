import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { UserService } from './services/user/user.service';
import { FcmService } from './services/fcm/fcm.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private userService: UserService,
    private storage: Storage,
    private navCtrl: NavController,
    private fcmService: FcmService,
    private platform: Platform,
  ) {
    this.initializeApp()
  }

  async ngOnInit(){
    await this.storage.create();
  }

  initializeApp(){
    this.platform.ready().then(async () => {
      try {
        // this.fcmService.initPush()
        await this.fcmService.registerPush()
        console.log('FCM OK')
        // await PushNotifications.requestPermissions()
      } catch (e) {
        console.log('FCM ERROR:',e)
      }
    })
  }

  async logout(){
    await this.userService.logout()
    await this.storage.clear()
    this.navCtrl.navigateRoot('login')
  }
 
}
