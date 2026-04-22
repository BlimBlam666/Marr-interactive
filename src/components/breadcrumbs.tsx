import type { AreaDefinition, ContentNode } from "@/content/types";

type BreadcrumbsProps = {
  area?: AreaDefinition;
  selectedNode?: ContentNode;
  onReset: () => void;
  onAreaReset: () => void;
};

export function Breadcrumbs({ area, selectedNode, onReset, onAreaReset }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Map breadcrumbs"
      className="flex flex-wrap items-center gap-2 rounded border marr-hairline bg-[#17140f]/55 p-1.5 text-sm"
    >
      <a
        href="/map"
        onClick={(event) => {
          event.preventDefault();
          onReset();
        }}
        className="rounded border border-transparent px-3 py-1.5 text-stone-300 transition hover:border-[#c9924a]/28 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
      >
        Marr Overview
      </a>
      {area ? (
        <>
          <span className="text-stone-600">/</span>
          <a
            href={`/map?area=${encodeURIComponent(area.id)}`}
            onClick={(event) => {
              event.preventDefault();
              onAreaReset();
            }}
            className="rounded border border-transparent px-3 py-1.5 text-stone-300 transition hover:border-[#c9924a]/28 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
          >
            {area.title}
          </a>
        </>
      ) : null}
      {selectedNode ? (
        <>
          <span className="text-stone-600">/</span>
          <span className="rounded border border-[#c9924a]/35 bg-[#c9924a]/12 px-3 py-1.5 text-[#eee7d7]">
            {selectedNode.title}
          </span>
        </>
      ) : null}
    </nav>
  );
}
