import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ApiService} from '../../app/apiService';
import { ComplaintPage } from '../complaint/complaint';

@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html'
})
export class ComplaintsPage {

  constructionSites: Array<any>;

  constructor(public nav: NavController, private apiService: ApiService) {
    this.apiService.getConstructionSites().subscribe(data => {
      this.constructionSites = data;
    });
  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSites });
  }

}
