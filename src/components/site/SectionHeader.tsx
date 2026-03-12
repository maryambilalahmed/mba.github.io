interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ kicker, title, description }: SectionHeaderProps) {
  return (
    <header className="mb-8 md:mb-10">
      {kicker ? <p className="kicker mb-3">{kicker}</p> : null}
      <h2 className="text-2xl font-semibold text-primary md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
