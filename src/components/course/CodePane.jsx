import { useEffect, useRef, useState } from "react";
import { Code2, Save, Send } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import { useSaved } from "../../hooks/useSaved.js";
import { readString, storageKeys, writeString } from "../../lib/storage.js";
import Chip from "../ui/Chip.jsx";
import Splitter from "../ui/Splitter.jsx";
import ConsolePane from "./ConsolePane.jsx";
import { runMockAction } from "./mockActions.js";
import { PythonRunner } from "../../lib/pythonRunner.js";
import { buildPublicChecks, formatPublicCheckResults } from "../../lib/publicPythonChecks.js";

/** Code editor over console, with mock Run / Check / Reset / Save / Submit controls. */
export default function CodePane({ lessonId, task }) {
  const codeKey = storageKeys.code(lessonId);
  const workspace = useRef(null);
  const pythonRunner = useRef(null);
  const [running, setRunning] = useState(false);
  const isPublishedPython = Boolean(task.isPublished && task.language === 'python');
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

  useEffect(() => () => { pythonRunner.current?.dispose(); }, []);

  async function runPublishedPython(action) {
    if (running) return;
    setRunning(true);
    const isCheck = action === 'Check';
    setConsoleTab(isCheck ? 'Checks' : 'Console');
    if (isCheck) setChecksText('Checking published examples…');
    else setConsoleText('Preparing Python…');
    if (!pythonRunner.current) {
      pythonRunner.current = new PythonRunner({
        onStatus: message => { if (!isCheck) setConsoleText(message); }
      });
    }
    try {
      const source = isCheck ? buildPublicChecks(task,code) : code;
      const result = await pythonRunner.current.run(source);
      if (isCheck) {
        setChecksText(result.success
          ? formatPublicCheckResults(result.output,task.cases?.length || 0)
          : 'Checks could not finish. Review your code and try again.');
      } else {
        setConsoleText(result.output || (result.success
          ? 'Program finished with no printed output.'
          : 'The program stopped without output.'));
      }
    } catch (error) {
      const message=String(error?.message || error);
      if(isCheck)setChecksText('Checks unavailable: '+message);
      else setConsoleText('Python unavailable: '+message);
    } finally {setRunning(false);}
  }

  function resizeRows(e) {
    if (!workspace.current) return;
    const rect = workspace.current.getBoundingClientRect();
    setEditorHeight(Math.max(160, Math.min(rect.height - 120, e.clientY - rect.top)));
  }

  function act(action) {
    if (running) return;
    if (isPublishedPython && (action === 'Run' || action === 'Check')) {
      void runPublishedPython(action);
      return;
    }
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
          {task.language.toUpperCase()} <Chip>{isPublishedPython ? 'Practice' : 'Demo'}</Chip>
        </div>
      </div>

      <div className="code-workspace" ref={workspace} style={{ "--editor-height": `${editorHeight}px` }}>
        <CodeEditor value={code} language={task.language} onChange={value => {
          setCode(value);
          setSavedMessage("");
          setChecksText("Your code has changed. Choose Check to review this draft.");
        }}/>
        <Splitter axis="rows" onDrag={resizeRows} />
        <ConsolePane text={consoleText} checksText={checksText} language={task.language} lessonId={lessonId} activeTab={consoleTab} onTabChange={setConsoleTab} />
      </div>

      <div className="editor-controls">
        <div>
          {["Run", "Check", "Reset"].map((x) => (
            <button key={x} className="btn" disabled={running} onClick={() => act(x)}>
              {x}
            </button>
          ))}
        </div>
        <div>
          <button className="btn" disabled={running} onClick={() => act("Save")}>
            <Save size={15} /> Save
          </button>
          <button className="btn submit" disabled={running} onClick={() => act("Submit")}>
            <Send size={15} /> Submit
          </button>
        </div>
      </div>
      <div className="editor-note">
        {savedMessage ||
          (isPublishedPython
            ? 'Run your Python code and check the published examples. No scores are recorded here.'
            : 'Drag the dividers to resize your workspace. Runs and checks are examples, not grades.')}
      </div>
    </div>
  );
}
