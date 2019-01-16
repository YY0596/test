import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

let addressData: {
  areaid?: string | number,
  truename?: string,
  address?: string,
  mobile?: string | number,
  setdefault?: number,
  area?: string,
  whereFrom?:number
} = { };

@Injectable()
export class CityPickerService {
  constructor(public http: Http) {

  }

  store(address) {
    addressData = address;
  }

  getCachedAddress() {
    return addressData;
  }

  getCitiesData(){
    return this.http.get('./assets/data/citydata.json')
      .toPromise()
      .then(response => response.json())
      .catch( err => {
        return Promise.reject(err)
      })
  }

}