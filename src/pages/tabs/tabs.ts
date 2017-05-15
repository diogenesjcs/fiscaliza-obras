import { Component } from '@angular/core';

import { ComplaintsPage } from '../complaints/complaints';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ComplaintsPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
