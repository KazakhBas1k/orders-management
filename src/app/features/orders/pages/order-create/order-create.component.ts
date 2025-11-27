import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Product, ProductItem, Status } from '@features/orders/models/order';
import { OrderService } from '@features/orders/services/order.service';
import { Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '@features/orders/components/product-form/product-form.component';
import { firstValueFrom } from 'rxjs';
import { statuses } from '@features/orders/constants/status';

@Component({
  selector: 'app-order-create',
  imports: [FloatLabel, ReactiveFormsModule, Select, Button, TableModule, InputText],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  standalone: true,
})
export class OrderCreateComponent implements OnInit {
  public orderForm!: FormGroup;
  public items: WritableSignal<ProductItem[]> = signal<ProductItem[]>([]);
  public products: WritableSignal<Product[]> = signal<Product[]>([]);

  private readonly orderService: OrderService = inject(OrderService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);
  private readonly dialogService: DialogService = inject(DialogService);

  protected readonly statuses: Status[] = statuses;

  async ngOnInit(): Promise<void> {
    this.createForm();
    const products: Product[] = await this.orderService.getProductList();
    this.products.update((): Product[] => products);
  }

  private createForm(): void {
    this.orderForm = this.fb.group({
      number: [null, [Validators.required]],
      customerName: [null, [Validators.required]],
      status: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  public async addItem(): Promise<void> {
    const form = this.dialogService.open(ProductFormComponent, {
      header: 'Продукт',
      modal: true,
      dismissableMask: false,
      focusOnShow: false,
    });
    if (form !== null) {
      const product: ProductItem = (await firstValueFrom(form.onClose)) as ProductItem;
      this.items.update((items: ProductItem[]): ProductItem[] => {
        if (items.find((i) => i.productId === product.productId)) {
          return items.map((i) =>
            i.productId === product.productId
              ? {
                  productId: i.productId,
                  qty: i.qty + product.qty,
                  price: i.price,
                }
              : i,
          );
        } else {
          return [...items, product];
        }
      });
    }
    this.calcTotal();
  }

  public removeItem(id: number): void {
    this.items.update((items) => items.filter((i) => i.productId !== id));
    this.calcTotal();
  }

  public async create(): Promise<void> {
    await this.orderService.create({
      id: `${Math.random()}`,
      ...this.orderForm.getRawValue(),
      items: this.items(),
    });
    this.toastService.add('Заказ', 'Успешно создан', 'default');
    await this.router.navigate(['']);
  }

  public getProductNameById(id: number): string {
    return this.products().find((product: Product): boolean => +product.id === id)?.title ?? '';
  }

  public calcTotal(): void {
    this.orderForm.get('total')?.markAsDirty();
    this.orderForm.get('total')?.setValue(this.items().reduce((c, i) => i.price * i.qty + c, 0));
  }
}
