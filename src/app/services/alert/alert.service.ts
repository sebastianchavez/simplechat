import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  errors = [
    {code: 'auth/invalid-email', message: 'Email inválido'},
    {code: 'auth/wrong-password', message: 'Usuario o contraseña inválido'},
    {code: 'auth/user-not-found', message: 'Usuario y/o contraseña inválido'}
  ]
  constructor(
    private toastController: ToastController,
      private alertController: AlertController
  ) { }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async alert(message){
      const alert = await this.alertController.create({
        message ,
        buttons: ['OK']
      });
  
      await alert.present();
  
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }

    getError(error, msg) {
      if(error.code){
        const err = this.errors.find(x => x.code == error.code)
        this.alert(err.message ? err.message : msg)
      } else {
        this.alert(msg)
      }
    }
}
