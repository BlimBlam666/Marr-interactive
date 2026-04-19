import type { ContentNode, GazetteerContent } from "@/content/types";
import { getNodeById, getRelatedNodes } from "@/content/validation";
import { TagList } from "./tag-list";

type InfoPanelProps = {
  content: GazetteerContent;
  node?: ContentNode;
  gmEnabled: boolean;
  onSelectNode?: (node: ContentNode) => void;
};

export function InfoPanel({ content, node, gmEnabled, onSelectNode }: InfoPanelProps) {
  if (!node) {
    return (
      <aside className="marr-panel rounded p-5">
        <p className="marr-kicker">
          Gazetteer
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[#eee7d7]">Choose a landmark</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Hover the map to reveal interactive regions, then select a landmark to focus the map
          and read its player-facing entry.
        </p>
      </aside>
    );
  }

  const relatedNodes = getRelatedNodes(
    content,
    node.related?.filter((related) => gmEnabled || !related.gmOnly),
  );
  const childNodes = node.childNodeIds
    ?.map((id) => getNodeById(content, id))
    .filter((child): child is ContentNode => Boolean(child));

  return (
    <aside className="marr-panel max-h-none overflow-hidden rounded lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
      <div className="border-b marr-hairline p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="marr-kicker">
              {node.category} / {node.map?.layer ?? "unmapped"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#eee7d7]">{node.title}</h2>
          </div>
          {node.zoomTarget ? (
            <span className="rounded border marr-hairline bg-black/20 px-2.5 py-1 text-xs text-stone-400">
              x{node.zoomTarget.scale}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium leading-6 text-[#e7dcc3]">{node.playerSummary}</p>
        <p className="mt-3 text-sm leading-6 text-stone-300">{node.playerDescription}</p>
      </div>

      <div className="space-y-5 px-5 pb-5">
        {node.hooks?.length ? (
          <SectionList title="Hooks" values={node.hooks} accent="ember" />
        ) : null}

        {node.rumors?.length ? <SectionList title="Rumors" values={node.rumors} accent="ash" /> : null}

        {node.sensoryDetails?.length ? (
          <SectionList title="Sensory Details" values={node.sensoryDetails} accent="ash" />
        ) : null}

        {childNodes?.length ? (
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9924a]/80">
              Drilldown
            </h3>
            <div className="grid gap-2">
              {childNodes.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => onSelectNode?.(child)}
                  className="rounded border marr-hairline bg-[#0d0c09]/34 px-3 py-2 text-left transition hover:border-[#c9924a]/32 hover:bg-[#c9924a]/10"
                >
                  <span className="block text-sm font-medium text-[#eee7d7]">{child.title}</span>
                  <span className="block text-xs text-stone-500">{child.category}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {relatedNodes.length ? (
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9924a]/80">
              Related
            </h3>
            <div className="grid gap-2">
              {relatedNodes.slice(0, 6).map(({ link, node: relatedNode }) => (
                <button
                  key={`${link.relationship}-${relatedNode.id}`}
                  type="button"
                  onClick={() => onSelectNode?.(relatedNode)}
                  className="rounded border marr-hairline bg-[#0d0c09]/34 px-3 py-2 text-left transition hover:border-[#c9924a]/32 hover:bg-[#c9924a]/10"
                >
                  <span className="block text-sm font-medium text-[#eee7d7]">
                    {link.label ?? relatedNode.title}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.16em] text-stone-500">
                    {link.relationship} / {relatedNode.category}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {node.discoveryHooks?.length ? (
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9924a]/80">
              Discovery Hooks
            </h3>
            <div className="space-y-2">
              {node.discoveryHooks.map((hook) => (
                <div key={hook.key} className="rounded border marr-hairline bg-black/15 px-3 py-2">
                  <p className="text-sm text-stone-100">{hook.label}</p>
                  <p className="text-xs text-stone-500">{hook.key}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <TagList label="Tags" values={node.tags} />

        {gmEnabled && node.gm ? (
          <section className="rounded border border-[#8b3a2f]/38 bg-[#8b3a2f]/14 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f1d1c8]">
              GM-Only
            </h3>
            {node.gm.description ? (
              <p className="mt-3 text-sm leading-6 text-[#f1d1c8]/90">{node.gm.description}</p>
            ) : null}
            {node.gm.secrets?.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#f1d1c8]/88">
                {node.gm.secrets.map((secret) => (
                  <li key={secret} className="border-l border-[#8b3a2f]/55 pl-3">
                    {secret}
                  </li>
                ))}
              </ul>
            ) : null}
            {node.gm.notes?.length ? (
              <div className="mt-4 space-y-2 text-sm leading-6 text-[#f1d1c8]/78">
                {node.gm.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            ) : null}
            {node.gm.statBlocks?.map((statBlock) => (
              <div key={statBlock.id} className="mt-4 rounded border border-[#8b3a2f]/24 bg-black/24 p-3 text-sm text-[#f1d1c8]/86">
                <p className="font-semibold">{statBlock.name}</p>
                <p className="text-[#f1d1c8]/66">{statBlock.role}</p>
                {statBlock.instincts?.length ? (
                  <p className="mt-2">
                    <span className="text-[#f1d1c8]">Instincts:</span>{" "}
                    {statBlock.instincts.join("; ")}
                  </p>
                ) : null}
                {statBlock.abilities?.length ? (
                  <p className="mt-1">
                    <span className="text-[#f1d1c8]">Abilities:</span>{" "}
                    {statBlock.abilities.join("; ")}
                  </p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </aside>
  );
}

function SectionList({
  title,
  values,
  accent,
}: {
  title: string;
  values: string[];
  accent: "ember" | "ash";
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9924a]/80">
        {title}
      </h3>
      <ul className="space-y-2 text-sm leading-6 text-stone-300">
        {values.map((value) => (
          <li
            key={value}
            className={`border-l pl-3 ${
              accent === "ember" ? "border-[#c9924a]/34" : "border-[#e7dcc3]/14"
            }`}
          >
            {value}
          </li>
        ))}
      </ul>
    </section>
  );
}
