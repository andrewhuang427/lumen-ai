import { type Stripe } from "stripe";

type Props = {
  name: string;
  description: string;
  price: Stripe.Price;
};

export default function SubscriptionProductCard({
  name,
  description,
  price,
}: Props) {
  return (
    <div key={name} className="flex flex-col gap-4 rounded-md border p-4">
      <SubscriptionProductCardHeader name={name} price={price} />
      <SubscriptionProductCardDescription description={description} />
    </div>
  );
}

function SubscriptionProductCardHeader({
  name,
  price,
}: Pick<Props, "name" | "price">) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-medium">{name}</h3>
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

function SubscriptionProductCardDescription({
  description,
}: Pick<Props, "description">) {
  return <p className="text-sm text-muted-foreground">{description}</p>;
}
