import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ApiService} from '../../app/apiService';

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html'
})
export class ComplaintPage {
  constructionSites: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private apiService: ApiService) {
      this.constructionSites = navParams.get("cs");
      console.log(this.constructionSites.length);
  }

  addComplaint(){

  }

}
