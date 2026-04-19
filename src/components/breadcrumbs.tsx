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
      <button
        type="button"
        onClick={onReset}
        className="rounded border border-transparent px-3 py-1.5 text-stone-300 transition hover:border-[#c9924a]/28 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
      >
        Marr Overview
      </button>
      {area ? (
        <>
          <span className="text-stone-600">/</span>
          <button
            type="button"
            onClick={onAreaReset}
            className="rounded border border-transparent px-3 py-1.5 text-stone-300 transition hover:border-[#c9924a]/28 hover:bg-[#c9924a]/10 hover:text-[#eee7d7]"
          >
            {area.title}
          </button>
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
