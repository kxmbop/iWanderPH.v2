import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Ensure Router is imported
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-viewfaq',
  templateUrl: './viewfaq.component.html',
  styleUrls: ['./viewfaq.component.scss'],
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
    { 
      question: 'About account?', 
      open: false,
      steps: [
        { question: 'How do I reset my password', answer: ['Go to the settings.', 'Click the Account Settings and Update your password.'], open: false },
        { 
          question: 'How do I update my profile', 
          answer: [
            'Navigate to Profile',
            ' Click the Edit Profile',
            '  Edit the profile using the ones you like.',
            '  Save it',
          ], 
          open: false 
        },
        { 
          question: 'What is Journey?', 
          answer: [
            'Journey is a record of your travel frequency, based on the number of hotels you book and review.',
          ], 
          open: false 
        }
        
      ]
    },
    { 
      question: 'About booking', 
      answer: ['Go to the login page and click on "Forgot Password."',
                'Go to the login page and click on "Forgot Password."',

      ],  
      open: false 
    },

    { 
      question: 'How do I become a merchant?', 
      open: false,
      steps: [
        { question: 'Step 1: Apply Now', answer: ['Click the "Apply Now" button.'], open: false },
        { 
          question: 'Step 2: Fill Up Business Details', 
          answer: [
            'Provide the following details:',
            '  Business Name',
            '  Email',
            '  Contact Number',
            '  Full Address of the Business',
            '  Select Transportation Services and specify if you provide a Hotel or Resort.'
          ], 
          open: false 
        },
        { 
          question: 'Step 3: Provide Government Information', 
          answer: [
            'Upload the following documents:',
            ' Business TIN',
            ' Barangay Clearance (picture)',
            ' Mayor\'s Permit (picture)',
            ' BIR Form (picture)',
            ' DOT Authorization (picture).'
          ], 
          open: false 
        },
        { 
          question: 'Step 4: Add Room Details', 
          answer: [
            'Provide the following details for your rooms:',
            ' Room Name',
            ' Room Rate',
            ' Select Inclusions (e.g., breakfast, Wi-Fi)',
            ' Select Room View (e.g., sea view, garden view)',
            ' Upload an Image of the Room.'
          ], 
          open: false 
        }
      ]
    }
  ];

  constructor(private router: Router) {}  

  ngOnInit(): void {}

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;

    if (this.faqs[index].steps && !this.faqs[index].open) {
      this.faqs[index].steps.forEach(step => step.open = false);
    }
  }

  toggleStep(faqIndex: number, stepIndex: number): void {
    const steps = this.faqs[faqIndex]?.steps; 
    if (steps) {
      const step = steps[stepIndex]; 
      if (step) {
        step.open = !step.open;
      }
    }
  } 
  
  closeFaq(): void {
    this.showFaq = false;

    
    setTimeout(() => {
      this.router.navigate(['/traveler/settings']); 
    }, 500); 
  }
}
