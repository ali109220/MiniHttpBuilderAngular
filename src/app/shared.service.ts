
import { Inject, Injectable, InjectionToken, Optional  } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
@Injectable({
  providedIn: 'any'
})
export class SharedService {

  private http: HttpClient;
  private baseUrl: string;
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : '';
  }
  getDocumentForUpdate(documentId:any): Observable<any> {
    let url_ = this.baseUrl + 'HtmlDocument/GetOne?';
    if (documentId === null)
      throw new Error("The parameter 'id' cannot be null.");
    else if (documentId !== undefined)
      url_ += "id=" + encodeURIComponent("" + documentId) + "&";
    url_ = url_.replace(/[?&]$/, '');
    return this.http
      .get(`${url_}`);
  }
  UploadAsHml(body:  any): Observable<any> {
    let url_ = this.baseUrl + "HtmlDocument/UploadAsHml";
    url_ = url_.replace(/[?&]$/, "");
    return this.http.post(url_, body);
}
  DownloadAsHml(): Observable<any> {
    let url_ = this.baseUrl + "HtmlDocument/DownloadAsHml";
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        responseType: "text"
    };

    return this.http.post(url_, options_);
}
  delete(documentId:any): Observable<any> {
    let url_ = this.baseUrl + 'HtmlDocument?';
    if (documentId === null)
      throw new Error("The parameter 'id' cannot be null.");
    else if (documentId !== undefined)
      url_ += "id=" + encodeURIComponent("" + documentId) + "&";
    url_ = url_.replace(/[?&]$/, '');
    return this.http
      .delete(`${url_}`);
  }
  getAllDocuments(): Observable<any> {
    let url_ = this.baseUrl + 'HtmlDocument';
    url_ = url_.replace(/[?&]$/, '');
    return this.http
      .get(`${url_}`);
  }
  addNewHtmlDocument(body: any): Observable<any> {
    let url_ = this.baseUrl + 'HtmlDocument';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);
    return this.http
      .post(`${url_}`, body);
  }
  updateHtmlDocument(body: any): Observable<any> {
    let url_ = this.baseUrl + 'HtmlDocument';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);
    return this.http
      .put(`${url_}`, body);
  }
}
@Injectable({
  providedIn: 'any'
})
export class UserService {
  private http: HttpClient;
  private baseUrl: string;
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : '';
  }
  register(body: any): Observable<any> {
    let url_ = this.baseUrl + 'Authenticate/register';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);
    return this.http
      .post(`${url_}`, body);
  }
  login(body: any): Observable<any> {
    let url_ = this.baseUrl + 'Authenticate/login';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);
    return this.http
      .post(`${url_}`, body);
  }
}
@Injectable({ providedIn: 'any' })
export class HandleErrorService {
  constructor(
    // private _toaster: ToastrService
    ) {

  }
  handleErr(err: any) {
    let errMsg = "";
    try {
      if (err.error instanceof ErrorEvent) {
        errMsg = err.error.message;
      }
      else
        switch (err.status) {
          case 400:
            errMsg = `${err.status} bad request.`;
            break;
          case 401:
            errMsg = `${err.status} you are unauthorized to do this action.`;
            break;
          case 403:
            errMsg = `${err.status} you don't have permission to access the requested resource.`;
            break;
          case 404:
            errMsg = `${err.status} the requested resource doesn't exist.`;
            break;
          case 500:
            errMsg = `${err.status} Internal server error.`;
            break;
          default:
            errMsg = err.message;
            break;
        }
    } catch (e) {
      errMsg = 'Something went wrong';
    }
    // this._toaster.error(errMsg, "Error", {
    //   timeOut: 5000,
    //   positionClass: 'toast-bottom-right',
    // });
  }
}
@Injectable({ providedIn: 'any' })
export class AppHttpInterceptor implements HttpInterceptor {
  private appMsgSource = new Subject<string>();
  appMsg$ = this.appMsgSource.asObservable();
  constructor(private _errorService: HandleErrorService) {

  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthHeader(req);
    return next.handle(req).do((event: HttpEvent<any>) => {
      

      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        var jwt = event.headers.get('Authorization');
        if (jwt != null || undefined) {
          jwt = "" + jwt;
          localStorage.setItem('x-access-token', jwt);
        }
        this.appMsgSource.next("success");
      }
    }, (err: any) => {
      this._errorService.handleErr(err);
    });

  }
  addAuthHeader(request: HttpRequest<any>) {
    // get the access token
    const token = this.getAccessToken();
    if (token) {
      // append the access token to the request header
      return request.clone({
        setHeaders: {
          'Authorization': "Bearer " + token
        }
      })
    }
    return request;
  }
  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

}
