import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as config from './global';

@Injectable()
export class ApiService {
  constructor(private http: Http) { }
  getConstructionSites(): Observable<Array<any>> {
    return this.http.get(config.domain + "api/getConstructionSites")
      .map(this.extractData)
      .catch(this.handleError);
  }

  addComplaint(complaint): Observable<any> {
    return this.http.post(config.domain + "api/addComplaint", complaint)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getComplaints(): Observable<Array<any>> {
    return this.http.get(config.domain + "api/getComplaints")
      .map(this.extractData)
      .catch(this.handleError);
  }
  getComplaintsByEmail(email): Observable<Array<any>> {
    return this.http.get(config.domain + "api/getComplaints?email="+email)
      .map(this.extractData)
      .catch(this.handleError);
  }
  addUser(user): Observable<any> {
    return this.http.post(config.domain + "signup", user)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


}
