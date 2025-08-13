# Aura Sports - High-Performance Platform

![Aura Dashboard](https://storage.googleapis.com/project-aurora-302214/images/aura_dashboard_readme.png)

## Overview

Aura Sports is a next-generation, AI-powered platform designed to provide a holistic performance solution for elite sports teams and academies. It moves beyond simple scheduling and data tracking to become an integrated ecosystem for coaches, athletes, and performance staff.

The platform is built on the philosophy of combining expert human knowledge with intelligent automation. It centralizes long-term planning, daily training, video analysis, communication, and mental skills development into a single, intuitive interface. The core of the platform is the **AI Assistant Coach**, powered by Google's Gemini, which is trained on a private, expert-vetted knowledge base to provide scientifically-sound, context-aware recommendations.

---

## Key Features

* **Annual Training Plan (ATP):** A dynamic, long-term planning tool for mapping out an entire season.
* **AI Meso-cycle Planner:** An intelligent assistant that helps coaches and athletes build bespoke, goal-oriented training weeks (meso-cycles) based on expert principles for qualities like hypertrophy, power, speed, and rehab.
* **Integrated Daily Timeline:** A cohesive, color-coded daily schedule for athletes that combines training, nutrition, biometrics, and recovery into a single, easy-to-follow plan.
* **Video Analysis Hub:** A dual-mode analysis tool for both team tactical breakdowns and individual biomechanics (sprint/gait analysis), powered by AI event tagging and pose estimation.
* **Mind Gym:** A dedicated library for cognitive and mental skills training, including neural drills, VR simulations, and guided meditation/hypnosis sessions.
* **Communication Hub:** A fully integrated, contextual messaging system that links conversations to specific training events, athletes, or video clips.
* **Unified Athlete Profile:** A single, comprehensive dashboard for each athlete that merges at-a-glance daily planning with in-depth performance metrics and historical data.
* **Tiered Knowledge Base:** A unique system that powers the AI Assistant, combining a core, expert-vetted scientific library with a private, club-specific resource library for playbooks and coaching philosophy.

---

## Technology Stack

* **Frontend:** SvelteKit
* **Styling:** Tailwind CSS
* **Icons:** Lucide
* **Charting:** Chart.js
* **Backend & Database:** Google Firebase (Firestore, Authentication)
* **AI Engine:** Google Gemini

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/aura-sports-app.git](https://github.com/your-username/aura-sports-app.git)
    cd aura-sports-app/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    * Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    * Create a `.env` file in the `frontend` directory.
    * Add your Firebase project configuration to the `.env` file.

### Running the Development Server

```bash
npm run dev
Open http://localhost:5173 to view the application in your browser.Project Structure/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable Svelte components
│   │   └── stores/           # Svelte stores for global state (e.g., viewStore.ts)
│   ├── routes/
│   │   ├── +layout.svelte    # Main app layout and navigation
│   │   ├── dashboard/
│   │   ├── atp/
│   │   ├── athletes/
│   │   │   └── [id]/         # Dynamic route for individual athlete profiles
│   │   ├── cognitive/        # Mind Gym page
│   │   ├── video-analysis/
│   │   └── ...               # Other pages
│   └── app.css               # Global styles (Tailwind)
└── static/                   # Static assets like images and fonts
>>>>>>> b9d5ee41d3e31d97960c9ea51e166a955015d612
