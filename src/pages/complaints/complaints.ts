import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { ComplaintPage } from '../complaint/complaint';

@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html'
})
export class ComplaintsPage {

  constructionSites: Array<any>;
  complaints: Array<any>;
  constructor(public nav: NavController, private apiService: ApiService, public view: ViewController) {
  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSites });
  }
  ionViewDidEnter() {
    this.apiService.getConstructionSites().subscribe(cs => {
      this.constructionSites = cs;
      this.apiService.getComplaints().subscribe(c => {
        this.complaints = c.map((complaint) => {
          complaint.constructionSite = this.constructionSites.find(csData => csData._id == complaint.constructionSite);
          let impact = "";
          switch (complaint.impact) {
            case 0:
              impact = "Se sentiu muito pouco impactado pela obra.";
              break;
            case 1:
              impact = "Se sentiu pouco impactado pela obra.";
              break;
            case 2: impact = "Se sentiu moderadamente impactado pela obra.";
              break;
            case 3: impact = "Se sentiu impactado pela obra.";
              break;
            case 4: impact = "Se sentiu muito impactado pela obra.";
              break;
            case 5: impact = "Se sentiu muito impactado pela obra.";
              break;
          }
          complaint.impact = impact;
          return complaint;
        });
      });
    });


  }

}
