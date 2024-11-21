import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-viewfaq',
  templateUrl: './viewfaq.component.html',
  styleUrl: './viewfaq.component.scss',
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'translateX(0)' })),
      state('false', style({ transform: 'translateX(100%)' })),
      transition('false => true', animate('300ms ease-in')),
      transition('true => false', animate('300ms ease-out'))
    ])
  ]

})
export class ViewFaqComponent implements OnInit {
  showFaq: boolean = true; 

  faqs = [
    { question: ' How do I create an account?', answer: 'Click the Sign Up button and complete the form.', open: false },
    { question: ' How do I reset my password?', answer: 'Go to the login page and click on "Forgot Password."', open: false },
    { question: ' How do I update my profile?', answer: 'Navigate to Settings > Account > Update Profile.', open: false}
    
  ];

  constructor() {}

  ngOnInit(): void {}

  closeFaq(): void {
    this.showFaq = false;
  }
}
