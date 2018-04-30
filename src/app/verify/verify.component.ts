import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  public base64Image : string;
  constructor(private route: ActivatedRoute,private spinnerService: Ng4LoadingSpinnerService,private authService: AuthService,private globals: Globals) { 

    this.route.params.subscribe( params => {
      console.log(params);
      this.base64Image=params['imagePath']
      this.spinnerService.hide();
    });
    
  }

  ngOnInit() {
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

}
