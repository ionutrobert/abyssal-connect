# Abyssal Connect

**Live:** https://abyssal-connect.vercel.app  

---

A dark, immersive digital presence for a deep sea fiber optic maintenance company. Built to feel like looking into the deep ocean—mysterious, precise, and illuminated by data.

This was built as a showcase project to demonstrate what's possible when you combine WebGL, thoughtful animations, and a distinctive visual identity. The company maintains submarine cable infrastructure; I built the website.

## The Concept

97% of intercontinental data flows through fiber optic cables on the ocean floor. When something goes wrong at 4,000m depth, downtime costs millions per hour. The brief was simple: make this invisible infrastructure feel tangible.

The result is a site that feels like a submarine control interface—dark theme, monospace typography, real-time data visualization, and a 3D hero section that puts you on the ocean floor.

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4
- **3D:** React Three Fiber (WebGL/Three.js)
- **Animation:** Framer Motion
- **State:** Zustand
- **Deployment:** Vercel Edge Network

## Running Locally

```bash
cd site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

## What's Under the Hood

- **Immersive 3D Hero** — Real-time WebGL simulation of subsea fiber optic cable with dynamic lighting
- **Live Operations Dashboard** — Real-time vessel tracking with status indicators (Active, Docked, Maintenance)
- **Interactive Global Map** — SVG-based submarine cable route visualization with hover details
- **Capabilities Grid** — Technical specifications for ROV technology and depth ratings
- **Secure Portal** — Client access mockup for monitoring fleet positions
- **Modals** — Contact forms, career listings, security/privacy policy, incident reporting

## Deployment

Connected to Vercel. Every push to `main` triggers automatic deployment.

```bash
# Vercel CLI deployment (optional)
npm i -g vercel
vercel
```

## Project Structure

```
site/
├── app/              # Next.js App Router pages
├── components/       # React components
├── data/             # Mock operational data (vessels, cables)
├── hooks/            # Custom React hooks
├── lib/              # Utilities
└── public/           # Static assets (images, audio)
```

## Notes

- All data is mock — vessel positions, cable routes, and operational status are simulated for demonstration

## License

All rights reserved. No part of this project may be reproduced, distributed, or copied without permission.
