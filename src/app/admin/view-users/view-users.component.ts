import { Component } from '@angular/core';
import { ViewUsersService } from '../services/view-users.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss'
})
export class ViewUsersComponent {
  users: any[] = [];

  constructor(private userService: ViewUsersService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      console.log('Fetched users:', data); 
      this.users = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
}
