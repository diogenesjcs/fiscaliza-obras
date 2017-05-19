import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { ComplaintPage } from '../complaint/complaint';
import { ConstructionSitePage } from '../construction-site/construction-site';
import { DomSanitizer } from '@angular/platform-browser';
import * as config from '../../app/global';

@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html'
})
export class ComplaintsPage {

  constructionSites: Array<any>;
  complaints: Array<any>;
  constructor(public nav: NavController, private apiService: ApiService,
    public view: ViewController, public _DomSanitizationService: DomSanitizer) {
  }
  goToAddComplaint() {
    this.nav.push(ComplaintPage, { cs: this.constructionSites });
  }
  goToConstructionSite(cs) {
    this.nav.push(ConstructionSitePage, { cs: cs });
  }
  doImageResize(img, callback, MAX_WIDTH: number = 50, MAX_HEIGHT: number = 50) {
    var canvas = document.createElement("canvas");

    var image = new Image();

    image.onload = function () {
      console.log("Size Before: " + image.src.length + " bytes");

      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = 50;
      canvas.height = 50;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      callback(dataUrl)
    }

    image.src = img;
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

          complaint.image = complaint.images[0];
          return complaint;
        });
      });
    });


  }

}
