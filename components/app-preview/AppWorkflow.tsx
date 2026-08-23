import { appWorkflow } from "@/content/app-preview";

export function AppWorkflow() {
  return (
    <div className="workflow-list" aria-label="Nutrition app workflow">
      {appWorkflow.map((item) => (
        <div className="workflow-row" key={item.step}>
          <span>{item.step}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
