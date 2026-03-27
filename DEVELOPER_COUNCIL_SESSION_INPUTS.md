# DeveloperCouncil Session - Required Inputs
## Quick Reference Guide for Session Preparation

**Purpose:** This document specifies exactly what artifacts and materials must be prepared before conducting a DeveloperCouncil session to adopt the Vue.js prototype into a production Liferay widget.

**Target Audience:** Project managers, UIUX designers, frontend developers preparing for the council session

**Time to Prepare:** ~40 hours (distributed across team members)

---

## Input Checklist

Use this checklist to ensure all required materials are ready:

### ✅ Design Specifications (UIUX Team - 16 hours)
- [ ] Figma design files with view access granted to council
- [ ] Design tokens exported as JSON
- [ ] Component specifications documented
- [ ] Interaction specifications documented
- [ ] Accessibility requirements documented
- [ ] High-fidelity screenshots/mockups exported

### ✅ Prototype Analysis (Frontend Team - 12 hours)
- [ ] Component inventory completed
- [ ] Business logic documented
- [ ] Gap analysis completed
- [ ] Dependency audit completed
- [ ] Architecture diagram created

### ✅ Target Environment (DevOps/Platform Team - 8 hours)
- [ ] Liferay environment specifications documented
- [ ] Corporate coding standards documented
- [ ] Deployment checklist prepared
- [ ] Portal theme reference materials gathered

### ✅ Business Requirements (Product Owner - 4 hours)
- [ ] Feature requirements documented
- [ ] User stories written
- [ ] Acceptance criteria defined
- [ ] Non-functional requirements specified

### ✅ Session Brief (Technical Lead - 4 hours)
- [ ] Council session brief completed
- [ ] Review checklist prepared
- [ ] Questions for council documented
- [ ] Expected outcomes defined

---

## 1. Design Specifications Package

### 1.1 Figma Designs

**What to Provide:**
- **Live Figma file link** with view/comment access for council specialists
- **Exported screens** (PNG/SVG) for all states:
  - Idle state (before test)
  - Running state (during test)
  - Complete state (after test)
  - Error state (network failure, SDK error)
  - Loading states for each component

**Folder Structure:**
```
design-specifications/
├── figma-link.md                    # Live Figma URL + access instructions
├── screens/
│   ├── 01-speedtest-idle.png
│   ├── 02-speedtest-running.png
│   ├── 03-speedtest-complete.png
│   ├── 04-speedtest-error.png
│   └── 05-speedtest-loading.png
├── components/
│   ├── button-primary.png
│   ├── button-secondary.png
│   ├── button-disabled.png
│   ├── progress-bar-states.png
│   ├── metric-card.png
│   ├── quality-badge.png
│   └── mode-selector.png
└── assets/
    ├── icons/ (SVG format)
    ├── logos/ (SVG + PNG fallbacks)
    └── illustrations/ (if any)
```

---

### 1.2 Design Tokens

**What to Provide:**
Export design tokens from Figma using a plugin (e.g., "Design Tokens", "Figma Tokens")

**File:** `design-tokens.json`

**Must Include:**
```json
{
  "colors": {
    "brand": { "primary": "#...", "secondary": "#..." },
    "status": { "success": "#...", "warning": "#...", "error": "#..." },
    "neutral": { "50": "#...", "100": "#...", ... "900": "#..." }
  },
  "typography": {
    "fontFamily": { "sans": "...", "mono": "..." },
    "fontSize": { "xs": "...", "sm": "...", ... "xl": "..." },
    "fontWeight": { "normal": 400, "medium": 500, ... },
    "lineHeight": { "tight": 1.25, "normal": 1.5, ... }
  },
  "spacing": {
    "xs": "0.25rem", "sm": "0.5rem", ... "xl": "2rem"
  },
  "borderRadius": { "sm": "...", "md": "...", "lg": "...", "full": "..." },
  "shadows": { "sm": "...", "md": "...", "lg": "..." },
  "breakpoints": {
    "mobile": "640px",
    "tablet": "768px",
    "desktop": "1024px"
  }
}
```

**Why This Matters:**
- Ensures pixel-perfect implementation
- Enables automated code generation
- Maintains design consistency
- Facilitates theme customization

---

### 1.3 Component Specifications

**What to Provide:**
Detailed specifications for each UI component

**Template per Component:**

```markdown
# [Component Name]

## Visual Reference
![Component](../screens/component-name.png)

## Purpose
Brief description of what this component does

## Properties/Props
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| ... | ... | ... | ... | ... |

## States
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error

## Typography
- Font family, size, weight, line-height
- Color for each text element

## Spacing
- Internal padding
- Margins
- Gap between elements

## Colors
- Background colors for each state
- Border colors
- Text colors
- Icon colors

## Animations/Transitions
- Duration
- Easing function
- What animates (opacity, transform, etc.)

## Accessibility
- ARIA attributes required
- Keyboard interactions
- Screen reader text
- Focus management

## Responsive Behavior
- Mobile breakpoint adjustments
- Tablet breakpoint adjustments
- Desktop breakpoint adjustments

## Example Usage
Code snippet showing expected usage

## Figma Link
Direct link to component in Figma
```

**Components to Document:**
1. **Button** (Primary, Secondary, Disabled states)
2. **Progress Bar**
3. **Metric Card**
4. **Quality Badge**
5. **Mode Selector**
6. **Header**
7. **Footer**
8. **Data Transfer Display**
9. **Error Message**
10. **Loading Skeleton**

---

### 1.4 Interaction Specifications

**What to Provide:**
Detailed interaction patterns and micro-animations

**File:** `interaction-specs.md`

