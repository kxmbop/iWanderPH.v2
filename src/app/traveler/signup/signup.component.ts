import { ChangeDetectorRef, Component } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: false
})
export class SignupComponent {
  currentStep: number = 1;
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
  otpCode: string = ''; 
  generatedOtp: string = '';
  otpSent: boolean = false;  
  loading: boolean = false;  
  profilePicture: string | ArrayBuffer | null = null;
  usernameMessage: string = '';
  usernameMessageColor: string = ''; 


  constructor(private signupService: SignupService, private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  nextStep() {
    if (this.currentStep === 3) {
      // Validate required fields in Step 3
      if (!this.firstName || !this.lastName || !this.gcashNumber || !this.address) {
        alert('Please fill out all required fields!');
        return;
      }
  
      // Validate GCash number
      const gcashPattern = /^[0-9]{11}$/;
      if (!gcashPattern.test(this.gcashNumber)) {
        alert('Invalid number! It must be exactly 11 digits and contain only numbers.');
        return;
      }
      if (!this.profilePic) {
        alert('Please upload a profile picture to proceed.');
        return;
      }
    }
  
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }
  

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profilePic = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result; 
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    if (!this.isPasswordValidLength() || !this.isPasswordValidLetterNumber() || !this.isPasswordValidSpecialCharacter()) {
      alert('Password does not meet the required criteria. Please review the password hints.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match! Please re-enter.');
      return;
    }

    const formData = new FormData();
    formData.append('gcashNumber', this.gcashNumber); 
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('address', this.address);
    formData.append('bio', this.bio);
    formData.append('email', this.email);
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('confirmPassword', this.confirmPassword);
  
    if (this.profilePic) {
      formData.append('profilePic', this.profilePic, this.profilePic.name);  
    } else {
      console.error('Profile picture is not selected');
      alert('Please select a profile picture.');
      return; 
    }
  
    this.signupService.signup(formData).subscribe(
      (response) => {
        console.log('Signup successful', response);
        alert('Signup successful! Welcome to the platform.');
        this.router.navigate(['traveler/login']);
      },
      (error) => {
        console.error('Error during signup', error);
        alert('Signup failed. Please try again.');
      }
    );
  }
  

  generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = otp;
    return otp;
  }

  sendOtp() {
    this.loading = true;
    const otp = this.generateOtp();
    const body = { email: this.email, otp };
  
    this.http.post('http://localhost:3000/send-otp', body, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('OTP sent successfully:', response);  
          this.otpSent = true;
          this.loading = false;
          this.cdr.detectChanges();  
        },
        error: (error) => {
          console.error('Error sending OTP:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
  

  verifyOtp() {
    if (this.otpCode === this.generatedOtp) {
      console.log('OTP verified successfully');
    } else {
      console.error('Invalid OTP');
    }
  }

  checkUsernameAvailability() {
    if (this.username.length === 0) {
      this.usernameMessage = ''; // Clear message if username is empty
      this.usernameMessageColor = '';
      return;
    }

    const payload = { username: this.username };

    this.http.post<any>(`${environment.apiUrl}/traveler/check_username.php`, payload)
      .subscribe(
        (response) => {
          if (response.isTaken) {
            this.usernameMessage = 'Username is already taken. Please choose another one.';
            this.usernameMessageColor = 'red'; // Set color to red if username is taken
          } else {
            this.usernameMessage = 'Username is available!';
            this.usernameMessageColor = 'green'; // Set color to green if username is available
          }
        },
        (error) => {
          console.error('Error checking username availability:', error);
          this.usernameMessage = 'Error checking username availability. Please try again.';
          this.usernameMessageColor = 'red'; // Set color to red on error
        }
      );
  }
  togglePasswordVisibility(fieldId: string, toggleIconId: string): void {
    const passwordInput = document.getElementById(fieldId) as HTMLInputElement;
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon?.classList.remove('fa-eye');
      toggleIcon?.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleIcon?.classList.remove('fa-eye-slash');
      toggleIcon?.classList.add('fa-eye');
    }
  }
  validatePassword() {
    this.isPasswordValidLength();
    this.isPasswordValidLetterNumber();
    this.isPasswordValidSpecialCharacter();
  }
  
  isPasswordValidLength(): boolean {
    return this.password.length >= 8 && this.password.length <= 20;
  }
  
  isPasswordValidLetterNumber(): boolean {
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    return letterRegex.test(this.password) && numberRegex.test(this.password);
  }
  
  isPasswordValidSpecialCharacter(): boolean {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharRegex.test(this.password);
  }
  
  
  
}
