import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.socketUrl, options: { path: '/chat/socket.io' } };

console.log({ config })
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
