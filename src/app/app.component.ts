import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { ApiResponse } from './interface/api-response';
import { Page } from './interface/page';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  usersState$: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);

// wont fire here bcoz we havent subscribed to this observable in our case we used async pipe
  constructor(private userSevice: UserService) { }

  ngOnInit(): void {
    this.usersState$ = this.userSevice.users$().pipe(
      map((response: ApiResponse<Page>) => {
        // this behavioursubject contains our response
        this.responseSubject.next(response);
        console.log(response);
        // now thatt the app is loaded the appstate cannot be empty
        return ({ appState: 'APP_LOADED', appData: response });
      }),
      // startWith - app loading when we send req to backend
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) =>{
        // this.loadingService.loadingOff();
        //of in rxjs returns observable
        return of({ appState: 'APP_ERROR', error })}
        )
    )
  }



  gotToPage(name?: string, pageNumber: number = 0): void {
    this.usersState$ = this.userSevice.users$(name, pageNumber).pipe(
      map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
        console.log(response);
        return ({ appState: 'APP_LOADED', appData: response });
      }),
      startWith({ appState: 'APP_LOADED',appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) =>{
        return of({ appState: 'APP_ERROR', error })}
        )
    )
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.gotToPage(name, direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }
}
