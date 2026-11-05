import { Terminal } from "lucide-react";

export default function ConsolePane({ text }) {
  return (
    <section className="console-pane">
      <div className="console-heading">
        <Terminal size={15} /> Console <span>Mock output</span>
      </div>
      <pre>{text}</pre>
    </section>
  );
}
