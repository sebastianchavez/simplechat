import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/interfaces/user.interface';
import { AlertService } from '../../services/alert/alert.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  idLog: string = 'RegisterPage'
  registerForm: FormGroup;
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
  msg = ''

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private userService: UserService,
    private alertService: AlertService,
    private logger: LoggerService,
    private navCtrl: NavController
  ) { 
    this.clearForm()
  }

  ngOnInit() {
  }

  clearForm(){
    this.registerForm = this.formBuilder.group({
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

  async register(value){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    try {
      await loading.present();
      const { email, password } = value
      const resp = await this.userService.register(email, password)
      const user: User = {
        userId: Date.now(),
        email,
        id: resp.user.uid,
        image: '',
        nameImage: ''
      }
      await this.userService.saveUser(user)
      await loading.dismiss();
      this.alertService.toast('Usuario registrado')
      this.clearForm()
      this.logger.log(this.idLog, 'register', {info: 'Success register'})
      this.navCtrl.pop()
    } catch (e) {
      this.alertService.getError(e, 'Problemas al registrar usuario')
      this.logger.error(this.idLog, 'register', {info: 'Error register', error: e})
      await loading.dismiss();
    }
  }
}
