import { Component } from '@angular/core';
import { ViewUsersService } from '../services/view-users.service';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-view-users',
    templateUrl: './view-users.component.html',
    styleUrls: ['./view-users.component.scss'],
    providers: [CurrencyPipe],
    standalone: false
})
export class ViewUsersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  filters = {
    userID: '',
    username: ''
  };
  constructor(
    private userService: ViewUsersService,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      console.log('Fetched users:', data); 
      this.users = data;
      this.filteredUsers = [...this.users]; 
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  
  applyFilters() {
    this.filteredUsers = this.users.filter(users => {
      return (!this.filters.userID || users.userID.toString().includes(this.filters.userID.toString())) &&
             (!this.filters.username || users.username.toLowerCase().includes(this.filters.username.toLowerCase()));
    });
  }
  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'PHP', 'symbol', '1.2-2') || '';
  }
  isMerchantValue(value: any): boolean {
    return Number(value) === 1;
  }
}
