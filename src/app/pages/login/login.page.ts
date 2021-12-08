import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { LoggerService } from '../../services/logger/logger.service';
import { FcmService } from '../../services/fcm/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  idLog: string = 'LoginPage'
  errors = [
    {code: 'auth/invalid-email', message: 'Email inválido'},
    {code: 'auth/wrong-password', message: 'Usuario o contraseña inválido'},
    {code: 'auth/user-not-found', message: 'Usuario y/o contraseña inválido'}
  ]
  loginForm: FormGroup;
  validationMessage = {
    email: [
      {type: 'required', message: 'Campo email es requerido'},
      {type: 'email', message: 'Email inválido'},
    ],
    password: [
      {type: 'required', message: 'Campo contraseña es requerida'},
      {type: 'minlength', message: 'Minimo 6 caracteres'}
    ]
  };
  errorMessage = '';
  msg = 'Problemas en autenticación'
  
  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private userService: UserService,
    private storage: Storage,
    private alertService: AlertService,
    public fcmService: FcmService,
    private platform: Platform,
    private logger: LoggerService
  ) { 
    this.clearForm()
  }

  ngOnInit() {
  }

  clearForm(){
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    });
  }

  async login(value){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
    try {
      this.storage.set('isUserLoggedIn', true)
      const { email, password } = value
      await this.userService.login(email, password)
      this.userService.getUserByEmail(email).subscribe(async res => {
        const user = res[0]
        await this.storage.set('currentUser', res[0])
        console.log('android: ',this.platform.is('desktop'))
        if(this.fcmService.userId){
          user['pushId'] = this.fcmService.userId
          await this.userService.saveUser(user)
        }
        this.navCtrl.navigateRoot('home')
        await loading.dismiss();
      })
    } catch (e) {
      await loading.dismiss();
      this.alertService.getError(e, this.msg)
    }
  }

  goToRegister(){
    this.navCtrl.navigateForward('/register')
  }
}
