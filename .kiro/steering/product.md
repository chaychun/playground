# Product Overview

Personal portfolio and interactive showcase for chayut.me. The site is a multi-section destination — a central about page routes visitors to distinct sections, each with its own purpose and browsing model.

## Site Sections

### Home / About (`/`)

Landing page that doubles as the about page. Introduces the person, links prominently to other sections. Not a content feed — navigation hub.

### Playground (`/playground`)

Interactive UI component explorer. Modeled after component library documentation (e.g. shadcn/ui, Radix): a sidebar lists all components, clicking one displays it in a main area. One component at a time — not a scroll feed. Each component has its own route (`/playground/[slug]`) for direct linking; navigation within the section is client-side for a fluid SPA feel.

### Work (`/work`)

Simple list of projects and other work. Clean, scannable.

### Writing (`/writing`) — _planned_

Future section for articles and longer-form writing. Not yet implemented but the architecture should accommodate it without restructuring.

## Core Capabilities

- **Interactive demos** — Components render live previews with real interactions
- **Focused browsing** — Sidebar-picker pattern keeps the current component in view without distraction
- **Direct linking** — Every component, project, and post has a stable URL for sharing
- **MDX content** — Rich content alongside interactive demos where needed

## Value Proposition

A personal site that shows rather than tells — interactive demos are first-class, with the structure of a professional component library rather than a blog or portfolio grid.
