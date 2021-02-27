import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { UpdateVisitaPageModule } from './pages/update-visita/update-visita.module';
import { InventarioPageModule } from './pages/inventario/inventario.module';
//import { InterceptorService } from './services/interceptor.service';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
            BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            HttpClientModule,
            UpdateVisitaPageModule,
            InventarioPageModule,
            IonicStorageModule.forRoot()
          ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  /*   {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
