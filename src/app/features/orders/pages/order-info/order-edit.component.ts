import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Order, Product, ProductItem, Status } from '@features/orders/models/order';
import { OrderService } from '@features/orders/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '@shared/services/toast.service';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { statuses } from '@features/orders/constants/status';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '@features/orders/components/product-form/product-form.component';

@Component({
  selector: 'app-order-info',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputText,
    FloatLabel,
    Button,
    Select,
    PrimeTemplate,
    TableModule,
  ],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss',
  standalone: true,
})
export class OrderEdit implements OnInit {
  public orderForm!: FormGroup;
  public orderInfo: WritableSignal<Order | null> = signal<Order | null>(null);
  public items: WritableSignal<ProductItem[]> = signal<ProductItem[]>([]);
  public products: WritableSignal<Product[]> = signal<Product[]>([]);
  public id: number = 0;

  private readonly orderService: OrderService = inject(OrderService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);
  private readonly dialogService: DialogService = inject(DialogService);

  protected readonly statuses: Status[] = statuses;

  async ngOnInit(): Promise<void> {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      const orderInfo: Order = await this.orderService.getOrderById(+id);
      this.orderInfo.update((): Order => orderInfo);
      this.createForm();
      this.items.update((): ProductItem[] => orderInfo.items);
    }
    const products: Product[] = await this.orderService.getProductList();
    this.products.update((): Product[] => products);
  }

  private createForm(): void {
    this.orderForm = this.fb.group({
      number: [this.orderInfo()?.number ?? null, [Validators.required]],
      customerName: [this.orderInfo()?.customerName ?? null, [Validators.required]],
      status: [this.orderInfo()?.status ?? null, [Validators.required]],
      total: [this.orderInfo()?.total ?? null, [Validators.required]],
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

  public async save(): Promise<void> {
    await this.orderService.update(this.id, {
      id: this.id,
      ...this.orderForm.getRawValue(),
      items: this.items(),
    });
    this.toastService.add('Заказ', 'Успешно обновлен', 'default');
    await this.router.navigate(['']);
  }

  public getProductNameById(id: number): string {
    return this.products().find((product: Product): boolean => +product.id === id)?.title ?? '';
  }

  public calcTotal(): void {
    this.orderForm.get('total')?.markAsDirty();
    this.orderForm.get('total')?.setValue(this.items().reduce((c, i) => i.price * i.qty + c, 0));
  }

  public async delete(): Promise<void> {
    this.toastService.add('Заказ', 'Успешно удален', 'default');
    await this.orderService.delete(this.id);
    await this.router.navigate(['']);
  }
}
