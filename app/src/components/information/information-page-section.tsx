type Props = {
  title: string;
  children: React.ReactNode;
};

export default function InformationPageSection({ title, children }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-medium text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
