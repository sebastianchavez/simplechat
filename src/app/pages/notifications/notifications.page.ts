import { ApplicationRef, Component, OnInit } from '@angular/core';
import { FcmService } from '../../services/fcm/fcm.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  messages: OSNotificationPayload[] = []
  constructor(
    public fcmService: FcmService,
  ) { }

  ngOnInit() {
    this.fcmService.pushListener.subscribe((notification) => {
      this.messages.unshift(notification)
    })
  }

  async ionViewWillEnter(){
  }

}
