import { createActionGroup, props } from '@ngrx/store';
import { Auth } from '@auth/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    login_action: props<{ email: string; password: string }>(),
    login_access_action: props<{ auth: Auth }>(),
    login_failure_action: props<{ error: string }>(),
    logout_action: props<{ pop: string }>(),
  },
});
