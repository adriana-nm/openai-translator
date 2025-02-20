import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {

  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const usersCollection = collection(this.firestore, 'users');
      const userRef = doc(usersCollection, this.auth.currentUser?.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData: User = userDoc.data() as User;
        localStorage.setItem('token', userData.token);
        this.router.navigate(['/translate']);
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.error(error);
      alert('User not found');
    }
  }
  
}