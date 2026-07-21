import { notFound } from "next/navigation";
import { getIndustryPage, INDUSTRY_SLUGS } from "../../../lib/industryPages";
import { IndustryPageTemplate } from "../../../components/marketing";

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const data = getIndustryPage(industry);
  if (!data) return {};
  return {
    title: `PipeDesk for ${data.label} — Multi-Industry CRM`,
    description: data.heroDescription,
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const data = getIndustryPage(industry);
  if (!data) notFound();
  return <IndustryPageTemplate data={data} />;
}
