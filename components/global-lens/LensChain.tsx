import { Eyebrow } from "@/components/ui/Eyebrow";
import { lensChain } from "@/content/global-lens";

// The connector rule between steps is what makes this read as one chain
// rather than three interchangeable cards.
export function LensChain() {
  return (
    <div className="lens-chain" aria-label="Three connected levels of public health understanding">
      {lensChain.map((item, index) => (
        <div key={item.step}>
          <div className="lens-step">
            <span className="step-number">{item.step}</span>
            <div>
              <Eyebrow>{item.level}</Eyebrow>
              <h3>{item.claim}</h3>
              <p>{item.detail}</p>
            </div>
          </div>
          {index < lensChain.length - 1 ? (
            <div className="lens-connector" aria-hidden="true">
              <span className="lens-connector-line" />
              <span className="lens-connector-arrow">↓</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
