import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { localMarkdown, renderMarkdown, splitLesson } from "../../lib/markdown.js";
import { readString, removeKey, storageKeys, writeString } from "../../lib/storage.js";

/** Learn / Practice tabs rendered from Markdown, with an in-browser source editor. */
export default function InstructionsPane({ lessonId }) {
  const sourceMarkdown = localMarkdown(lessonId);
  const draftKey = storageKeys.markdown(lessonId);
  const [doc, setDoc] = useState(sourceMarkdown);
  const [tab, setTab] = useState("learn");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDoc(readString(draftKey) ?? sourceMarkdown);
    setTab("learn");
    setEditing(false);
  }, [draftKey, sourceMarkdown]);

  const parts = useMemo(() => splitLesson(doc), [doc]);
  const raw = tab === "learn" ? parts.learn : parts.practice;
  const html = useMemo(() => renderMarkdown(raw), [raw]);

  return (
    <section className="instructions-pane">
      <div className="pane-header">
        <div className="tabs compact">
          <button className={tab === "learn" ? "active" : ""} onClick={() => setTab("learn")}>
            Learn
          </button>
          <button className={tab === "practice" ? "active" : ""} onClick={() => setTab("practice")}>
            Practice
          </button>
        </div>
        <button
          className={cn("icon-button", editing && "active")}
          title="Toggle Markdown source"
          onClick={() => setEditing(!editing)}
        >
          <FileText size={16} />
        </button>
      </div>

      {editing ? (
        <div className="markdown-source">
          <div className="hint">
            Local browser edit. To update source permanently, edit <code>src/content/{lessonId}.md</code> in
            VS Code.
          </div>
          <textarea
            aria-label="Markdown source"
            value={doc}
            onChange={(e) => {
              setDoc(e.target.value);
              writeString(draftKey, e.target.value);
            }}
          />
          <button
            className="btn"
            onClick={() => {
              removeKey(draftKey);
              setDoc(localMarkdown(lessonId));
            }}
          >
            Reset Markdown preview
          </button>
        </div>
      ) : (
        <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </section>
  );
}
