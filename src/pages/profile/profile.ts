import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ApiService } from '../../app/apiService';
import { NativeStorage } from '@ionic-native/native-storage';
import { ConstructionSitePage } from '../construction-site/construction-site';


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    constructionSites: Array<any>;
    complaints: Array<any>;
    public name: string;
    public email: string;
    public picture: string;
    constructor(private apiService: ApiService, public navCtrl: NavController,
        private nativeStorage: NativeStorage, public loadingCtrl: LoadingController) {

    }

    goToConstructionSite(cs) {
        this.navCtrl.push(ConstructionSitePage, { cs: cs });
    }

    ionViewWillEnter() {

        this.nativeStorage.getItem('user')
            .then(
            data => {
                this.name = data.name;
                this.email = data.email;
                this.picture = data.picture;
            },
            error => console.error(error)
            );
    }


    ionViewDidEnter() {
        let loading = this.loadingCtrl.create({
            content: 'Carregando...',
            spinner: 'crescent'
        });
        loading.present();
        const profileObj = this;
        profileObj.nativeStorage.getItem('user')
            .then(function (data) {
                const user = data;
                profileObj.apiService.getConstructionSites().subscribe(cs => {
                    profileObj.constructionSites = cs;
                    profileObj.apiService.getComplaintsByEmail(user.email).subscribe(c => {
                        profileObj.complaints = c.map((complaint) => {
                            complaint.constructionSite = profileObj.constructionSites.find(csData => csData._id == complaint.constructionSite);
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
                        loading.dismiss();
                    });
                });
            });
    }

}
