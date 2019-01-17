import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-newpage',
  templateUrl: 'newpage.html',
})
export class NewpagePage {
  parser: any;
  name: string;
  alt_names: [string];
  urgency: string;
  submit_to_lab: string;
  phone_number: [string];
  nonurgent_reporting_method: string;
  disableButton: any;
  disableButton2: any;

  public disease: any;
  constructor(public plt: Platform, public navParams: NavParams, public http: HTTP, public toastCtrl: ToastController, private callNumber: CallNumber) {
    this.parser = navParams.get('data');
    this.name = navParams.get('disease');

    this.alt_names = this.parser["data"]["diseases"][this.name]["alt_names"];
    this.urgency = this.parser["data"]["urgency_levels"][this.parser["data"]["diseases"][this.name]["urgency_i"]];
    if (this.parser["data"]["diseases"][this.name]["submit_to_lab"] == 1) {
      this.submit_to_lab = "IDPH requires an isolate or clinical materials be submitted to the IDPH laboratory (2121 W. Taylor St. Chicago, IL, 60612, 312-793-1322";
    } else {
      this.submit_to_lab = "N/A";
    }
    this.phone_number = this.parser["data"]["phone_numbers"][this.parser["data"]["diseases"][this.name]["phone_number_i"]];
    if (this.urgency == "Immediate (within 3 hours by phone)") {
      this.nonurgent_reporting_method = "Reports can be made electronically via I-NEDSS or by mail, telephone, or fax; contact corresponding program for disease specific reporting requirements."
    }

    for (var i = 1; i < this.alt_names.length; i++) {
      this.alt_names[i] = " " + this.alt_names[i];
    }
  }


  callingNumber(telephoneNumber: string) {
    if (this.plt.is('cordova')) {
      this.callNumber.isCallSupported()
        .then(function (response) {
          if (response == true) {
            var number = "1"+(telephoneNumber.replace(/\D/g, ''));
            this.callNumber.callNumber(number, true)
              .then(res => console.log('Launched dialer!', res))
              .catch(err => console.log('Error launching dialer', err));
          } else {
            console.log("no working");
          }
        });
    }
  }

  turnNumber(number:string){
    var num = "1"+(number.replace(/\D/g, ''));
    return num;
  }

  afterHoursToast() {
    this.disableButton = true;
    const toast = this.toastCtrl.create({
      message: 'On weekends, holidays, or after hours, call 311 and ask for the communicable disease physician on call.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.disableButton = false;
    });
    toast.present();
  }

  labReqsToast() {
    const toast = this.toastCtrl.create({
      message: 'On weekends, holidays, or after hours, call 311 and ask for the communicable disease physician on call.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });

    toast.present();
  }

  legalToast() {
    this.disableButton2 = true;
    const toast = this.toastCtrl.create({
      message: 'Per the Control of Communicable Disease Code of Illinois, it is the responsibility of physicians, physician assistants, nurses, nurse aides or any other person having knowledge of any of the following diseases, confrmed or suspected, to report the case to the Chicago Department of Public Health (CDPH) within the number or hours or days indicated. This information is reportable by law and allowed by HIPAA CFR §164 512(b).',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.disableButton2 = false;
    });
    toast.present();
  }


}
