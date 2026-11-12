import { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/show-hint.css';

export function modeForLanguage(language) {
  if (language === 'python') return 'python';
  if (language === 'csharp') return 'text/x-csharp';
  if (language === 'java') return 'text/x-java';
  if (language === 'jsx') return { name: 'javascript', jsx: true };
  if (language === 'javascript') return 'javascript';
  if (language === 'html') return 'htmlmixed';
  if (language === 'css') return 'css';
  return 'text/plain';
}

/** Bundle the same CodeMirror 5 editor family used by the published Playground. */
export default function CodeEditor({ value, onChange, language }) {
  const inputRef = useRef(null);
  const editorRef = useRef(null);
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  useEffect(() => {
    const editor = CodeMirror.fromTextArea(inputRef.current, {
      mode: modeForLanguage(language),
      lineNumbers: true,
      lineWrapping: false,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      smartIndent: true,
      electricChars: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      extraKeys: {
        Tab(cm) {
          if (cm.somethingSelected()) cm.execCommand('indentMore');
          else {
            const spaces = cm.getOption('indentUnit') - (cm.getCursor().ch % cm.getOption('indentUnit'));
            cm.replaceSelection(' '.repeat(spaces), 'end');
          }
        },
        'Shift-Tab': cm => cm.execCommand('indentLess'),
        'Ctrl-Space': cm => cm.showHint({ hint: CodeMirror.hint.anyword, completeSingle: false }),
      }
    });
    editor.getInputField().setAttribute('aria-label', 'Code editor');
    editor.on('change', cm => changeRef.current?.(cm.getValue()));
    editorRef.current = editor;
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => editor.refresh()) : null;
    observer?.observe(editor.getWrapperElement());
    return () => {
      observer?.disconnect();
      editor.toTextArea();
      editorRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== value) {
      const cursor = editor.getCursor();
      editor.setValue(value ?? '');
      editor.setCursor(cursor);
    }
  }, [value]);

  return <div className="code-editor-wrap">
    <textarea ref={inputRef} aria-label="Code editor" defaultValue={value} spellCheck={false}/>
  </div>;
}
