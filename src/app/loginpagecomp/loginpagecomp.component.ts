import { Component } from '@angular/core'; 
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-loginpagecomp',
  templateUrl: './loginpagecomp.component.html',
  styleUrls: ['./loginpagecomp.component.sass']
})
export class LoginpagecompComponent  { 

  confirm:string = ''; 
  username:string = 'test@testmail.com' 
  password:string = 'test123'  
 angForm : FormGroup;
  constructor(private router:Router,
   private fb : FormBuilder) {  
    this.angForm = this.fb.group({ 
      name:['',Validators.required], 
      pass:['', Validators.required]

    })
   }
  
 

  Submit(mail:any, word:any){   
    if(this.username==mail && this.password==word){ 
     this.router.navigate(['upload']) 
    } 
    else{ 
      this.confirm='error' 
      console.log(mail, word)
    }

  } 

}

