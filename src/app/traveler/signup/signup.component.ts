import { Component } from '@angular/core';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  currentStep: number = 1;

  // Form fields
  gcashNumber: string = '';  
  firstName: string = '';    
  lastName: string = '';     
  address: string = '';      
  profilePic: File | null = null; 
  bio: string = '';          
  email: string = '';        
  username: string = '';     
  password: string = '';     
  confirmPassword: string = '';
  otpCode: string = ''; // OTP field, but not stored

  constructor(private signupService: SignupService) {}

  // Proceed to the next step
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  // Go back to the previous step
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Handle file upload for profile picture
  onFileChange(event: any) {
    this.profilePic = event.target.files[0];
  }

  // Handle form submission
  onSubmit() {
    const formData = new FormData();
    formData.append('gcashNumber', this.gcashNumber); // Store GCash number in Mobile column
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('address', this.address);
    formData.append('profilePic', this.profilePic as Blob);
    formData.append('bio', this.bio);
    formData.append('email', this.email);
    formData.append('username', this.username);
    formData.append('password', this.password);

    // Call the service to submit the form data
    this.signupService.signup(formData).subscribe(response => {
      console.log('Signup successful', response);
    }, error => {
      console.error('Error during signup', error);
    });
  }
}
//end of the code