```markdown
# Interaction Specifications

## Button Interactions

### Primary Button
- **Default:** bg: #0066CC, text: #FFFFFF
- **Hover:** bg: #0052A3, transform: translateY(-2px), shadow: 0 4px 6px rgba(0,0,0,0.1)
- **Active:** bg: #004080, transform: translateY(0)
- **Focus:** outline: 2px solid #0066CC, outline-offset: 2px
- **Disabled:** opacity: 0.5, cursor: not-allowed, no hover effects
- **Transition:** all 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Secondary Button
[Similar structure]

## Progress Bar Animation
- **Initial:** width: 0%, opacity: 0
- **Animate to:** width: {progress}%, opacity: 1
- **Duration:** 300ms
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1)
- **Update on data change:** Smooth transition, not instant jump

## Test Start Flow
1. User clicks "Start Test" button
2. Button changes to "Testing..." and becomes disabled
3. Progress bars appear with fade-in animation (300ms)
4. Metric values update in real-time (no animation, just value change)
5. Progress bars fill smoothly as data comes in

## Loading States
- **Skeleton loader:** Pulse animation (1s infinite)
- **Opacity:** 1 → 0.5 → 1
- **Background:** Gradient shimmer effect (optional)

## Error Handling
- **Error message:** Slide down from top, duration: 300ms
- **Auto-dismiss:** After 5 seconds (with progress bar showing time left)
- **Manual dismiss:** Click X button or click outside

## Keyboard Navigation
- **Tab order:** Logical top-to-bottom, left-to-right
- **Enter/Space:** Activate buttons
- **Escape:** Dismiss modals/errors
- **Arrow keys:** Navigate between radio buttons (mode selector)
```

---

### 1.5 Accessibility Requirements

**What to Provide:**
WCAG 2.1 AA compliance checklist

**File:** `accessibility-requirements.md`

```markdown
# Accessibility Requirements (WCAG 2.1 AA)

## Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text 18pt+ or 14pt bold+)
- [ ] Non-text contrast ratio ≥ 3:1 (UI components, graphics)
- [ ] Do not rely on color alone to convey information

**Validation Tool:** WebAIM Contrast Checker

## Keyboard Accessibility
- [ ] All interactive elements focusable via Tab key
- [ ] Focus order is logical and intuitive
- [ ] Visible focus indicators on all focusable elements
- [ ] No keyboard traps (can Tab out of all components)
- [ ] Custom keyboard shortcuts documented (if any)

## Screen Reader Support
- [ ] All images have alt text (or aria-label)
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text (not just icons)
- [ ] Dynamic content changes announced (aria-live)
- [ ] Error messages associated with form fields (aria-describedby)
- [ ] Loading states announced ("Loading..." via aria-live)

**Validation Tools:** NVDA (Windows), VoiceOver (Mac), JAWS

## ARIA Implementation

### Progress Bars
```html
<div role="progressbar"
     aria-valuenow="45"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Download progress">
</div>
```

### Buttons
```html
<button aria-label="Start network speed test">
  Start Test
</button>
```

### Live Regions (for dynamic updates)
```html
<div aria-live="polite" aria-atomic="true">
  Download speed: 123 Mbps
</div>
```

### Status Messages
```html
<div role="status" aria-live="polite">
  Test completed successfully
</div>
```

## Document Structure
- [ ] Headings hierarchy is logical (h1 → h2 → h3, no skips)
- [ ] Landmark regions defined (header, main, footer, nav)
- [ ] Skip-to-content link provided (if applicable)

## Responsive & Zoom
- [ ] Content remains usable at 200% zoom
- [ ] No horizontal scrolling at 320px width (mobile)
- [ ] Touch targets ≥ 44x44 pixels (mobile)

## Testing Checklist
- [ ] Keyboard-only navigation test passed
- [ ] Screen reader test passed (NVDA/VoiceOver)
- [ ] Color contrast audit passed (all elements)
- [ ] Zoom to 200% test passed
- [ ] Mobile touch target test passed
- [ ] Automated audit passed (axe DevTools, Lighthouse)

**Target Compliance:** WCAG 2.1 Level AA
**Validation Deadline:** Before Phase 3 completion
```

---

## 2. Prototype Analysis Package

### 2.1 Component Inventory

**What to Provide:**
Complete list of all Vue components with analysis

**File:** `component-inventory.md`

