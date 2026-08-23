import { Eyebrow } from "@/components/ui/Eyebrow";
import { solutions } from "@/content/solutions";

export function SolutionsList() {
  return (
    <div className="solutions-wrap">
      <div className="solutions-intro">
        <Eyebrow>Solutions &amp; action</Eyebrow>
        <h3>Better choices need better conditions.</h3>
        <p>Better nutrition depends on the conditions around people: access, affordability, safety, services, and policy.</p>

      </div>

      <ol className="solution-list">
        {solutions.map((solution, index) => (
          <li className="solution-row" key={solution.title}>
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <h4>{solution.title}</h4>
            <p>{solution.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
