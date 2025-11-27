import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '@features/orders/models/order';
import { OrderService } from '@features/orders/services/order.service';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, Select, FloatLabel, InputText, Button],
  providers: [DialogService],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  standalone: true,
})
export class ProductFormComponent implements OnInit {
  public form!: FormGroup;
  public products: WritableSignal<Product[]> = signal<Product[]>([]);

  private readonly orderService: OrderService = inject(OrderService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  public readonly ref: DynamicDialogRef = inject(DynamicDialogRef);

  async ngOnInit(): Promise<void> {
    this.createForm();
    const products: Product[] = await this.orderService.getProductList();
    this.products.update((): Product[] => products);
  }

  private createForm(): void {
    this.form = this.fb.group({
      productId: [null, [Validators.required]],
      qty: [null, [Validators.required]],
      price: [0, [Validators.required]],
    });
  }

  public add(): void {
    this.ref.close(this.form.getRawValue());
  }

  public close(): void {
    this.ref.close();
  }

  public getPrice(): void {
    this.form
      .get('price')
      ?.setValue(
        this.products().find(
          (item: Product): boolean => item.id === this.form.get('productId')?.value,
        )?.price,
      );
  }
}
