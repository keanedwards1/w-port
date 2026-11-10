/**
 * Three statements, each in its own space: what I do, what I believe, what it leads to.
 * As each one comes on screen, its words surface like they are rising up through water.
 */
const STATEMENTS = [

  'I put people at the heart of great web design.',
  'I lay the groundwork for ideas to flourish.',
];

export function Statements() {
  return (
    <>
      {STATEMENTS.map((line) => (
        <section key={line} className="finale">
          <p className="st-finale" data-reveal="surface">
            {line.split(' ').map((w, i) => (
              <span key={i}><span className="surface-word" style={{ '--w': i } as React.CSSProperties}>{w}</span>{' '}</span>
            ))}
          </p>
        </section>
      ))}
    </>
  );
}