```markdown
# Component Inventory - Vue.js Prototype

## Overview
- **Total Components:** 13
- **Framework:** Vue 3 (Composition API)
- **Lines of Code:** ~1,500 (estimated)

## Component Breakdown

### 1. App.vue (Root Component)
- **Purpose:** Application orchestrator, state management, SpeedTest SDK integration
- **Lines:** ~380
- **Complexity:** HIGH
- **Reusability:** LOW (framework-specific orchestration)
- **Key Logic:**
  - SpeedTest instance creation and lifecycle
  - Event handling (onRunningChange, onResultsChange, onFinish)
  - Test mode configuration (quick/standard/full)
  - Data transformation (bps to Mbps, bytes to MB)
  - State management for results, scores, summary
- **Migration Effort:** HIGH - Core business logic must be extracted and adapted
- **Recommendation:** Extract business logic into framework-agnostic utility functions

---

### 2. SpeedTestControls.vue
- **Purpose:** Start/Stop test buttons and status display
- **Lines:** ~54
- **Complexity:** LOW
- **Reusability:** HIGH
- **Props:**
  - isRunning: Boolean
  - statusText: String
  - statusClass: String
- **Events:**
  - start-test
  - stop-test
- **Migration Effort:** LOW - Simple presentational component
- **Recommendation:** Easy to port to any framework

---

### 3. MetricsGrid.vue
- **Purpose:** Display real-time network metrics with progress bars
- **Lines:** [Check actual]
- **Complexity:** MEDIUM
- **Reusability:** HIGH
- **Key Logic:**
  - Progress bar width calculation
  - Value formatting (Mbps, ms)
  - Color coding based on thresholds
- **Migration Effort:** MEDIUM - Business logic extraction needed
- **Recommendation:** Extract calculation functions, keep UI layer thin

---

### 4. QualityScores.vue
- **Purpose:** Display quality badges (streaming, gaming, RTC)
- **Lines:** [Check actual]
- **Complexity:** LOW
- **Reusability:** HIGH
- **Migration Effort:** LOW
- **Recommendation:** Simple port, just match design tokens

---

### 5. SummaryDetails.vue
- **Purpose:** Display detailed test summary
- **Lines:** [Check actual]
- **Complexity:** LOW
- **Reusability:** HIGH
- **Migration Effort:** LOW
- **Recommendation:** Simple port

---

### 6-13. Other Components
[Document remaining components: AppHeader, AppFooter, TestModeSelector,
DataTransferDisplay, RetroSpeedTest, DrumSpeedometer, VintagePattern,
UltimateQuestionOverlay]

---

## Business Logic Extraction Candidates

### High Priority (Core Functionality)

#### 1. Test Configuration Logic
**Location:** App.vue:89-140
**Function:** Define measurement configurations for different test modes
**Extraction Target:** `config/speedtest-measurements.js`
```javascript
export const measurementConfigs = {
  quick: [...],
  standard: [...],
  full: [...]
}
```

#### 2. Results Processing Logic
**Location:** App.vue:260-304
**Function:** Transform SpeedTest SDK results into display-ready format
**Extraction Target:** `utils/results-transformer.js`
```javascript
export function transformResults(rawResults) {
  // Convert bps to Mbps, format decimals, etc.
}
```

#### 3. Data Transfer Tracking
**Location:** App.vue:263-280
**Function:** Accumulate bytes downloaded/uploaded
**Extraction Target:** `utils/data-tracker.js`
```javascript
export class DataTracker {
  trackDownload(bytes) { ... }
  trackUpload(bytes) { ... }
  getTotals() { ... }
}
```

### Medium Priority (UI Enhancements)

#### 4. Progress Calculation
**Location:** MetricsGrid.vue (assumed)
**Function:** Calculate progress bar width based on current value
**Extraction Target:** `utils/progress-calculator.js`

#### 5. Quality Score Mapping
**Location:** QualityScores.vue (assumed)
**Function:** Map numeric scores to labels (bad/poor/average/good/great)
**Extraction Target:** `utils/quality-mapper.js`

---

## Dependency Analysis

### External Dependencies
- `@cloudflare/speedtest`: ^1.7.0 (CRITICAL - core functionality)
- `vue`: ^3.5.27 (framework - will be replaced/adapted)

### Internal Dependencies
- All components depend on App.vue for state
- No circular dependencies detected
- Clean component hierarchy

---

## Migration Complexity Matrix

| Component | Complexity | Effort | Priority | Notes |
|-----------|-----------|--------|----------|-------|
| App.vue | HIGH | 5 days | P0 | Extract business logic first |
| SpeedTestControls | LOW | 0.5 days | P1 | Simple port |
| MetricsGrid | MEDIUM | 2 days | P1 | Extract calculations |
| QualityScores | LOW | 1 day | P1 | Simple port |
| SummaryDetails | LOW | 1 day | P2 | Simple port |
| TestModeSelector | LOW | 1 day | P1 | Simple port |
| DataTransferDisplay | LOW | 0.5 days | P2 | Simple port |
| RetroSpeedTest | HIGH | 4 days | P0 | Replace with corporate design |
| AppHeader | LOW | 0.5 days | P2 | Use corporate header |
| AppFooter | LOW | 0.5 days | P2 | Use corporate footer |

**Total Estimated Effort:** 16-20 developer days (excluding design implementation)

---

## Recommendations for DeveloperCouncil

1. **Preserve Business Logic:** Extract App.vue logic into framework-agnostic modules
2. **Component-by-Component Migration:** Start with simple components (controls, badges)
3. **Test-First Approach:** Write tests for extracted logic before migration
4. **Progressive Enhancement:** Build basic functionality first, then add polish
```

---

### 2.2 Gap Analysis

**What to Provide:**
Detailed comparison of prototype vs. corporate requirements

**File:** `gap-analysis.md`

See Appendix B.3 in the full integration plan for the complete template.

**Key Sections:**
1. Framework & Architecture gaps
2. UI/UX Design gaps (with % compliance score)
3. Accessibility gaps (current vs. target WCAG level)
4. Code quality gaps (test coverage, documentation)
5. Security & compliance gaps
6. Performance gaps (with target metrics)
7. Priority matrix (must-have vs. nice-to-have)
8. Risk assessment
9. Recommendations

---

### 2.3 Architecture Diagram

**What to Provide:**
Visual representation of current prototype architecture

**File:** `architecture-diagram.png` (or `.svg`)

**Should Show:**
```
┌─────────────────────────────────────────────────────────┐
│                    Browser (SPA)                         │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  App.vue (Root Component)                       │   │
│  │  - State Management (ref, computed)             │   │
│  │  - SpeedTest SDK Integration                    │   │
│  │  - Event Orchestration                          │   │
│  └───────────┬─────────────────────────────────────┘   │
│              │                                           │
│      ┌───────┴────────┬──────────────┬─────────────┐   │
│      │                │              │             │   │
│  ┌───▼────┐   ┌───▼──────┐   ┌──▼──────┐   ┌───▼────┐ │
│  │Controls│   │MetricsGrid│   │Quality  │   │Summary │ │
│  │        │   │           │   │Scores   │   │Details │ │
│  └────────┘   └───────────┘   └─────────┘   └────────┘ │
│                                                          │
│  External Dependency:                                    │
│  @cloudflare/speedtest SDK                              │
│  (connects to Cloudflare network)                       │
└─────────────────────────────────────────────────────────┘

Data Flow:
1. User clicks "Start Test" → App.vue.startTest()
2. App.vue creates SpeedTest instance
3. SpeedTest SDK → Cloudflare servers (network requests)
4. SDK callbacks (onResultsChange) → App.vue updates state
5. State changes → Components re-render
6. Display updated metrics in UI
```

**Tool Suggestions:** Draw.io, Lucidchart, Mermaid, or hand-drawn and scanned

---

### 2.4 Dependency Audit

**What to Provide:**
Security and licensing review of all dependencies

**File:** `dependency-list.md`

