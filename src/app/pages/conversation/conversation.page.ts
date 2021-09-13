import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/interfaces/user.interface';
import { Message, STATES } from '../../models/interfaces/message.interface';
import { Storage } from '@ionic/storage';
import { IonInfiniteScroll, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  idLog = 'ConversationPage'
  conversation: Message[] = []
  user: User;
  to: User;
  message: string = ''
  lastDocument: any = {}
  load: boolean = false
  conversationId
  limit: number = 5;

  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private logger: LoggerService
  ) {
    
   }

  async ngOnInit() {
    this.user = await this.storage.get('currentUser')
  }

  ionViewWillEnter(){
    const id = this.route.snapshot.params.id;
    this.getUserById(id)
  }

  async sendMessage(){
    if(this.message.trim() == ''){
      return;
    }
    try {
     
      let message: Message = {
        id: '' ,
        conversationId: this.conversationId,
        date: Date.now(),
        from: this.user.id,
        to: this.to.id,
        state: STATES.SENT,
        message: this.message
      }
      this.conversation.push({ ...message, state: STATES.SENDING});
      await this.messageService.saveMessage(message);
      this.conversation[this.conversation.length -1].state = STATES.SENT;
      this.goToBottom()
      this.message = ''
    } catch (e) {
      this.logger.error(this.idLog, 'sendMessage', {info: 'Error send message', error: e})
    }
  }

  async getUserById(userId){
    try {
      this.to = await this.userService.getUserById(userId)
      let idsArray = [this.user.userId, this.to.userId].sort()
      this.conversationId = idsArray.join('||')
      this.logger.log(this.idLog, 'getUserById', {info: 'Success get user', response: this.to})
      await this.getMessages()
      setTimeout(() => {
        this.goToBottom()
      }, 1000)
    } catch (e) {
      console.log({error: e})
      this.logger.error(this.idLog, 'getUserById', {info: 'Error get user', error: e})
    }

  }

  async getMessages(){
    try {
      let params = {
        id: this.conversationId,
        lastDocument: this.lastDocument, 
        order: 'date', 
        limit: this.limit,
      }
      this.messageService.getMessages(params)
      .subscribe(resp => {
        this.logger.log(this.idLog, 'getMessages', {info: 'Success get messages', response: resp})
        this.lastDocument = resp[resp.length -1]
        this.conversation = resp.reverse();
      })
    } catch (e) {
      this.logger.error(this.idLog, 'getMessages', {info: 'Error get messages', error: e})
    }
  }

  goToBottom(){
    setTimeout(() => {
      if(document.getElementById('chat-container')){
        let height =  document.getElementById('chat-container').scrollHeight
        let content = document.querySelector('ion-content').scrollHeight
        console.log({height, content})
        setTimeout(() => {
          console.log({height, content})
          document.getElementById('chat-container').scrollTop = height
        }, 10)
      }
    }, 100);
  }


  doRefresh(event) {
    this.getBackMessages()
    let height =  document.getElementById('chat-container').scrollHeight
    let content = document.querySelector('ion-content').scrollHeight
    let position = document.body.scrollTop
    let scrollTop =  document.documentElement.scrollTop
    console.log({height, content, position, scrollTop})
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getBackMessages(){
    this.limit += 5;
    this.getMessages()
  }

}
