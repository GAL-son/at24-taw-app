import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LineComponent } from '../../shared/line/line.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, LineComponent],
  providers: [AuthService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }
  ngOnInit(): void { }

  signOut() {
    this.authService.logout()
    .pipe(
      catchError((error) => {return of(false)})
    )
    .subscribe((result: any) => {
      this.router.navigate(['/']);
      return result;
    });
  }
}
