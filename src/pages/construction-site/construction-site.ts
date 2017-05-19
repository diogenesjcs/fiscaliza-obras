import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-construction-site',
  templateUrl: 'construction-site.html'
})
export class ConstructionSitePage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  constructionSite: any;
  doughnutChart: any;


  constructor(public navCtrl: NavController, public nativeStorage: NativeStorage,
    public appCtrl: App, public navParams: NavParams) {
    this.constructionSite = this.navParams.get('cs');
    console.log(JSON.stringify(this.constructionSite));
    Chart.pluginService.register({
      afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
          var helpers = Chart.helpers;
          var centerConfig = chart.config.options.elements.center;
          var globalConfig = Chart.defaults.global;
          var ctx = chart.chart.ctx;

          var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
          var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

          if (centerConfig.fontSize)
            var fontSize = centerConfig.fontSize;
          // figure out the best font size, if one is not specified
          else {
            ctx.save();
            var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
            var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
            var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

            do {
              ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
              var textWidth = ctx.measureText(maxText).width;

              // check if it fits, is within configured limits and that we are not simply toggling back and forth
              if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                fontSize += 1;
              else {
                // reverse last step
                fontSize -= 1;
                break;
              }
            } while (true)
            ctx.restore();
          }

          // save properties
          chart.center = {
            font: helpers.fontString(fontSize, fontStyle, fontFamily),
            fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
          };
        }
      },
      afterDraw: function (chart) {
        if (chart.center) {
          var centerConfig = chart.config.options.elements.center;
          var ctx = chart.chart.ctx;

          ctx.save();
          ctx.font = chart.center.font;
          ctx.fillStyle = chart.center.fillStyle;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(centerConfig.text, centerX, centerY);
          ctx.restore();
        }
      },
    });
  }

  ionViewDidEnter() {
    const doughnutChart = this.doughnutChart;
    const doughnutCanvas = this.doughnutCanvas;
    this.doughnutChart = new Chart(doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ["À completar", "Progresso até agora"],
        datasets: [{
          label: 'Progresso da obra',
          data: [100 - this.constructionSite.stateId, this.constructionSite.stateId],
          backgroundColor: [
            "#CCCCCC",
            "#36A2EB"
          ],
        }]
      },
      options: {
        legend: {
          display: false
        },
        cutoutPercentage: 80,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          center: {
            // the longest text that could appear in the center
            maxText: '100%',
            text: this.constructionSite.stateId + '%',
            fontColor: '#36A2EB',
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            fontStyle: 'normal',
            // fontSize: 12,
            // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
            // if these are not specified either, we default to 1 and 256
            minFontSize: 1,
            maxFontSize: 256,
          }
        }
      }

    });
  }

}