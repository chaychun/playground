import { cn } from "@/lib/cn";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import "./resume.css";

const manrope = Manrope({
  variable: "--font-resume-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-resume-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume — Chayut Chunsamphran",
};

export default function ResumePage() {
  return (
    <div
      className={cn(
        manrope.variable,
        ibmPlexMono.variable,
        "resume-wrapper flex min-h-svh justify-center bg-[#fafaf7] px-5 py-10",
      )}
    >
      <div className="resume-page">
        <header className="header">
          <h1 className="name">Chayut Chunsamphran</h1>
          <div className="header-row">
            <p className="subtitle">{"Design Engineer  \u2022  Bangkok, Thailand"}</p>
            <div className="contact-row">
              <span className="contact-item">chun.chayut@gmail.com</span>
              <span className="contact-item">chayut.me</span>
              <span className="contact-item">github.com/chaychun</span>
            </div>
          </div>
        </header>

        <section className="about">
          <h2 className="section-label">About</h2>
          <p className="about-tagline">
            Design engineer who thinks deeply about how products should work.
          </p>
          <p className="about-body">
            Background in physics with strong analytical foundations. Designs in code, not mockups.
            Experience with AI-assisted development workflows since early 2025 &mdash; from design
            exploration to code generation to building AI-powered products. Focused on user
            experience, interaction design, motion, and building interfaces that feel intentionally
            crafted.
          </p>
        </section>

        <div className="columns">
          <div className="left-col">
            <section className="skills-section">
              <h2 className="section-label">Skills</h2>
              <div className="skills-list">
                <div className="skill-group">
                  <h3 className="skill-title">Core Stack</h3>
                  <p className="skill-items">
                    TypeScript, React, Next.js, Astro, SwiftUI, Tailwind CSS, shadcn/ui
                  </p>
                </div>
                <div className="skill-group">
                  <h3 className="skill-title">Motion & Interaction</h3>
                  <p className="skill-items">Motion (Framer Motion), CSS Animations, WAAPI</p>
                </div>
                <div className="skill-group">
                  <h3 className="skill-title">AI-Assisted Development</h3>
                  <p className="skill-items">Claude Code, Cursor</p>
                </div>
              </div>
            </section>

            <section className="experience-section">
              <h2 className="section-label">Experience</h2>
              <div className="exp-entry">
                <h3 className="exp-title">Freelance Design & Development</h3>
                <p className="exp-date">2025 &ndash; Present</p>
                <p className="exp-desc">
                  Designing and building websites for clients &mdash; visual design, interaction
                  design, responsive development, and third-party integrations.
                </p>
              </div>
            </section>

            <section className="education-section">
              <h2 className="section-label">Education</h2>
              <div className="edu-entry">
                <h3 className="exp-title">BSc Physics, First Class Honors</h3>
                <p className="exp-date">Mahidol University &middot; 2025</p>
              </div>
            </section>
          </div>

          <div className="right-col">
            <div className="projects-header">
              <h2 className="section-label">Selected Projects</h2>
            </div>

            <article className="project">
              <div className="project-header">
                <h3 className="project-name">Playground</h3>
                <span className="project-link">chayut.me</span>
              </div>
              <p className="project-subtitle">Interactive Design Explorations</p>
              <p className="project-desc">
                A portfolio site showcasing interactive components and motion studies. Each piece
                explores a specific interaction concept: motion that guides experience, interactions
                that feel intuitive, and paradigms for digital interfaces.
              </p>
              <p className="project-tech">
                Next.js &middot; TypeScript &middot; Motion &middot; Tailwind CSS
              </p>
            </article>

            <article className="project">
              <div className="project-header">
                <h3 className="project-name">Coding Tutor</h3>
                <span className="project-link">github.com/chaychun/coding-tutor</span>
              </div>
              <p className="project-subtitle">AI-Powered Learning Tool</p>
              <p className="project-desc">
                An AI coding tutor built as a desktop app. Expert agent teaches concepts
                conversationally, then generates structured exercises (code-writing, MCQ) directly
                in the same flow. It evaluates responses, adapts difficulty, and maintains
                persistent learning context across sessions. Built on top of Claude Agent SDK.
              </p>
              <p className="project-tech">
                Tauri &middot; Next.js &middot; TypeScript &middot; Claude Agent SDK &middot; Monaco
                Editor
              </p>
            </article>

            <article className="project">
              <div className="project-header">
                <h3 className="project-name">Syne</h3>
                <span className="in-progress">In Progress</span>
              </div>
              <p className="project-subtitle">Knowledge Management Tool</p>
              <p className="project-desc">
                A knowledge management app built from the ground up. Instead of writing long
                documents upfront, knowledge accumulates naturally through short captures that link
                to topics, building a connected, browsable graph over time. Built for Mac and iOS.
              </p>
              <p className="project-tech">SwiftUI &middot; SQLite</p>
            </article>

            <article className="project">
              <div className="project-header">
                <h3 className="project-name">Thai Bus Food Tour</h3>
                <span className="project-link">thaibusfoodtour.co.th</span>
              </div>
              <p className="project-subtitle">Client Project &mdash; Marketing Website</p>
              <p className="project-desc">
                Designed and built a marketing website matching the brand&apos;s premium
                hospitality. Focused on small interactions and animations that align with the brand
                aesthetics. Integrated with booking and payment systems.
              </p>
              <p className="project-tech">Astro &middot; Tailwind CSS &middot; CSS Animations</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
