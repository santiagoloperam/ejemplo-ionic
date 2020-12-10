import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { Storage } from '@ionic/storage';
import { RootObject, Visita } from '../interfaces/interfaces';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  paginaVisitas = 0;
  usuario = {};
  token = null;

  constructor( private http: HttpClient,
               private usuarioService: UsuarioService,
               private storage: Storage,
               private fileTransfer: FileTransfer ) {
    this.usuario = this.usuarioService.usuario;
    this.token = this.usuarioService.token;
  }

  getVisitas() {

    this.paginaVisitas++;

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip,deflate,br',
      // 'Connection': 'keep-alive',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ this.token }`
    });

    return this.http.get<RootObject>( `${ URL }/auth/visitas/user`, { headers } );

    // return this.http.get(`${ URL }/api/auth/visitas/user?pagina=${ this.paginaVisitas }`);

  }

  storageVisitas( visitas: Visita[] ) {
    this.storage.set('visitas', visitas);
  }

  getStorageVisitas() {
    return this.storage.get('visitas');
  }

  updateVisita2( visita: Visita ) {

    const headers = new HttpHeaders({
      // 'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip,deflate,br',
      // 'Connection': 'keep-alive',
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ this.token }`
    });

    console.log(visita.id);

    return this.http.put( `${ URL }/auth/visitas/update/${ visita.id }`, visita, { headers } );

  }

  subirImagen( img: string ) { // supuestamente img es el mismo imageData que devuelve camera.getPicture = imageData
    const options: FileUploadOptions = {
      fileKey: 'img',
      headers: {
        'Authorization': `Bearer ${ this.token }`
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    // fileTransfer.upload('SOURCE_FILE_PATH in the device', 'API_ENDPOINT', options)
    fileTransfer.upload( img, `${ URL }/api/auth/uploadImg`)
      .then( data => {
        console.log(data);
      }).catch( err => {
          console.log('Error en carga!', err);
      });
  }

}
