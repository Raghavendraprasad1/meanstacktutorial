import { Component } from '@angular/core';
import {AuthServiceService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginFormData:any = {};
  constructor(private authSerice: AuthServiceService) { }

  submitForm(loginForm:any)
  {
    console.log(loginForm);

    if(this.loginFormData.email && this.loginFormData.password )
    {
      const postData = {
        email: this.loginFormData.email,
        password : this.loginFormData.password
      }

      // 
      this.authSerice.login(this.loginFormData).subscribe({
        next : (data:any) => {
          console.log("login successfully!", data);
        },
        error: (error:any) =>{
          console.log("error: ", error);
        },
        complete: () =>
        {
          
        }
    });

    }
    // console.log("form submitted successfully!");
  }

}
