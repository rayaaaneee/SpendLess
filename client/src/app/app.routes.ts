import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SpendComponent } from './pages/spend/spend.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './pages/auth/auth.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'spend',
    component: SpendComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: AuthComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'wallet',
    component: WalletComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'newcat',
    component: CategoryComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path:'**',
    component: NotFoundComponent,
    pathMatch: 'full',
  }
];