```markdown
# Dependency Audit

## Production Dependencies

### @cloudflare/speedtest@^1.7.0
- **Purpose:** Core network speed testing functionality
- **License:** BSD-3-Clause
- **Bundle Size:** ~150KB (minified)
- **Vulnerabilities:** 0 known (as of 2026-03-25)
- **Corporate Approval:** PENDING - requires security review
- **Risk Assessment:** LOW
- **Notes:** Official Cloudflare package, actively maintained

### vue@^3.5.27
- **Purpose:** UI framework
- **License:** MIT
- **Bundle Size:** ~50KB (runtime only)
- **Vulnerabilities:** 0 known
- **Corporate Approval:** May need replacement (see framework decision)
- **Risk Assessment:** LOW
- **Notes:** Will be replaced if migrating to React/Vanilla

---

## Development Dependencies

### vite@^6.0.7
- **Purpose:** Build tool
- **License:** MIT
- **Vulnerabilities:** 0 known
- **Corporate Approval:** May need replacement (Webpack?)
- **Risk Assessment:** LOW

### @vitejs/plugin-vue@^5.2.1
- **Purpose:** Vite plugin for Vue SFC compilation
- **License:** MIT
- **Vulnerabilities:** 0 known
- **Corporate Approval:** N/A (dev only)
- **Risk Assessment:** LOW

---

## Security Scan Results

**Tool Used:** npm audit
**Date:** 2026-03-25
**High/Critical Vulnerabilities:** 0
**Medium Vulnerabilities:** 0
**Low Vulnerabilities:** 0

**Command:**
```bash
npm audit
```

**Result:**
```
found 0 vulnerabilities
```

---

## License Compliance

All dependencies use permissive licenses compatible with corporate policy:
- MIT: vue, vite, @vitejs/plugin-vue
- BSD-3-Clause: @cloudflare/speedtest

**Copyleft Licenses:** None (GOOD)
**Proprietary Licenses:** None (GOOD)

---

## Transitive Dependencies

**Total:** ~150 transitive dependencies (via npm ls)
**Recommendation:** Review with security team before production use

---

## Corporate Policy Compliance

- [ ] All dependencies approved by security team
- [ ] No GPL/AGPL licenses (PASS)
- [ ] No dependencies from untrusted sources (PASS)
- [ ] Automated vulnerability scanning configured
- [ ] Dependency update policy defined

---

## Recommendations

1. **Immediate:** Get security team approval for @cloudflare/speedtest
2. **Before MVP:** Set up automated dependency scanning (Snyk, Dependabot)
3. **Ongoing:** Monthly dependency updates and security patches
```

---

## 3. Target Environment Package

### 3.1 Liferay Environment Specifications

**What to Provide:**
Complete technical specifications of the Liferay environment

**File:** `liferay-environment.yaml`

```yaml
# Liferay Portal Environment Specifications

liferay:
  version: "7.4.3.120 GA120"  # REPLACE WITH ACTUAL VERSION
  edition: "DXP"  # or "CE" (Community Edition)
  patch_level: "GA120"

deployment:
  type: "widget"  # or "portlet", "OSGi bundle"
  framework_support:
    - "React 18"
    - "Vue 3"
    - "Vanilla JavaScript"
  preferred_framework: "React"  # Corporate standard

portal:
  theme: "corporate-theme-2024-v1"
  theme_framework: "Clay"  # Liferay's design system
  css_framework: "Bootstrap 5"  # Underlying grid system

build:
  bundler: "Webpack 5"
  module_format: "UMD"  # or "ESM"
  transpilation: "Babel"
  minification: true
  source_maps: true  # for production debugging

constraints:
  max_bundle_size: "5MB"  # Total widget size
  max_initial_load: "1MB"  # Critical path bundle
  supported_browsers:
    - "Chrome 120+"
    - "Firefox 120+"
    - "Edge 120+"
    - "Safari 17+"
  ie11_support: false

integration:
  authentication: "portal-sso"  # Single Sign-On
  authorization: "liferay-permissions"
  api_access: "REST"
  api_base_url: "https://portal.corporate.com/o/api"

security:
  csp_policy: "strict"
  csp_header: "default-src 'self'; script-src 'self' https://cdn.cloudflare.com; ..."
  cors_enabled: true
  csrf_protection: true

performance:
  cdn_enabled: true
  cdn_url: "https://cdn.corporate.com"
  cache_control: "public, max-age=31536000, immutable"
  gzip_enabled: true
  brotli_enabled: true

monitoring:
  apm_tool: "Dynatrace"  # or "New Relic"
  logging: "Splunk"
  error_tracking: "Sentry"

development:
  local_server: "http://localhost:8080"
  local_theme: "http://localhost:8080/o/corporate-theme"
  hot_reload: true

deployment_process:
  1_build: "npm run build"
  2_package: "create .war or .zip bundle"
  3_upload: "upload to Liferay Digital Asset Management"
  4_configure: "configure widget permissions"
  5_deploy: "publish to portal pages"
```

---

### 3.2 Corporate Coding Standards

**What to Provide:**
Complete coding standards and style guide

**File:** `corporate-standards.md`

```markdown
# Corporate Frontend Development Standards

## JavaScript Standards

### ES Version
- **Minimum:** ES2020 (ES11)
- **Target:** ES2022 (transpile to ES2020 for compatibility)
- **Features to avoid:** Stage 3 proposals (not yet standardized)

### Code Style
- **Style Guide:** Airbnb JavaScript Style Guide (with corporate overrides)
- **Linter:** ESLint v8+ with `eslint-config-corporate`
- **Formatter:** Prettier v3+ with `.prettierrc` config
- **File naming:** kebab-case (e.g., `speed-test-widget.js`)

### Best Practices
```javascript
// Use const/let, never var
const apiUrl = 'https://...';
let counter = 0;

// Use arrow functions for callbacks
array.map(item => item.id);

// Use template literals
const message = `Hello, ${name}!`;

// Use async/await over promises chains
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Destructuring for cleaner code
const { name, email } = user;

// Spread operator for object/array manipulation
const newUser = { ...user, active: true };

// Optional chaining for safe property access
const city = user?.address?.city;
```

---

## React Standards (if using React)

### Component Structure
```javascript
// Functional components only (no class components)
import React, { useState, useEffect } from 'react';

function SpeedTestWidget({ apiKey }) {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Side effects here
  }, []);

  return (
    <div className="speed-test-widget">
      {/* JSX here */}
    </div>
  );
}

export default SpeedTestWidget;
```

### Hooks
- Use built-in hooks (useState, useEffect, useContext, etc.)
- Custom hooks for reusable logic (prefix with `use`)
- Follow Rules of Hooks (only call at top level, only in React functions)

### Props Validation
```javascript
import PropTypes from 'prop-types';

SpeedTestWidget.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  theme: PropTypes.oneOf(['light', 'dark'])
};

SpeedTestWidget.defaultProps = {
  theme: 'light'
};
```

---

## CSS Standards

### Methodology
- **BEM (Block Element Modifier)** for class naming
- **Mobile-first** responsive design
- **CSS Custom Properties** for theming

### BEM Examples
```css
/* Block */
.speed-test-widget { }

/* Element */
.speed-test-widget__button { }
.speed-test-widget__metric-card { }

/* Modifier */
.speed-test-widget__button--primary { }
.speed-test-widget__button--disabled { }
```

### CSS Structure
```css
/* 1. CSS Custom Properties (design tokens) */
:root {
  --color-primary: #0066CC;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
}

