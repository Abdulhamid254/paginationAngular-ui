import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
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

// wont fire here bcoz we havent subscribed to this observable in our case we used async pipe
  constructor(private userSevice: UserService) { }

  ngOnInit(): void {
    this.usersState$ = this.userSevice.users$().pipe(
      map((response: ApiResponse<Page>) => {
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
}
