import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root' // este servicio será único y global en el root
})
export class GifsService {

  private apiKey         : string = 'MOl8kxECDAItd3C2NOZxIXe2MILoRjdo';
  private servicioUrl    : string = 'https://api.giphy.com/v1/gifs';
  private _historial     : string[] = [];
  
  // TODO: Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {
    
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];

    this.resultados = JSON.parse( sessionStorage.getItem('ultimosResultados')! ) || [];

    // this._historial =  localStorage.getItem('historial');
    // if( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

  }

  buscarGifs( query: string = '' ) {

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes(query) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify( this._historial ) );

    }

    const params = new HttpParams()
      .set( 'api_key', this.apiKey )
      .set( 'limit', '10' )
      .set( 'q', query );


    this.http.get<SearchGifsResponse>( `${ this.servicioUrl }/search`, { params: params } )
        .subscribe( ( resp ) => {
          this.resultados = resp.data;
          sessionStorage.setItem('ultimosResultados', JSON.stringify( this.resultados) );
        })

  }
}