/* 2. Reset/normalize (if needed) */

/* 3. Base styles */
body { font-family: Inter, sans-serif; }

/* 4. Layout */
.speed-test-widget { display: grid; }

/* 5. Components */
.speed-test-widget__button { }

/* 6. Utilities (sparingly) */
.u-text-center { text-align: center; }

/* 7. Media queries (mobile-first) */
@media (min-width: 768px) {
  .speed-test-widget { grid-template-columns: repeat(2, 1fr); }
}
```

### CSS Best Practices
- No `!important` (except utility classes)
- Max specificity: 3 levels deep
- Use `rem` for spacing, `em` for media queries
- Avoid ID selectors (#id)
- Prefix utilities with `u-`
- Prefix JavaScript hooks with `js-` (e.g., `js-start-button`)

---

## HTML Standards

### Semantic HTML
```html
<!-- GOOD: Semantic elements -->
<header>...</header>
<main>
  <section>
    <article>...</article>
  </section>
</main>
<footer>...</footer>

<!-- BAD: Div soup -->
<div class="header">...</div>
<div class="content">
  <div class="section">...</div>
</div>
```

### Accessibility
- Use semantic elements
- Add ARIA when HTML semantics aren't enough
- All images have alt text
- All form inputs have labels
- Buttons have descriptive text

```html
<!-- Buttons -->
<button aria-label="Start network speed test">Start Test</button>

<!-- Form inputs -->
<label for="api-key">API Key</label>
<input id="api-key" type="text" aria-required="true" />

<!-- Dynamic content -->
<div role="status" aria-live="polite">
  Download: 123 Mbps
</div>
```

---

## Testing Standards

### Unit Tests
- **Framework:** Jest + React Testing Library
- **Coverage Target:** >80%
- **File naming:** `*.test.js` (co-located with source files)

```javascript
// speed-test-widget.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import SpeedTestWidget from './speed-test-widget';

describe('SpeedTestWidget', () => {
  it('renders start button', () => {
    render(<SpeedTestWidget />);
    expect(screen.getByText('Start Test')).toBeInTheDocument();
  });

  it('disables button when test is running', () => {
    render(<SpeedTestWidget />);
    const button = screen.getByText('Start Test');
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });
});
```

### Integration Tests
- **Framework:** Cypress or Playwright
- **Coverage:** Critical user paths
- **Environment:** Test against deployed Liferay environment

### E2E Tests
- **Framework:** Cypress or Playwright
- **Coverage:** Happy path + critical errors
- **Frequency:** Run before production deployment

---

## Documentation Standards

### Code Comments
```javascript
/**
 * Calculates the progress percentage based on current value and max value
 *
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @returns {number} Progress percentage (0-100)
 *
 * @example
 * getProgress(50, 100); // Returns 50
 * getProgress(0, 100);  // Returns 0
 */
function getProgress(current, max) {
  return Math.min((current / max) * 100, 100);
}
```

### README Requirements
Every component/module should have a README with:
1. Purpose
2. Installation
3. Usage examples
4. Props/API documentation
5. Known issues
6. Changelog

---

## Performance Standards

### Bundle Size
- **Initial bundle:** <1MB (compressed)
- **Total bundle:** <5MB (compressed)
- **Code splitting:** For routes >100KB

### Load Time
- **Time to Interactive (TTI):** <3s on 3G
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s

### Optimization Techniques
- Lazy load non-critical components
- Use dynamic imports for code splitting
- Optimize images (WebP format, responsive sizes)
- Minify and compress all assets
- Use CDN for static assets

---

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize before display (prevent XSS)
- Use parameterized queries (if database access)

### Dependencies
- Automated security scanning (npm audit, Snyk)
- No dependencies with known high/critical vulnerabilities
- Quarterly dependency update review

### Content Security Policy (CSP)
- Comply with corporate CSP headers
- No inline scripts (use external files)
- No `eval()` or `new Function()`

---

## Version Control Standards

### Commit Messages
```
feat: add progress bar animation
fix: resolve metric card overflow on mobile
refactor: extract business logic to utils
docs: update README with deployment steps
test: add unit tests for data transformer
```

### Branch Strategy
- **main:** Production-ready code
- **develop:** Integration branch
- **feature/xxx:** Feature development
- **hotfix/xxx:** Emergency fixes

### Pull Request Requirements
- Code review by at least 1 peer
- All tests passing
- Linting passing
- Documentation updated

---

## Build & Deployment Standards

### Build Process
```bash
# Install dependencies
npm ci  # Use ci for reproducible builds

# Lint
npm run lint

# Test
npm run test

# Build
npm run build

# Size check
npm run analyze-bundle
```

### Environment Variables
- Use `.env` files (never commit `.env` files)
- Validate required env vars at build time
- Use different configs for dev/staging/prod

```javascript
// config.js
const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  apiKey: process.env.REACT_APP_API_KEY
};

// Validate
if (!config.apiUrl) {
  throw new Error('REACT_APP_API_URL is required');
}

export default config;
```

---

**Document Maintained By:** Corporate Frontend Team
**Last Updated:** 2026-03-25
**Questions:** Contact frontend-team@corporate.com
```

---

### 3.3 Deployment Checklist

**What to Provide:**
Step-by-step deployment process

**File:** `deployment-checklist.md`

```markdown
# Liferay Widget Deployment Checklist

## Pre-Deployment (Development Complete)

- [ ] All features implemented per requirements
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Code review completed and approved
- [ ] Design review completed (matches Figma)
- [ ] Accessibility audit completed (WCAG 2.1 AA)
- [ ] Performance audit completed (Lighthouse >90)
- [ ] Security scan completed (no high/critical vulnerabilities)
- [ ] Documentation complete (README, API docs)

---

## Build Preparation

- [ ] Update version number in package.json
- [ ] Update CHANGELOG.md with release notes
- [ ] Create git tag for release (e.g., v1.0.0)
- [ ] Verify all environment variables configured
- [ ] Run production build locally
- [ ] Test production build locally

```bash
# Build commands
npm ci
npm run lint
npm run test
npm run build:production

