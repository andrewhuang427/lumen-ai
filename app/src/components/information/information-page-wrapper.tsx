import { Separator } from "../ui/separator";
import InformationPageFooter from "./information-page-footer";

type Props = {
  title: string;
  description?: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export default function InformationPageWrapper({
  title,
  description,
  lastUpdated,
  children,
}: Props) {
  return (
    <div className="w-full overflow-auto py-8 md:py-12 xl:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-2 text-2xl font-medium">{title}</h1>
        {description && (
          <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        )}
        <p className="mb-6 text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        <div className="space-y-6">
          <Separator />
          {children}
          <Separator />
          <InformationPageFooter />
        </div>
      </div>
    </div>
  );
}
