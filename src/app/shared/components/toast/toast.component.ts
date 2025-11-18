import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  standalone: true,
})
export class ToastComponent {
  public readonly toastService: ToastService = inject(ToastService);
}
