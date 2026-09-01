import { appWorkflow } from "@/content/app-preview";
import { orphanSafeText } from "@/components/ui/orphanSafeText";

export function AppWorkflow() {
  return (
    <div className="workflow-list" aria-label="Nutrition app workflow">
      {appWorkflow.map((item) => (
        <div className="workflow-row" key={item.step}>
          <span>{item.step}</span>
          <h3>{orphanSafeText(item.title)}</h3>
          <p>{orphanSafeText(item.body)}</p>
        </div>
      ))}
    </div>
  );
}
