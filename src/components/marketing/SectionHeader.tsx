type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  align = "left",
  description,
  eyebrow,
  title,
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className={`marketing-eyebrow ${align === "center" ? "justify-center" : ""}`}>
          <span aria-hidden="true" className="marketing-eyebrow-line" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="marketing-heading mt-5">
        {title}
      </h2>
      {description ? (
        <p className="marketing-lead mt-5">
          {description}
        </p>
      ) : null}
    </div>
  );
}
