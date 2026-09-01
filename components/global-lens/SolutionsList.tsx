import { Eyebrow } from "@/components/ui/Eyebrow";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { solutions } from "@/content/solutions";

export function SolutionsList() {
  return (
    <div className="solutions-wrap">
      <div className="solutions-intro">
        <Eyebrow>Conditions for health</Eyebrow>
        <h3>Healthier lives need <span className="no-orphan">healthier conditions.</span></h3>
        <p>Public-health action can change the environments, services, and policies that shape who has the chance to <span className="no-orphan">be healthy.</span></p>

      </div>

      <ol className="solution-list">
        {solutions.map((solution, index) => (
          <li className="solution-row" key={solution.title}>
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <h4>{orphanSafeText(solution.title)}</h4>
            <p>{orphanSafeText(solution.body)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
