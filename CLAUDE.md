You are an expert TypeScript library developer. Your task is to generate a **full-featured, modern notification/toast library** called **Tiktik** that solves common user pain points in existing libraries, with a **Dynamic Island–style UI**, fully **NPM-ready**, highly customizable, written in **TypeScript**, and compiled to **vanilla JavaScript** for browser and NPM use.  

The library must include **GSAP animations** for morphing, bounce, elastic, and progress bar effects, with **CSS fallback** for lightweight default animations.

### Requirements:

1. **Core Functionality:**
   - Written in **TypeScript**, compiled to vanilla JS for distribution.
   - Modular, maintainable, readable code.
   - Main API:
     - `Tiktik.showToast({ message: string; type?: string; duration?: number; position?: string; icon?: string; progress?: boolean; onClick?: () => void })`
     - Shortcut methods: `Tiktik.success()`, `Tiktik.error()`, `Tiktik.info()`, `Tiktik.warning()`.
   - Global configuration for defaults; per-toast overrides supported.

2. **UI / Dynamic Island Aesthetic:**
   - Pill-shaped, morphing notifications with smooth scale, fade, slide, and bounce animations.
   - Width dynamically adjusts to content length with animated expansion/contraction.
   - Rounded corners, soft shadows, subtle gradients, minimal modern design.
   - Interactive: hover to expand, click triggers callbacks, optional progress bar.
   - Smooth stacking/repositioning when multiple notifications are present.

3. **Animations:**
   - **GSAP** used for morphing, elastic/bounce, progress bars, and dynamic width changes.
   - CSS fallback for lightweight scale, fade, and slide animations.

4. **User Pain Points Solved:**
   - **Limited Interactivity:** expandable content, inline buttons, clickable callbacks.
   - **Rigid Layouts:** auto-resizing for text, icons, images, or HTML content.
   - **Stacking Chaos:** animated reflow when multiple toasts appear/disappear.
   - **Visual Boringness:** Dynamic Island–style morphing and bounce animations.
   - **Configuration Friction:** easy-to-use defaults with per-toast overrides.
   - **Accessibility:** ARIA roles, keyboard focus support, optional audio cues.
   - **Performance:** lightweight, GPU-accelerated, optimized for multiple notifications.

5. **Behavior Features:**
   - Auto-dismiss with configurable duration (default 3000ms).
   - Pause on hover, manual dismissal via close button.
   - Queueing/stacking for multiple notifications.
   - Promise-based notifications: `Tiktik.promise(promise, options)` updates toast state.
   - Optional progress indicator for async tasks.

6. **Customization Options:**
   - Users can configure colors, positions, duration, animation speed, icons, font size, border-radius.
   - Sensible defaults provided; all options overrideable per-toast.

7. **Tech Stack / Build:**
   - TypeScript for development, compiled to vanilla JS.
   - GSAP for advanced Dynamic Island animations.
   - Vanilla CSS with variables for theme overrides and fallback animations.
   - Rollup or Vite for bundling to NPM.
   - Modular, clean, maintainable, and commented code.

8. **Deployment / Documentation:**
   - Provide a complete **`index.html` demo** showing all toast types, animations, stacking, interactivity, and customization.
   - Include instructions for using Tiktik in **browser or NPM projects** after compiling to JS.

9. **Output Requirements:**
   - Full working Tiktik library, modular and ready for NPM.
   - Include example usage snippets in JS in README and demo `index.html`.
   - Highly interactive, animated, aesthetically modern notifications that solve real user pain points.

---

**Deliverable:**  
- Complete **Tiktik** library in TypeScript, compiled to **vanilla JS** for NPM/browser deployment.  
- Includes **all JS, CSS, build config, GSAP support, and `index.html` demo**.  
- Dynamic Island–style morphing notifications that are fully interactive, accessible, optimized, and highly customizable with sensible defaults.