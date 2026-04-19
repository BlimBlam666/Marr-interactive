type TagListProps = {
  label: string;
  values?: string[];
};

export function TagList({ label, values }: TagListProps) {
  if (!values?.length) {
    return null;
  }

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9924a]/80">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded border marr-hairline bg-[#0d0c09]/42 px-2.5 py-1 text-xs text-stone-300"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
