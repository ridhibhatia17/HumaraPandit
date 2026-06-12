# AI Usage Declaration

This document outlines the usage of Artificial Intelligence tools during the development of the **AstroCRM** project. It serves to maintain transparency, detail the engineering decisions made independently, and fulfill academic and professional integrity requirements.

---

## 🎯 Purpose

AI tools were utilized during the development lifecycle as highly capable digital assistants. The primary goals of using these tools were to:
- Accelerate the initial brainstorming and ideation phases.
- Gather suggestions for modern UI/UX design patterns.
- Explore architecture decisions and best practices for role-based access control.
- Generate boilerplate code and structural documentation.
- Receive rapid feedback on code refactoring and optimization.

## 🛠️ AI Tools Used

The following AI tools were consulted during the project:
- **Gemini / Claude / ChatGPT:** Used for architecture discussions, debugging complex backend logic, and generating documentation drafts.
- **Lovable:** Used for UI design inspiration and brainstorming aesthetic layouts for the dashboards.

---

## 🤖 Areas Where AI Assisted

AI tools provided support in the following non-critical, supplementary areas:
- **Brainstorming:** Ideating features tailored for astrologers and users in a CRM context.
- **UI Design Suggestions:** Recommending Shadcn UI components and Tailwind CSS configurations for a clean, modern interface.
- **Architecture Discussions:** Discussing the pros and cons of different folder structures and state management approaches.
- **Documentation:** Drafting the initial outlines for the `README.md` and this `AI_USAGE.md` document.
- **Code Refactoring Suggestions:** Offering recommendations for making React components more modular and improving TypeScript type safety.

---

## 🧑‍💻 Areas Implemented Manually

While AI assisted in planning and ideation, the core engineering work was executed manually. The following areas were strictly developed, configured, and integrated by the developer:

- **Project Structure:** Setting up the monorepo-style structure and configuring Vite, React, and Node.js.
- **Database Design Decisions:** Designing the MongoDB schemas, establishing relationships between Users, Consultations, and Reports, and creating optimal indexing strategies.
- **Authentication Logic:** Implementing JWT generation, parsing, and strict Role-Based Access Control (RBAC) middleware.
- **Business Logic:** Writing the core functionality for booking consultations, assigning remedies, and generating analytics.
- **API Integration:** Connecting the React frontend to the Express backend, handling loading states, errors, and data fetching protocols.
- **Bug Fixes & Debugging:** Investigating and resolving runtime errors, CORS issues, and state synchronization bugs.
- **Testing & Validation:** Manually verifying API endpoints via Postman/Thunder Client and performing end-to-end user flow testing in the browser.

---

## 🧠 Engineering Decisions Made Independently

To demonstrate independent problem-solving and architectural thinking, the following key decisions were made without AI dependency:
1. **RBAC Implementation Strategy:** Chose a centralized middleware approach on the backend to evaluate user roles from the JWT payload before route execution, ensuring secure data isolation.
2. **Component Reusability:** Designed a generic layout wrapper for dashboards to ensure the Admin, Pandit, and Customer views share a consistent sidebar and navigation structure while rendering distinct internal components.
3. **State Management:** Decided to rely on localized component state and custom hooks for API calls rather than over-engineering with Redux, keeping the application lightweight and maintainable.

---

## ✅ Verification Process

AI-generated outputs were never used as drop-in solutions. The verification process involved:
1. **Critical Review:** Reading through all AI suggestions to ensure they aligned with the specific project requirements.
2. **Modification:** Adapting generalized AI code snippets to fit the custom MongoDB schemas and existing utility functions.
3. **Manual Testing:** Running the code locally and verifying the output against edge cases (e.g., unauthorized access attempts, missing payload data).

---

## ⚖️ Academic Integrity Statement

I hereby declare that AI tools were used strictly as an assistant and sounding board during the development of AstroCRM. All final engineering decisions, system designs, implementation logic, testing, and validation were performed independently by me. I take full responsibility for the codebase and its functionality.

---

## 💡 Reflection

Building AstroCRM was a highly rewarding experience. Utilizing AI as a secondary assistant allowed me to focus deeply on the core business logic and database architecture rather than getting bogged down in boilerplate setup. It reinforced the importance of understanding the underlying mechanics of JWT authentication and RBAC, as AI can suggest patterns, but securing the application requires strict, manual oversight. The project significantly improved my proficiency in full-stack TypeScript development and modern React ecosystem tools.
