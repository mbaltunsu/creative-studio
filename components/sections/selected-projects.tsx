import { PROJECTS } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";

/* Per-index column composition. The 9 PROJECTS arrive in a designed order; this
   map gives each a span + start + vertical offset so the grid reads as an
   intentional editorial layout (wide 16:9, narrow 9:16, medium 1:1/4:5) rather
   than a uniform tile grid. Mobile stays mostly stacked. */
const LAYOUT: Record<number, string> = {
  0: "col-span-12 md:col-span-5 md:col-start-1",
  1: "col-span-7 md:col-span-3 md:col-start-7 md:mt-24",
  2: "col-span-5 md:col-span-3 md:col-start-10 md:mt-48",
  3: "col-span-12 md:col-span-4 md:col-start-2 md:-mt-12",
  4: "col-span-12 md:col-span-6 md:col-start-7 md:mt-16",
  5: "col-span-6 md:col-span-3 md:col-start-1 md:mt-24",
  6: "col-span-6 md:col-span-4 md:col-start-5 md:mt-8",
  7: "col-span-12 md:col-span-3 md:col-start-10 md:-mt-16",
  8: "col-span-12 md:col-span-7 md:col-start-3 md:mt-12",
};

export function SelectedProjects() {
  return (
    <section id="work" className="relative isolate bg-paper text-ink">
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 md:py-36">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-blue md:text-sm">
              {"{ selected projects }"}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight">
              Selected work
            </h2>
          </div>
          <a
            href="#work"
            className="font-mono text-sm uppercase tracking-wider transition-colors hover:text-blue"
          >
            More projects →
          </a>
        </div>

        {/* Editorial grid — intentional variety, not a uniform tile grid */}
        <ul className="mt-16 grid grid-cols-12 gap-x-4 gap-y-16 md:mt-24 md:gap-y-24">
          {PROJECTS.map((project, i) => (
            <li key={project.slug} className={LAYOUT[i]}>
              <ProjectCard project={project} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
