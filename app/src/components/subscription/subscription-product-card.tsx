import { type Stripe } from "stripe";

type Props = {
  product: Stripe.Product;
  price: Stripe.Price;
};

export default function SubscriptionProductCard({ product, price }: Props) {
  return (
    <div key={product.id} className="flex flex-col gap-4 rounded-md border p-4">
      <SubscriptionProductCardHeader product={product} price={price} />
      <SubscriptionProductCardDescription product={product} />
    </div>
  );
}

function SubscriptionProductCardHeader({ product, price }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-medium">{product.name}</h3>
      <SubscriptionProductCardHeaderPrice price={price} />
    </div>
  );
}

function SubscriptionProductCardHeaderPrice({ price }: Pick<Props, "price">) {
  return (
    <div className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
      {`$${(price.unit_amount ?? 0) / 100} / ${price.recurring?.interval}`}
    </div>
  );
}

function SubscriptionProductCardDescription({ product }: Omit<Props, "price">) {
  return <p className="text-sm text-muted-foreground">{product.description}</p>;
}
