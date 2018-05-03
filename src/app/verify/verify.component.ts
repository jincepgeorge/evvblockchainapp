import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';
import { AngularFirestore } from 'angularfire2/firestore';


  
declare let cordova: any;
declare let  navigator: any;

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})


export class VerifyComponent implements OnInit {
  public base64Image : string;
  public clientdata: Observable<any[]>;

  constructor(private db: AngularFirestore,private route: ActivatedRoute,private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,private globals: Globals) { 

    this.route.params.subscribe( params => {
      console.log(params);
      this.base64Image=params['imagePath']
      this.spinnerService.hide();
    });
    
  }

  ngOnInit() {
    this.clientdata = this.db.collection('/clientlist').valueChanges();
  }
  verifyImage(){
    this.spinnerService.show();

    this.authService.getFaceId(this.base64Image).subscribe(res => {
      
      if(res!=undefined && res.length>0){
        this.authService.verifyImage(res[0].faceId,this.globals.loggedUserFaceId).subscribe(result =>{
          console.log(result);
          if(result!=undefined){
            this.spinnerService.hide();
            if(result.confidence>0.5){
              alert('Verification and checkin  Success');
              this.checkLocation();
            }
            else{
              alert('Verification Failed');
            }
          }
        })
      }
      else{
        this.spinnerService.hide();
        alert('There is no face detected in the captured image.');
      }
    });
  }

  checkLocation(){
    var onSuccess = function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');

            if(this.globals.clientdata != null){
             let  clientLocation = this.globals.clientdata.location;
             clientLocation.lng = clientLocation.long;
             console.log("cloent Locaiton"+clientLocation);
            }

  };


  // onError Callback receives a PositionError object
  //
  function onError(error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  
    }

      arePointsNear(checkPoint, centerPoint, km) {
      var ky = 40000 / 360;
      var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
      var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
      var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
      return Math.sqrt(dx * dx + dy * dy) <= km;
  }
    
  
 

}
