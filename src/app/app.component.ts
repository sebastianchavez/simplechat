import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { UserService } from './services/user/user.service';
import { FcmService } from './services/fcm/fcm.service';
import { Storage } from '@ionic/storage';
import { MessageService } from './services/message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private userService: UserService,
    private storage: Storage,
    private navCtrl: NavController,
    private fcmService: FcmService,
    private platform: Platform,
    private messageService: MessageService
  ) {
    this.initializeApp()
  }

  async ngOnInit() {
  }

  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(async () => {
      try {
        // this.fcmService.initPush()
        if (this.platform.is('android')) {
          await this.fcmService.registerPush()
        }
        const user = await this.storage.get('currentUser')
        if (user) {
          user['pushId'] = this.fcmService.userId;
          await this.userService.saveUser(user)
        }

        this.messageService.connected()
        console.log('FCM OK')
        // await PushNotifications.requestPermissions()
      } catch (e) {
        console.log('FCM ERROR:', e)
      }
    })
  }

  async logout() {
    await this.userService.logout()
    await this.storage.clear()
    this.navCtrl.navigateRoot('login')
  }

}
