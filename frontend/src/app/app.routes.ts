import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component'; // We will create this next
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyBlogComponent } from './my-blog/my-blog.component';
import { PostPageComponent } from './post-page/post-page.component';
import { DiscoverPageComponent } from './discover-page/discover_component_ts';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'feed', component: HomeComponent },
  { path: 'my-blog', component: MyBlogComponent },
  { path: 'discover', component: DiscoverPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'post/:id', component: PostPageComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