# Verify bundle size
ls -lh dist/
# Should be <5MB total
```

---

## Liferay Widget Packaging

- [ ] Create widget configuration file

```json
{
  "name": "Speed Test Widget",
  "version": "1.0.0",
  "description": "Network speed testing widget powered by Cloudflare",
  "category": "Diagnostics",
  "icon": "/assets/icon.png",
  "permissions": {
    "view": ["authenticated-users"],
    "configure": ["site-administrators"]
  }
}
```

- [ ] Package build artifacts into `.war` or `.zip` file
- [ ] Include manifest file
- [ ] Include icon and preview images
- [ ] Include configuration schema (if configurable)

---

## Staging Deployment

- [ ] Upload widget bundle to staging Liferay portal
- [ ] Configure widget permissions
- [ ] Add widget to test page
- [ ] Test functionality in staging environment
- [ ] Test with different user roles (viewer, admin)
- [ ] Test on all required browsers
- [ ] Test on mobile devices
- [ ] Verify analytics/monitoring integration
- [ ] Check console for errors
- [ ] Check network tab for failed requests
- [ ] Verify CSP compliance (no violations)

---

## UAT (User Acceptance Testing)

- [ ] Deploy to UAT environment
- [ ] Notify stakeholders for testing
- [ ] Collect feedback
- [ ] Fix any critical issues
- [ ] Re-deploy to UAT if changes made
- [ ] Get final sign-off from product owner

---

## Production Deployment

### Pre-Flight Checklist
- [ ] Staging environment stable for >24 hours
- [ ] UAT sign-off received
- [ ] Change request approved (if required)
- [ ] Deployment window scheduled
- [ ] Rollback plan prepared
- [ ] Monitoring alerts configured
- [ ] On-call engineer notified

### Deployment Steps
1. [ ] Upload widget bundle to production portal DAM
2. [ ] Configure widget settings (API keys, endpoints)
3. [ ] Configure permissions
4. [ ] Deploy to pilot page (limited users)
5. [ ] Monitor for 1 hour (check logs, metrics, errors)
6. [ ] If stable, deploy to all target pages
7. [ ] Monitor for 24 hours

### Post-Deployment
- [ ] Verify widget renders correctly on all pages
- [ ] Verify functionality (run smoke tests)
- [ ] Check error rates in monitoring dashboard
- [ ] Check performance metrics (load time, TTI)
- [ ] Verify analytics tracking
- [ ] Update internal documentation
- [ ] Notify support team of deployment
- [ ] Send release announcement to stakeholders

---

## Rollback Plan

### Triggers for Rollback
- Error rate >5%
- Performance degradation >50%
- Critical functionality broken
- Security vulnerability discovered

### Rollback Steps
1. [ ] Remove widget from portal pages
2. [ ] Restore previous version (if applicable)
3. [ ] Notify stakeholders of rollback
4. [ ] Investigate root cause
5. [ ] Fix issues
6. [ ] Re-test in staging
7. [ ] Re-deploy

---

## Monitoring Post-Deployment

### First 24 Hours
- [ ] Monitor error logs (Splunk/Sentry)
- [ ] Monitor performance (Dynatrace/New Relic)
- [ ] Monitor user analytics (usage patterns)
- [ ] Check support tickets (any new issues?)

### First Week
- [ ] Daily review of error rates
- [ ] Daily review of performance metrics
- [ ] Collect user feedback
- [ ] Triage any bugs found

### First Month
- [ ] Weekly metrics review
- [ ] Plan for next iteration based on feedback
- [ ] Conduct retrospective with team

---

**Deployment Owner:** [NAME]
**Last Updated:** 2026-03-25
```

---

## 4. Business Requirements Package

### 4.1 Feature Requirements

**What to Provide:**
Detailed feature specifications

**File:** `feature-requirements.md`

```markdown
# Feature Requirements - Network Speed Test Widget

## Overview
A self-service network diagnostic widget for internal employees to test their network connection quality.

---

## Core Features (MVP)

### F1: Speed Test Execution
**Priority:** P0 (Must Have)

**Description:**
Employees can run a network speed test to measure download/upload speeds, latency, jitter, and packet loss.

**Functional Requirements:**
- FR1.1: User can initiate a speed test with a single click
- FR1.2: Test runs automatically without user intervention
- FR1.3: Test completes in <90 seconds
- FR1.4: User can stop test at any time
- FR1.5: Real-time progress updates displayed during test

**Non-Functional Requirements:**
- NFR1.1: Test must not consume >1GB of bandwidth
- NFR1.2: Test must work on mobile and desktop
- NFR1.3: Test must handle network interruptions gracefully

**Acceptance Criteria:**
```gherkin
Given I am on the network diagnostics page
When I click "Start Test"
Then the test should begin and display "Testing..." status
And real-time metrics should update every second
And the test should complete within 90 seconds
And I should see final results with all metrics
```

---

### F2: Test Mode Selection
**Priority:** P1 (Should Have)

**Description:**
Users can choose between Quick, Standard, or Full test modes based on their needs.

**Functional Requirements:**
- FR2.1: User can select test mode before starting test
- FR2.2: Test mode cannot be changed during active test
- FR2.3: Each mode has different duration and data usage
  - Quick: ~30s, ~200MB
  - Standard: ~60s, ~600MB
  - Full: ~90s, ~1.3GB

**Acceptance Criteria:**
```gherkin
Given I am on the network diagnostics page
When I select "Quick Test" mode
And I click "Start Test"
Then the test should run in Quick mode
And should complete in approximately 30 seconds
```

---

### F3: Results Display
**Priority:** P0 (Must Have)

**Description:**
Clear visualization of test results with explanations.

**Functional Requirements:**
- FR3.1: Display download speed (Mbps)
- FR3.2: Display upload speed (Mbps)
- FR3.3: Display latency - idle and loaded (ms)
- FR3.4: Display jitter - idle and loaded (ms)
- FR3.5: Display packet loss (%)
- FR3.6: Display quality scores (streaming, gaming, RTC)
- FR3.7: Display data transfer amount (MB)
- FR3.8: Provide interpretation guidance (good/poor/average)

**Acceptance Criteria:**
```gherkin
Given the speed test has completed
When I view the results
Then I should see all 9 metrics clearly labeled
And each metric should have appropriate units
And quality scores should be color-coded (green/yellow/red)
And I should understand what the results mean
```

---

## Future Features (Post-MVP)

### F4: Results History
**Priority:** P2 (Nice to Have)

**Description:**
Store historical test results for trending analysis.

---

### F5: Results Export
**Priority:** P3 (Nice to Have)

**Description:**
Export results as PDF or CSV for reporting.

---

### F6: Location-Based Testing
**Priority:** P3 (Nice to Have)

**Description:**
Test from different geographic locations (if VPN support).

---

## Out of Scope

- ❌ Public-facing version (internal use only)
- ❌ Automated scheduled tests
- ❌ Comparison with other users
- ❌ Network troubleshooting recommendations
- ❌ ISP identification

---

**Document Owner:** Product Manager
**Last Updated:** 2026-03-25
```

