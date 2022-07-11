import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/interfaces/user.interface';
import { IMessage, STATES, IQueryMessages } from '../../models/interfaces/message.interface';
import { Storage } from '@ionic/storage';
import { IonInfiniteScroll, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PushService } from '../../services/push/push.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  idLog = 'ConversationPage'
  conversation: IMessage[] = []
  user: User;
  to: User;
  message: string = ''
  lastDocument: any = {}
  load: boolean = false
  conversationId
  limit: number = 5;
  page: number = 1;
  appId: string = environment.appId
  isLast: boolean = false

  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private logger: LoggerService,
  ) {

  }

  async ngOnInit() {
    this.user = await this.storage.get('currentUser')
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.params.id;
    this.getUserById(id)
  }

  async sendMessage() {
    if (this.message.trim() == '') {
      return;
    }
    try {

      let message: IMessage = {
        appId: this.appId,
        id: '',
        conversationId: this.conversationId,
        date: new Date(),
        from: this.user.id,
        to: this.to.id,
        state: STATES.SENDING,
        message: this.message
      }

      this.conversation.push({ ...message, state: STATES.SENDING });
      const response = await this.messageService.saveMessage(message);
      this.logger.log(this.idLog, 'sendMessage', { info: 'Success', message, response })
      const sendMessage = this.message
      if (this.to.pushId && this.to.pushId != '') {
        // TODO: Integrar con ms notificaciones push
        // await this.pushService.sendMessage({ message: sendMessage, toId: [this.to.pushId] })
      }
      this.message = ''
      this.conversation[this.conversation.length - 1].state = STATES.SENT;
      this.goToBottom()
    } catch (e) {
      this.logger.error(this.idLog, 'sendMessage', { info: 'Error send message', error: e })
    }
  }

  async getUserById(userId) {
    try {
      this.to = await this.userService.getUserById(userId)
      let idsArray = [this.user.userId, this.to.userId].sort()
      this.conversationId = idsArray.join('||')
      this.logger.log(this.idLog, 'getUserById', { info: 'Success get user', response: this.to })
      await this.getMessages()
      setTimeout(() => {
        this.goToBottom()
      }, 1000)
    } catch (e) {
      this.logger.error(this.idLog, 'getUserById', { info: 'Error get user', error: e })
    }

  }

  async getLastMessages() {
    try {
      let query: IQueryMessages = {
        conversationId: this.conversationId,
        limit: this.limit,
        page: this.page,
        appId: environment.appId
      }

      const response = await this.messageService.getLastMessages(query)
      if (response.messages && response.messages.length > 0) {
        this.conversation = response.messages.reverse().concat(this.conversation)
      } else {
        this.isLast = true
      }
      this.logger.log(this.idLog, 'getLastMessages', { info: 'Success', response })
    } catch (e) {
      this.logger.error(this.idLog, 'getLastMessages', { info: 'Error', error: e })
    }
  }

  async getMessages() {
    try {
      this.getLastMessages()
      this.messageService.getMessages(this.user.id)
        .subscribe((resp: any) => {
          this.conversation.push({ ...resp })
          this.goToBottom()
          this.logger.log(this.idLog, 'getMessages', { info: 'Success get messages', response: resp, conversation: this.conversation })
        })
    } catch (e) {
      this.logger.error(this.idLog, 'getMessages', { info: 'Error get messages', error: e })
    }
  }

  goToBottom() {
    setTimeout(() => {
      if (document.getElementById('chat-container')) {
        let height = document.getElementById('chat-container').scrollHeight
        let content = document.querySelector('ion-content').scrollHeight
        console.log({ height, content })
        setTimeout(() => {
          console.log({ height, content })
          document.getElementById('chat-container').scrollTop = height
        }, 10)
      }
    }, 100);
  }


  doRefresh(event) {
    let height = document.getElementById('chat-container').scrollHeight
    let content = document.querySelector('ion-content').scrollHeight
    let position = document.body.scrollTop
    let scrollTop = document.documentElement.scrollTop
    console.log({ height, content, position, scrollTop })
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getBackMessages() {
    this.page += 1;
    this.getLastMessages()
  }

}
