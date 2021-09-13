import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from '../../models/interfaces/user.interface';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  users: User[] = []
  user: User;
  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    this.user = await this.storage.get('currentUser')
    this.getUsers()
  }

  goToConversation(id){
    this.navCtrl.navigateForward('conversation/'+id)
  }

  getUsers(){
    this.userService.getUsers(this.user.email).subscribe(user => {
        this.users = user
    })
  }

}
