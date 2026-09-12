import { ExternalLink } from "@/components/ui/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { siteConfig } from "@/content/site-config";
import { sources } from "@/content/sources";

const sourceGroups = sources.reduce(
  (groups, source) => {
    const organization = source.organization.startsWith("UNICEF") ? "UNICEF" : source.organization;
    const group = groups.find((item) => item.organization === organization);

    if (group) {
      group.sources.push(source);
    } else {
      groups.push({ organization, sources: [source] });
    }

    return groups;
  },
  [] as Array<{ organization: string; sources: typeof sources }>,
);

function formatReviewedDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function SourcesSection() {
  return (
    <SectionShell id="sources" surface="white" labelledBy="sources-title" className="sources-section">
      <div className="page-width sources-grid">
        <SectionHeading
          eyebrow="Evidence Base"
          title={<>Sources behind <span className="no-orphan">the lens.</span></>}
          id="sources-title"
          level="h1"
        />
        <div className="source-list">
          <table className="source-table">
            <caption className="sr-only">Evidence sources by organization</caption>
            <colgroup>
              <col className="source-col-index" />
              <col className="source-col-organization" />
              <col />
              <col className="source-col-reviewed" />
            </colgroup>
            <thead>
              <tr>
                <th className="source-table-heading" scope="col" role="columnheader">No.</th>
                <th className="source-table-heading" scope="col" role="columnheader">Organization</th>
                <th className="source-table-heading" scope="col" role="columnheader">Source</th>
                <th className="source-table-heading" scope="col" role="columnheader">Last reviewed</th>
              </tr>
            </thead>
            <tbody>
              {sourceGroups.map((group, groupIndex) =>
                group.sources.map((source, sourceIndex) => (
                  <tr key={`${source.organization}-${source.title}`}>
                    {sourceIndex === 0 && (
                      <th className="row-index" scope="rowgroup" rowSpan={group.sources.length}>
                        {String(groupIndex + 1).padStart(2, "0")}
                      </th>
                    )}
                    {sourceIndex === 0 && (
                      <th className="source-organization" scope="rowgroup" rowSpan={group.sources.length}>
                        {orphanSafeText(group.organization)}
                      </th>
                    )}
                    <td>
                      <ExternalLink href={source.url}>{orphanSafeText(source.title)}</ExternalLink>
                    </td>
                    <td className="source-reviewed">
                      <time dateTime={source.reviewedAt}>{formatReviewedDate(source.reviewedAt)}</time>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
          <p className="review-date">
            Content links last reviewed <time dateTime={siteConfig.lastReviewedAt}>{formatReviewedDate(siteConfig.lastReviewedAt)}</time>.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