---

### 4.2 User Stories

**What to Provide:**
User-centric feature descriptions

**File:** `user-stories.md`

```markdown
# User Stories - Network Speed Test Widget

## Epic: Self-Service Network Diagnostics

As an **internal employee**,
I want to **test my network connection quality**,
So that I can **troubleshoot connectivity issues and report accurate data to IT support**.

---

## User Story 1: Quick Network Check

**As a** remote employee
**I want** to quickly test my network speed
**So that** I can verify my connection is sufficient for video calls

**Acceptance Criteria:**
- I can start a test with one click
- The test completes in under 60 seconds
- I see clear results showing if my network is "good" or "poor"
- I understand what the results mean without technical knowledge

**Priority:** P0 (Must Have)
**Effort:** 3 story points

---

## User Story 2: Detailed Diagnostics

**As an** IT support agent
**I want** to see detailed network metrics
**So that** I can diagnose employee network issues accurately

**Acceptance Criteria:**
- I can view latency, jitter, packet loss in addition to speeds
- I can see both idle and loaded network conditions
- The data is precise enough for technical troubleshooting
- I can reference specific metrics when talking to ISP support

**Priority:** P0 (Must Have)
**Effort:** 5 story points

---

## User Story 3: Test Mode Selection

**As a** user with limited bandwidth
**I want** to choose a quick test mode
**So that** I don't use too much of my data allowance

**Acceptance Criteria:**
- I can select Quick, Standard, or Full test before starting
- I can see how much data each mode will use
- The test respects my selected mode
- I get results appropriate for the mode I chose

**Priority:** P1 (Should Have)
**Effort:** 2 story points

---

## User Story 4: Mobile Testing

**As a** mobile user
**I want** to test my network on my phone
**So that** I can diagnose mobile hotspot issues

**Acceptance Criteria:**
- The widget works on mobile browsers
- Touch interactions work smoothly
- Results are readable on small screens
- Test doesn't drain battery excessively

**Priority:** P0 (Must Have)
**Effort:** 3 story points

---

## User Story 5: Accessible Testing

**As a** user with visual impairment
**I want** to use the widget with a screen reader
**So that** I can independently diagnose my network

**Acceptance Criteria:**
- All buttons are labeled for screen readers
- Test progress is announced
- Results are announced when complete
- I can navigate with keyboard only

**Priority:** P0 (Must Have - WCAG requirement)
**Effort:** 3 story points

---

**Total Story Points:** 16 (MVP scope)
```

---

### 4.3 Acceptance Criteria

**What to Provide:**
Detailed testable acceptance criteria

**File:** `acceptance-criteria.md`

```markdown
# Acceptance Criteria - Network Speed Test Widget

## Functional Acceptance Criteria

### AC1: Test Execution
- [ ] User can click "Start Test" button to initiate test
- [ ] Button changes to "Testing..." and becomes disabled during test
- [ ] User can click "Stop Test" to cancel anytime
- [ ] Test automatically stops after completion
- [ ] Real-time metrics update at least once per second
- [ ] Test completes within specified time for each mode:
  - Quick: 20-45 seconds
  - Standard: 45-75 seconds
  - Full: 75-120 seconds

### AC2: Results Accuracy
- [ ] Download speed reported in Mbps with 2 decimal precision
- [ ] Upload speed reported in Mbps with 2 decimal precision
- [ ] Latency reported in milliseconds (whole numbers)
- [ ] Jitter reported in milliseconds (whole numbers)
- [ ] Packet loss reported as percentage (2 decimal precision)
- [ ] Quality scores shown as points and classification
- [ ] All metrics match Cloudflare SDK output (no transformation errors)

### AC3: UI/UX
- [ ] Widget matches Figma designs (100% visual compliance)
- [ ] All interactive elements respond to hover
- [ ] All interactive elements respond to click/tap
- [ ] Loading states show skeleton loaders or spinners
- [ ] Error messages are clear and actionable
- [ ] Success confirmation shown on test completion
- [ ] Animations are smooth (60fps)

### AC4: Responsive Design
- [ ] Works on mobile (320px wide)
- [ ] Works on tablet (768px wide)
- [ ] Works on desktop (1024px+ wide)
- [ ] No horizontal scroll at any breakpoint
- [ ] All content readable without zooming
- [ ] Touch targets ≥44px on mobile

---

## Non-Functional Acceptance Criteria

### AC5: Performance
- [ ] Initial widget load <2 seconds on 3G
- [ ] Time to Interactive <3 seconds on 3G
- [ ] Lighthouse Performance score >90
- [ ] Bundle size <500KB (gzipped)
- [ ] No memory leaks (test for 10 consecutive runs)

### AC6: Accessibility (WCAG 2.1 AA)
- [ ] All color contrast ratios ≥4.5:1 (normal text)
- [ ] All color contrast ratios ≥3:1 (large text, UI components)
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces all content correctly (NVDA, VoiceOver)
- [ ] ARIA attributes used correctly (validated with axe DevTools)
- [ ] No accessibility violations in automated audit

### AC7: Browser Compatibility
- [ ] Works on Chrome 120+ (Windows, Mac, Android)
- [ ] Works on Firefox 120+ (Windows, Mac)
- [ ] Works on Safari 17+ (Mac, iOS)
- [ ] Works on Edge 120+ (Windows)
- [ ] No console errors on any supported browser
- [ ] Visual consistency across all browsers

### AC8: Security
- [ ] No XSS vulnerabilities (validated with DAST scan)
- [ ] CSP compliant (no violations)
- [ ] No high/critical dependencies vulnerabilities (npm audit)
- [ ] No sensitive data logged to console
- [ ] HTTPS only (no mixed content)

### AC9: Code Quality
- [ ] Test coverage ≥80%
- [ ] ESLint passing (no errors, <5 warnings)
- [ ] No TODO/FIXME comments in production code
- [ ] All functions have JSDoc comments
- [ ] README.md complete with usage examples

---

## Integration Acceptance Criteria

### AC10: Liferay Integration
- [ ] Widget deploys successfully to Liferay portal
- [ ] Widget renders correctly on portal page
- [ ] Widget respects portal authentication
- [ ] Widget inherits portal theme (colors, fonts)
- [ ] Widget works alongside other portal widgets (no conflicts)
- [ ] Widget configuration persists across page reloads

---

## User Acceptance Testing (UAT) Criteria

### AC11: Business Value
- [ ] Employees can successfully diagnose network issues
- [ ] IT support can reference accurate metrics from widget
- [ ] Widget reduces support tickets by 20% (measured over 3 months)
- [ ] >80% user satisfaction score (post-use survey)

### AC12: Usability
- [ ] Non-technical users can complete test without assistance
- [ ] Users understand what results mean
- [ ] No user reports confusion about UI
- [ ] Users complete test on first attempt (success rate >95%)

---

## Deployment Acceptance Criteria

### AC13: Production Readiness
- [ ] All development complete
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved
- [ ] Design review approved (UIUX sign-off)
- [ ] Security review approved
- [ ] Accessibility audit approved
- [ ] Documentation complete
- [ ] Deployment runbook prepared
- [ ] Rollback plan prepared
- [ ] Monitoring/alerting configured

---

## Definition of Done

A feature is "Done" when:
1. Code is written and committed
2. Unit tests written and passing
3. Integration tests written and passing
4. Code reviewed and approved
5. Merged to develop branch
6. Deployed to staging
7. UAT completed and approved
8. Documentation updated
9. Acceptance criteria met (all boxes checked)

---

**Sign-off Required From:**
- [ ] Product Owner (business requirements met)
- [ ] UIUX Designer (design compliance)
- [ ] QA Lead (testing complete)
- [ ] Security Architect (security review passed)
- [ ] Technical Lead (code quality approved)

**Document Owner:** Product Owner
**Last Updated:** 2026-03-25
```

