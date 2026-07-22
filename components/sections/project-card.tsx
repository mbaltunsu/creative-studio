"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion } from "motion/react";
import type { Project, CardAspect } from "@/lib/data/projects";
import type { Accent } from "@/lib/data/nav";

/* aspect token → Tailwind aspect utility */
const ASPECT: Record<CardAspect, string> = {
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

/* accent → hover-reveal tag pill (bg + readable text baked in together so the
   colour is deterministic regardless of Tailwind class-emit order) */
const TAG: Record<Accent, string> = {
  blue: "bg-blue text-paper",
  coral: "bg-coral text-ink",
  acid: "bg-acid text-ink",
  teal: "bg-teal text-ink",
  violet: "bg-violet text-paper",
};

/* accent → title colour on hover */
const TITLE_HOVER: Record<Accent, string> = {
  blue: "group-hover:text-blue",
  coral: "group-hover:text-coral",
  acid: "group-hover:text-acid",
  teal: "group-hover:text-teal",
  violet: "group-hover:text-violet",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href="#work"
      data-cursor="view"
      className="group block"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: (index % 3) * 0.08 }}
    >
      {/* Media */}
      <div className={clsx("relative overflow-hidden rounded-xl bg-ink", ASPECT[project.aspect])}>
        <Image
          src={project.image}
          alt={`${project.title} — ${project.category}`}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.045]"
        />

        {/* Category tag — decorative, allowed to sit at opacity-0 pre-hover */}
        <span
          className={clsx(
            "absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
            "-translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            TAG[project.accent],
          )}
        >
          {project.category}
        </span>
      </div>

      {/* Caption below media */}
      <div className="mt-3 flex items-center gap-2">
        <h3
          className={clsx(
            "font-display text-lg font-semibold transition-colors",
            TITLE_HOVER[project.accent],
          )}
        >
          {project.title}
        </h3>
        <span className="size-1.5 bg-ink/50" aria-hidden />
        <span className="font-mono text-xs text-ink/50">{project.year}</span>
      </div>
    </motion.a>
  );
}
