// globals.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Globals {
  role: string = 'test';
  loggedUserFaceId: string='';
   clientdata: Array<any[]>;
   agentData: Array<any[]>;
}