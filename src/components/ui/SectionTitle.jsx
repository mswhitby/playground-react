/** Page heading with an optional eyebrow above and actions on the right. */
export default function SectionTitle({ eyebrow, children, actions }) {
  return (
    <div className="page-title-row">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{children}</h1>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
