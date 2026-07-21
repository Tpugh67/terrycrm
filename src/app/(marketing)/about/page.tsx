import { Workflow, Rocket, Users } from "lucide-react";
import { HeroSection, FeatureGrid, CTASection } from "../../../components/marketing";

// Deliberately scoped to what's actually verifiable: what the product
// does and why it's built the way it is. No founding story, team bios,
// location, or company history — none of that exists anywhere in the
// codebase, and inventing it would violate the same no-fabrication
// standard applied to testimonials, logos, and usage stats throughout
// this project. Add that content here once it's real.
export default function AboutPage() {
  return (
    <>
      <HeroSection
        title="Why we built PipeDesk this way"
        description="Most CRMs make every business fit the same generic pipeline. We built PipeDesk around the opposite idea: your industry should shape your tools, not the other way around."
        background="dark"
      />

      <FeatureGrid
        title="What that means in practice"
        features={[
          {
            icon: Workflow,
            headline: "Industry-specific from day one",
            description: "18 industries, each with their own stages, terminology, and fields — not a generic pipeline with your industry's name on it.",
          },
          {
            icon: Rocket,
            headline: "Built to be simple to start",
            description: "Pick your industry and your pipeline is ready. No consultants, no setup calls required to get value on day one.",
          },
          {
            icon: Users,
            headline: "Built for the people doing the work",
            description: "Wholesalers, agents, brokers, reps — PipeDesk is built around how people actually sell in their industry, not how a generic CRM vendor imagines sales works.",
          },
        ]}
        columns={3}
      />

      <CTASection
        title="See it built for your industry"
        description="Start your free 14-day trial. No charge until it ends."
        primaryCta={{ label: "Start free trial", href: "/login?mode=signup" }}
        secondaryCta={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