---

## 5. Session Brief

### 5.1 Council Session Brief

**File:** `COUNCIL_SESSION_BRIEF.md`

See Section 5.3 in the full integration plan above for the complete template.

This is the **MOST IMPORTANT** document for the DeveloperCouncil session. It orchestrates the entire review process.

---

## Preparation Timeline

### 4 Weeks Before Session
- [ ] Assign preparation owners for each package
- [ ] Create shared repository for input materials
- [ ] Schedule UIUX team to prepare Figma designs
- [ ] Schedule initial kickoff meeting

### 3 Weeks Before Session
- [ ] UIUX team: Start Figma designs
- [ ] Frontend team: Start prototype analysis
- [ ] DevOps team: Gather Liferay environment specs

### 2 Weeks Before Session
- [ ] UIUX team: Complete design specifications
- [ ] Frontend team: Complete gap analysis
- [ ] Product team: Complete business requirements
- [ ] Technical lead: Draft session brief

### 1 Week Before Session
- [ ] All input packages complete and uploaded
- [ ] Grant Figma access to all council specialists
- [ ] Distribute input package to council for review
- [ ] Council specialists: Prep time (2-3 hours each)

### Day Before Session
- [ ] Confirm all specialists available
- [ ] Test screen sharing / presentation setup
- [ ] Prepare demo environment (prototype running locally)
- [ ] Review session agenda

---

## Delivery Format

### Recommended Repository Structure

```
developer-council-inputs/
├── README.md (index with links to all documents)
├── 1-design-specifications/
│   ├── figma-link.md
│   ├── design-tokens.json
│   ├── component-specs/
│   │   ├── button.md
│   │   ├── progress-bar.md
│   │   ├── metric-card.md
│   │   └── ...
│   ├── interaction-specs.md
│   ├── accessibility-requirements.md
│   └── visual-exports/
│       ├── screens/
│       ├── components/
│       └── assets/
│
├── 2-current-prototype/
│   ├── source-code/ (full Git repo or .zip)
│   ├── component-inventory.md
│   ├── gap-analysis.md
│   ├── architecture-diagram.png
│   └── dependency-list.md
│
├── 3-target-environment/
│   ├── liferay-environment.yaml
│   ├── corporate-standards.md
│   ├── deployment-checklist.md
│   └── portal-theme-reference/ (sample CSS/HTML)
│
├── 4-business-requirements/
│   ├── feature-requirements.md
│   ├── user-stories.md
│   ├── acceptance-criteria.md
│   └── non-functional-requirements.md
│
└── 5-session-brief/
    ├── COUNCIL_SESSION_BRIEF.md
    └── review-checklist.md
```

---

## Quick Start for Session Facilitator

1. **Clone the template structure** (use this document as reference)
2. **Assign owners** for each package (UIUX, Frontend, DevOps, Product)
3. **Set deadlines** (4 weeks → 3 weeks → 2 weeks → 1 week → session)
4. **Review weekly** to ensure preparation is on track
5. **Distribute inputs** 1 week before session for specialist review
6. **Conduct session** following the agenda in COUNCIL_SESSION_BRIEF.md
7. **Capture outputs** (ADR, roadmap, recommendations)
8. **Create backlog** from council recommendations
9. **Kickoff implementation** within 1 week of session

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Start session without complete input package
- Expect specialists to review during session (they need prep time)
- Skip the gap analysis (council needs to know current state)
- Ignore accessibility requirements (causes rework later)
- Overlook Liferay integration complexity

✅ **Do:**
- Prepare thoroughly (40+ hours total team effort)
- Give specialists 1 week to review inputs before session
- Document everything (specifications, decisions, rationale)
- Include real Figma designs (not just wireframes)
- Test prototype before session (avoid demo failures)

---

## Success Checklist

Your DeveloperCouncil session will be successful if you have:

- [ ] Complete design specifications with design tokens
- [ ] Thorough prototype analysis with gap identification
- [ ] Accurate Liferay environment specifications
- [ ] Clear business requirements and acceptance criteria
- [ ] Well-structured session brief with focused questions
- [ ] All specialists granted access to materials 1 week prior
- [ ] Prototype running and demo-ready
- [ ] Note-taker assigned for session
- [ ] Follow-up actions owner assigned

---

**Document Created:** 2026-03-25
**Version:** 1.0
**Next Review:** After first DeveloperCouncil session

**Questions?**
- Contact: [Technical Lead]
- Email: [EMAIL]
- Slack: #developer-council
