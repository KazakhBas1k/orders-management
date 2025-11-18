import { Injectable, signal, WritableSignal } from '@angular/core';
import { Toast } from '@shared/models/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter: number = 1;
  public toasts: WritableSignal<Toast[]> = signal<Toast[]>([]);

  add(title: string, message: string, type: 'default' | 'error'): void {
    const id: number = this.counter++;
    const toast: Toast = { id, message, title, type };
    this.toasts.update((toasts: Toast[]): Toast[] => [...toasts, toast]);
    setTimeout((): void => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number): void {
    this.toasts.update((toasts: Toast[]): Toast[] =>
      toasts.filter((toast: Toast): boolean => toast.id !== id),
    );
  }
}
