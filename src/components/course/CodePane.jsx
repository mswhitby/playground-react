import { useEffect, useRef, useState } from "react";
import { Code2, Save, Send } from "lucide-react";
import { useSaved } from "../../hooks/useSaved.js";
import { readString, storageKeys, writeString } from "../../lib/storage.js";
import Chip from "../ui/Chip.jsx";
import Splitter from "../ui/Splitter.jsx";
import ConsolePane from "./ConsolePane.jsx";
import { runMockAction } from "./mockActions.js";

/** Code editor over console, with mock Run / Check / Reset / Save / Submit controls. */
export default function CodePane({ lessonId, task }) {
  const codeKey = storageKeys.code(lessonId);
  const workspace = useRef(null);
  const [code, setCode] = useState(task.starter);
  const [consoleText, setConsoleText] = useState(task.console);
  const [savedMessage, setSavedMessage] = useState("");
  const [checksText, setChecksText] = useState("Choose Check to review this draft. Results are for demonstration only.");
  const [consoleTab, setConsoleTab] = useState(task.language === "jsx" ? "Preview" : "Console");
  const [editorHeight, setEditorHeight] = useSaved("designlab:editor-height", 300);

  useEffect(() => {
    setCode(readString(codeKey) ?? task.starter);
    setConsoleText(task.console);
    setChecksText("Choose Check to review this draft. Results are for demonstration only.");
    setConsoleTab(task.language === "jsx" ? "Preview" : "Console");
  }, [codeKey, task]);

  function resizeRows(e) {
    if (!workspace.current) return;
    const rect = workspace.current.getBoundingClientRect();
    setEditorHeight(Math.max(160, Math.min(rect.height - 120, e.clientY - rect.top)));
  }

  function act(action) {
    if (action === "Save") {
      writeString(codeKey, code);
      setSavedMessage("Draft saved in this browser only.");
      return;
    }
    if (action === "Reset") {
      setCode(task.starter);
      setChecksText("Choose Check to review this draft. Results are for demonstration only.");
      setConsoleText(runMockAction("Reset", code, task));
      setConsoleTab(task.language === "jsx" ? "Preview" : "Console");
      return;
    }
    if (action === "Check") {
      setChecksText(runMockAction(action, code, task));
      setConsoleTab("Checks");
      return;
    }
    setConsoleText(runMockAction(action, code, task));
    setConsoleTab("Console");
  }

  return (
    <div className="code-pane">
      <div className="pane-header">
        <strong>
          <Code2 size={16} /> Editor
        </strong>
        <div className="right-meta">
          {task.language.toUpperCase()} <Chip>Demo</Chip>
        </div>
      </div>

      <div className="code-workspace" ref={workspace} style={{ "--editor-height": `${editorHeight}px` }}>
        <textarea
          spellCheck="false"
          className="code-editor"
          aria-label="Code editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setSavedMessage("");
            setChecksText("Your code has changed. Choose Check to review this draft.");
          }}
        />
        <Splitter axis="rows" onDrag={resizeRows} />
        <ConsolePane text={consoleText} checksText={checksText} language={task.language} lessonId={lessonId} activeTab={consoleTab} onTabChange={setConsoleTab} />
      </div>

      <div className="editor-controls">
        <div>
          {["Run", "Check", "Reset"].map((x) => (
            <button key={x} className="btn" onClick={() => act(x)}>
              {x}
            </button>
          ))}
        </div>
        <div>
          <button className="btn" onClick={() => act("Save")}>
            <Save size={15} /> Save
          </button>
          <button className="btn submit" onClick={() => act("Submit")}>
            <Send size={15} /> Submit
          </button>
        </div>
      </div>
      <div className="editor-note">
        {savedMessage ||
          "Drag the dividers to resize your workspace. Runs and checks are examples, not grades."}
      </div>
    </div>
  );
}
