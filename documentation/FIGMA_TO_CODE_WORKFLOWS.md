# Figma-to-Code Workflows with Claude Code
## Practical Guide for UIUX → Development Handoff

**Purpose:** Step-by-step workflows for transforming Figma designs into production-ready code using Claude Code assistance.

**Audience:** UIUX designers, frontend developers

---

## Table of Contents

1. [Workflow Overview](#workflow-overview)
2. [Workflow 1: Design Token Extraction](#workflow-1-design-token-extraction)
3. [Workflow 2: Component Generation from Specs](#workflow-2-component-generation-from-specs)
4. [Workflow 3: Screenshot-to-Component](#workflow-3-screenshot-to-component)
5. [Workflow 4: Iterative Refinement](#workflow-4-iterative-refinement)
6. [Workflow 5: DeveloperCouncil Integration](#workflow-5-developercouncil-integration)
7. [Best Practices](#best-practices)

---

## Workflow Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Figma     │      │ Claude Code  │      │  Developer  │      │ Production   │
│   Design    │─────▶│  Generation  │─────▶│   Review    │─────▶│   Code       │
│             │      │              │      │             │      │              │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
     │                     │                      │                     │
     │                     │                      │                     │
  Exports             Generates              Refines              Integrates
  - Tokens            - Components           - Business Logic     - Into Portal
  - Screenshots       - Styles               - Edge Cases         - Deploy
  - Specs             - Tests                - Interactions
```

---

## Workflow 1: Design Token Extraction

**Goal:** Convert Figma design tokens (colors, typography, spacing) into CSS custom properties and JavaScript constants.

### Step 1.1: Export from Figma

**Using Figma Plugin: "Design Tokens"**

1. In Figma, select your design file
2. Go to Plugins → Design Tokens
3. Configure export settings:
   ```
   Format: JSON
   Token naming: CSS Custom Properties
   Output: design-tokens.json
   ```
4. Export to local file

**Sample Output: `design-tokens.json`**
```json
{
  "color": {
    "brand": {
      "primary": {
        "value": "#0066CC",
        "type": "color"
      },
      "secondary": {
        "value": "#6B7280",
        "type": "color"
      }
    },
    "status": {
      "success": { "value": "#10B981", "type": "color" },
      "warning": { "value": "#F59E0B", "type": "color" },
      "error": { "value": "#EF4444", "type": "color" }
    },
    "neutral": {
      "50": { "value": "#F9FAFB", "type": "color" },
      "100": { "value": "#F3F4F6", "type": "color" },
      "900": { "value": "#111827", "type": "color" }
    }
  },
  "fontSize": {
    "xs": { "value": "12px", "type": "dimension" },
    "sm": { "value": "14px", "type": "dimension" },
    "base": { "value": "16px", "type": "dimension" },
    "lg": { "value": "18px", "type": "dimension" }
  },
  "spacing": {
    "xs": { "value": "4px", "type": "dimension" },
    "sm": { "value": "8px", "type": "dimension" },
    "md": { "value": "16px", "type": "dimension" },
    "lg": { "value": "24px", "type": "dimension" }
  }
}
```

### Step 1.2: Ask Claude Code to Convert Tokens

**Prompt to Claude Code:**

```
I have design tokens exported from Figma as JSON. Please convert them to:

1. CSS custom properties (for styles)
2. JavaScript constants (for programmatic use)
3. TypeScript types (for type safety)

The tokens should follow corporate naming conventions:
- CSS: --color-brand-primary (kebab-case with -- prefix)
- JS: colorBrandPrimary (camelCase)

Please create separate files:
- src/styles/design-tokens.css
- src/constants/design-tokens.js
- src/types/design-tokens.d.ts

Here are the tokens:
[Attach: design-tokens.json]
```

**Expected Claude Code Output:**

**File 1: `src/styles/design-tokens.css`**
```css
/**
 * Design Tokens - Exported from Figma
 * DO NOT EDIT MANUALLY - Generated from design-tokens.json
 * Last updated: 2026-03-25
 */

:root {
  /* Colors - Brand */
  --color-brand-primary: #0066CC;
  --color-brand-secondary: #6B7280;

  /* Colors - Status */
  --color-status-success: #10B981;
  --color-status-warning: #F59E0B;
  --color-status-error: #EF4444;

  /* Colors - Neutral */
  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-900: #111827;

  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

**File 2: `src/constants/design-tokens.js`**
```javascript
/**
 * Design Tokens - JavaScript constants
 * DO NOT EDIT MANUALLY - Generated from design-tokens.json
 * Last updated: 2026-03-25
 */

export const colors = {
  brand: {
    primary: '#0066CC',
    secondary: '#6B7280',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    900: '#111827',
  },
};

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
};

// Convenience function to get CSS variable reference
export const cssVar = (path) => `var(--${path.replace(/\./g, '-')})`;
```

**File 3: `src/types/design-tokens.d.ts`**
```typescript
/**
 * Design Tokens - TypeScript type definitions
 * DO NOT EDIT MANUALLY - Generated from design-tokens.json
 */

export type ColorBrand = 'primary' | 'secondary';
export type ColorStatus = 'success' | 'warning' | 'error';
export type ColorNeutral = '50' | '100' | '900';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg';
export type Spacing = 'xs' | 'sm' | 'md' | 'lg';

export interface DesignTokens {
  colors: {
    brand: Record<ColorBrand, string>;
    status: Record<ColorStatus, string>;
    neutral: Record<ColorNeutral, string>;
  };
  fontSize: Record<FontSize, string>;
  spacing: Record<Spacing, string>;
}
```

### Step 1.3: Integrate into Project

**Prompt to Claude Code:**

```
Now update my main CSS file to import these design tokens,
and show me how to use them in React components.

Also update package.json to add a script that validates
design tokens against the JSON source.
```

**Expected Output:**

**File: `src/styles/main.css`**
```css
/* Import design tokens first */
@import './design-tokens.css';

/* Base styles using tokens */
body {
  font-size: var(--font-size-base);
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-50);
}

/* Example component using tokens */
.button--primary {
  background-color: var(--color-brand-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
}
```

**File: `src/components/Button.jsx` (Example Usage)**
```jsx
import React from 'react';
import { colors, spacing } from '../constants/design-tokens';

function Button({ variant = 'primary', children }) {
  // Option 1: Use CSS custom properties (recommended)
  return (
    <button className={`button button--${variant}`}>
      {children}
    </button>
  );

  // Option 2: Inline styles with JS constants (if needed)
  const styles = {
    backgroundColor: variant === 'primary' ? colors.brand.primary : colors.brand.secondary,
    padding: `${spacing.md} ${spacing.lg}`,
  };

  return <button style={styles}>{children}</button>;
}

export default Button;
```

---

## Workflow 2: Component Generation from Specs

**Goal:** Generate a complete React/Vue component from a written specification.

### Step 2.1: Create Component Specification

**File: `design-specs/metric-card-spec.md`**

```markdown
# Metric Card Component

## Visual Reference
[Attach screenshot: metric-card-idle.png]
[Attach screenshot: metric-card-loading.png]
[Attach screenshot: metric-card-complete.png]

## Purpose
Display a single network metric (download speed, upload speed, latency, etc.)
with label, value, unit, and animated progress indicator.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | Yes | - | Metric name (e.g., "Download Speed") |
| value | number | null | Yes | - | Metric value (null = not available) |
| unit | string | Yes | - | Unit of measurement (e.g., "Mbps", "ms") |
| progress | number | No | 0 | Progress percentage (0-100) |
| status | 'idle' \| 'loading' \| 'complete' \| 'error' | No | 'idle' | Current state |
| threshold | object | No | null | { good: 100, average: 50 } for color coding |

## States

### Idle (before test)
- Background: var(--color-neutral-50)
- Border: 1px solid var(--color-neutral-200)
- Value: "--" (placeholder)
- Progress bar: hidden

### Loading (during test)
- Background: var(--color-neutral-50)
- Border: 1px solid var(--color-brand-primary)
- Value: updating in real-time
- Progress bar: visible, animated
- Skeleton loader: pulse animation if value is null

### Complete (after test)
- Background: var(--color-neutral-50)
- Border: 1px solid based on threshold
  - Good: var(--color-status-success)
  - Average: var(--color-status-warning)
  - Poor: var(--color-status-error)
- Value: final value displayed
- Progress bar: 100%

### Error
- Background: var(--color-neutral-50)
- Border: 1px solid var(--color-status-error)
- Value: "Error"
- Icon: error icon displayed

## Layout

```
┌─────────────────────────────────────────┐
│  LABEL                           [Icon] │  ← 14px, medium weight
│                                         │
│  ███████████████░░░░░░░░░  75%         │  ← Progress bar (4px height)
│                                         │
│  123.45 Mbps                           │  ← Value + Unit (24px, bold)
└─────────────────────────────────────────┘
   ← Padding: 16px all sides
   ← Border-radius: 8px
```

## Progress Bar Logic

Color based on value vs. threshold:
```javascript
if (value >= threshold.good) return 'success';
else if (value >= threshold.average) return 'warning';
else return 'error';
```

Width based on progress prop (0-100%).

## Animations

- **Progress bar fill**: transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Skeleton pulse**: opacity 1 → 0.5 → 1, 2s infinite
- **Border color change**: transition: border-color 200ms ease

## Accessibility

- Card: role="region", aria-labelledby="metric-label-{id}"
- Label: id="metric-label-{id}"
- Progress: role="progressbar", aria-valuenow={progress}, aria-valuemin="0", aria-valuemax="100"
- Value changes: aria-live="polite"

## Example Usage

```jsx
<MetricCard
  label="Download Speed"
  value={123.45}
  unit="Mbps"
  progress={75}
  status="complete"
  threshold={{ good: 100, average: 50 }}
/>
```
```

### Step 2.2: Ask Claude Code to Generate Component

**Prompt to Claude Code:**

```
Please generate a React component based on this specification.

Requirements:
- Use functional component with hooks
- Follow BEM naming convention for CSS classes
- Use design tokens from src/constants/design-tokens.js
- Implement all states (idle, loading, complete, error)
- Include PropTypes for validation
- Add comprehensive JSDoc comments
- Create a separate CSS file using BEM
- Make it accessible (WCAG 2.1 AA)

Files to create:
- src/components/MetricCard/MetricCard.jsx
- src/components/MetricCard/MetricCard.css
- src/components/MetricCard/MetricCard.test.jsx (unit tests)
- src/components/MetricCard/index.js (barrel export)

Specification:
[Attach: design-specs/metric-card-spec.md]
[Attach: screenshots: metric-card-*.png]
```

**Expected Claude Code Output:**

**File 1: `src/components/MetricCard/MetricCard.jsx`**
```jsx
import React, { useId } from 'react';
import PropTypes from 'prop-types';
import './MetricCard.css';

/**
 * MetricCard - Displays a network metric with progress indicator
 *
 * @component
 * @example
 * <MetricCard
 *   label="Download Speed"
 *   value={123.45}
 *   unit="Mbps"
 *   progress={75}
 *   status="complete"
 *   threshold={{ good: 100, average: 50 }}
 * />
 */
function MetricCard({
  label,
  value,
  unit,
  progress = 0,
  status = 'idle',
  threshold = null,
}) {
  const id = useId();
  const labelId = `metric-label-${id}`;

  /**
   * Determine progress bar color based on value and threshold
   */
  const getProgressColor = () => {
    if (!threshold || value === null) return 'neutral';
    if (value >= threshold.good) return 'success';
    if (value >= threshold.average) return 'warning';
    return 'error';
  };

  /**
   * Format value for display
   */
  const getDisplayValue = () => {
    if (status === 'error') return 'Error';
    if (value === null) return '--';
    return value.toFixed(2);
  };

  const progressColor = getProgressColor();
  const displayValue = getDisplayValue();
  const showProgress = status === 'loading' || status === 'complete';

  return (
    <div
      className={`metric-card metric-card--${status} metric-card--${progressColor}`}
      role="region"
      aria-labelledby={labelId}
    >
      <div className="metric-card__header">
        <span id={labelId} className="metric-card__label">
          {label}
        </span>
      </div>

      {showProgress && (
        <div className="metric-card__progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div
            className={`metric-card__progress-fill metric-card__progress-fill--${progressColor}`}
            style={{ width: `${progress}%` }}
          />
          <span className="metric-card__progress-text">{progress}%</span>
        </div>
      )}

      <div className="metric-card__value" aria-live="polite">
        {status === 'loading' && value === null ? (
          <div className="metric-card__skeleton" aria-label="Loading...">
            <div className="metric-card__skeleton-line" />
          </div>
        ) : (
          <>
            <span className="metric-card__number">{displayValue}</span>
            {value !== null && status !== 'error' && (
              <span className="metric-card__unit">{unit}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

MetricCard.propTypes = {
  /** Metric name (e.g., "Download Speed") */
  label: PropTypes.string.isRequired,
  /** Metric value (null = not available) */
  value: PropTypes.number,
  /** Unit of measurement (e.g., "Mbps", "ms") */
  unit: PropTypes.string.isRequired,
  /** Progress percentage (0-100) */
  progress: PropTypes.number,
  /** Current state */
  status: PropTypes.oneOf(['idle', 'loading', 'complete', 'error']),
  /** Thresholds for color coding { good: number, average: number } */
  threshold: PropTypes.shape({
    good: PropTypes.number.isRequired,
    average: PropTypes.number.isRequired,
  }),
};

export default MetricCard;
```

**File 2: `src/components/MetricCard/MetricCard.css`**
```css
/**
 * MetricCard Component Styles
 * BEM Naming Convention
 */

/* Block */
.metric-card {
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  border-radius: 8px;
  padding: var(--spacing-md);
  transition: border-color 200ms ease;
}

/* State Modifiers */
.metric-card--loading {
  border-color: var(--color-brand-primary);
}

.metric-card--complete.metric-card--success {
  border-color: var(--color-status-success);
}

.metric-card--complete.metric-card--warning {
  border-color: var(--color-status-warning);
}

.metric-card--complete.metric-card--error {
  border-color: var(--color-status-error);
}

.metric-card--error {
  border-color: var(--color-status-error);
}

/* Elements */
.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.metric-card__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-neutral-600);
}

.metric-card__progress {
  position: relative;
  height: 4px;
  background-color: var(--color-neutral-200);
  border-radius: 2px;
  margin: var(--spacing-sm) 0;
  overflow: hidden;
}

.metric-card__progress-fill {
  height: 100%;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.metric-card__progress-fill--success {
  background: linear-gradient(90deg, #10B981 0%, #059669 100%);
}

.metric-card__progress-fill--warning {
  background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
}

.metric-card__progress-fill--error {
  background: linear-gradient(90deg, #EF4444 0%, #DC2626 100%);
}

.metric-card__progress-fill--neutral {
  background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
}

.metric-card__progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
}

.metric-card__value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.metric-card__number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-neutral-900);
}

.metric-card__unit {
  font-size: var(--font-size-sm);
  font-weight: 400;
  color: var(--color-neutral-500);
}

/* Skeleton Loader */
.metric-card__skeleton {
  width: 100%;
}

.metric-card__skeleton-line {
  height: 24px;
  background-color: var(--color-neutral-200);
  border-radius: 4px;
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .metric-card {
    padding: var(--spacing-sm);
  }

  .metric-card__number {
    font-size: 20px;
  }
}
```

**File 3: `src/components/MetricCard/MetricCard.test.jsx`**
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  const defaultProps = {
    label: 'Download Speed',
    value: 123.45,
    unit: 'Mbps',
  };

  it('renders label and value', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('Download Speed')).toBeInTheDocument();
    expect(screen.getByText('123.45')).toBeInTheDocument();
    expect(screen.getByText('Mbps')).toBeInTheDocument();
  });

  it('shows placeholder when value is null', () => {
    render(<MetricCard {...defaultProps} value={null} />);
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('shows progress bar when status is loading', () => {
    render(<MetricCard {...defaultProps} status="loading" progress={50} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows skeleton loader when loading and value is null', () => {
    render(<MetricCard {...defaultProps} value={null} status="loading" />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<MetricCard {...defaultProps} status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies success color when value exceeds good threshold', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        value={150}
        status="complete"
        threshold={{ good: 100, average: 50 }}
      />
    );
    expect(container.firstChild).toHaveClass('metric-card--success');
  });

  it('applies warning color when value is between thresholds', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        value={75}
        status="complete"
        threshold={{ good: 100, average: 50 }}
      />
    );
    expect(container.firstChild).toHaveClass('metric-card--warning');
  });

  it('applies error color when value is below average threshold', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        value={25}
        status="complete"
        threshold={{ good: 100, average: 50 }}
      />
    );
    expect(container.firstChild).toHaveClass('metric-card--error');
  });

  it('has accessible label', () => {
    render(<MetricCard {...defaultProps} />);
    const region = screen.getByRole('region');
    expect(region).toHaveAccessibleName('Download Speed');
  });

  it('announces value changes', () => {
    render(<MetricCard {...defaultProps} />);
    const valueElement = screen.getByText('123.45').parentElement;
    expect(valueElement).toHaveAttribute('aria-live', 'polite');
  });
});
```

**File 4: `src/components/MetricCard/index.js`**
```javascript
export { default } from './MetricCard';
```

### Step 2.3: Review and Refine

**Prompt to Claude Code:**

```
Review the generated MetricCard component for:
1. WCAG 2.1 AA compliance
2. Performance (re-render optimization)
3. Edge cases (negative values, very large numbers)

Suggest improvements.
```

---

## Workflow 3: Screenshot-to-Component

**Goal:** Generate a component directly from a screenshot using Claude Code's vision capabilities.

### Step 3.1: Prepare Screenshot

**Export from Figma:**
1. Select the component frame in Figma
2. Right-click → Export → PNG (2x resolution for clarity)
3. Save as `metric-card-screenshot.png`

### Step 3.2: Ask Claude Code with Screenshot

**Prompt to Claude Code:**

```
I have a screenshot of a UI component from Figma. Please generate a React
component that matches this design exactly.

Requirements:
- Use BEM CSS naming
- Use design tokens from src/constants/design-tokens.js
- Make it responsive (mobile-first)
- Include all states visible in the screenshot
- Add accessibility attributes
- Create component + CSS + tests

Screenshot attached.
```

**Attach:** `metric-card-screenshot.png`

**Expected Output:**
Claude Code will analyze the screenshot and generate:
1. Component structure matching visual layout
2. CSS with correct spacing, colors, typography
3. Responsive breakpoints
4. Accessibility attributes

### Step 3.3: Refine Based on Specs

**Prompt to Claude Code:**

```
The generated component looks good visually, but please refine it to match
these functional requirements:

1. Add progress prop (0-100) for animated progress bar
2. Add status prop ('idle' | 'loading' | 'complete' | 'error')
3. Add threshold prop for color-coding based on value
4. Implement skeleton loader for loading state when value is null
5. Add animations: progress bar fill (300ms), skeleton pulse (2s)

Keep the visual design the same, just add this behavior.
```

---

## Workflow 4: Iterative Refinement

**Goal:** Iteratively improve a generated component through multiple rounds of refinement.

### Round 1: Initial Generation

```
Generate a Button component with primary, secondary, and tertiary variants.
Use design tokens. Include hover, focus, active, and disabled states.
```

### Round 2: Accessibility Review

```
/developer-council quick review src/components/Button/Button.jsx

Focus: WCAG 2.1 AA accessibility compliance
```

**DeveloperCouncil Output:**
- SecurityArchitect: "Missing aria-disabled attribute"
- QaTester: "Focus indicator not visible on all backgrounds"

### Round 3: Fix Issues

```
Please fix the accessibility issues identified:

1. Add aria-disabled when disabled (not just disabled attribute)
2. Improve focus indicator visibility with outline-offset and high-contrast color
3. Add aria-label support for icon-only buttons
```

### Round 4: Performance Optimization

```
/developer-council review src/components/Button/Button.jsx

Focus: Performance and re-render optimization
```

**DeveloperCouncil Output:**
- SoftwareDeveloper: "Consider memoizing the component"
- SoftwareDeveloper: "Inline styles on every render - extract to CSS"

### Round 5: Apply Optimizations

```
Apply the performance optimizations suggested by the council:

1. Wrap component with React.memo
2. Move inline styles to CSS classes
3. Use CSS custom properties for dynamic values
```

---

## Workflow 5: DeveloperCouncil Integration

**Goal:** Use DeveloperCouncil throughout the Figma-to-code process for quality gates.

### Phase 1: Design Token Review

```
/developer-council review src/constants/design-tokens.js src/styles/design-tokens.css

Question: Are these design tokens correctly structured and do they follow
corporate standards?

Context: Exported from Figma using Design Tokens plugin
```

**Expected Feedback:**
- SoftwareDeveloper: "Token naming is good. Consider adding dark mode variants."
- DocumentationWriter: "Add comments explaining token usage."
- SecurityArchitect: "Ensure tokens don't expose sensitive brand colors to competitors."

### Phase 2: Component Architecture Review

```
/developer-council review src/components/MetricCard/

Question: Does this component architecture align with corporate standards
and Liferay widget requirements?

Context: Generated from Figma specs, needs to work in Liferay portal
```

**Expected Feedback:**
- SoftwareDeveloper: "Good component structure. Consider extracting ProgressBar as separate component."
- DevOpsEngineer: "Bundle size looks good. Ensure CSS is tree-shakeable."
- QaTester: "Test coverage is excellent. Add visual regression tests."

### Phase 3: Accessibility Audit

```
/developer-council full council review src/components/

Focus: WCAG 2.1 AA compliance audit before production

All components in this directory need accessibility review.
```

**Expected Feedback:**
- SecurityArchitect: "Add Content Security Policy meta tags"
- QaTester: "Keyboard navigation tested and working"
- DocumentationWriter: "Need to document accessibility features in README"

### Phase 4: Pre-Production Review

```
/developer-council full council review

Final review before production deployment. Are we ready to ship?

Context: All components match Figma designs, tests passing, Liferay integration tested.
```

**Expected Feedback:**
- All specialists: Final sign-off or critical blockers
- Creates final checklist of pre-deployment tasks

---

## Best Practices

### 1. Start with Design Tokens

**Always** generate design tokens first before generating components. Components should reference tokens, not hardcoded values.

```javascript
// ❌ Bad: Hardcoded
const buttonStyle = { backgroundColor: '#0066CC' };

// ✅ Good: Using tokens
const buttonStyle = { backgroundColor: 'var(--color-brand-primary)' };
```

### 2. Provide Rich Context

Give Claude Code as much context as possible:

- ✅ Figma screenshots
- ✅ Design specifications
- ✅ Interaction requirements
- ✅ Accessibility requirements
- ✅ Existing code patterns to follow

### 3. Iterate in Small Steps

Don't ask for everything at once:

1. Generate basic component structure
2. Add styling
3. Add interactions
4. Add accessibility
5. Add tests
6. Optimize performance

### 4. Use DeveloperCouncil as Quality Gates

Run council reviews at key milestones:

- After design token generation
- After component generation
- After accessibility implementation
- Before production deployment

### 5. Validate Against Figma

After generation, always compare output to Figma designs:

```
Please compare the generated component to the Figma screenshot
and identify any visual differences. List specific differences
in spacing, colors, typography, and layout.

[Attach: figma-screenshot.png]
[Attach: rendered-component-screenshot.png]
```

### 6. Document Design Decisions

When deviating from Figma designs (e.g., for accessibility), document why:

```css
/*
 * Deviation from Figma: Increased focus outline from 1px to 2px
 * Reason: WCAG 2.1 requires 2px minimum for sufficient visibility
 * Approved by: UIUX Team (2026-03-25)
 */
.button:focus {
  outline: 2px solid var(--color-brand-primary);
}
```

### 7. Version Control for Design Tokens

Track design token changes in git:

```bash
# Commit message convention
feat(design-tokens): update primary color to match new brand guidelines

- Changed --color-brand-primary from #0066CC to #0052A3
- Updated all components to use new primary color
- Figma source: [Figma URL]
- Approved by: Brand Team
```

### 8. Automated Visual Regression Testing

Set up automated visual regression tests for components:

```javascript
// src/components/MetricCard/MetricCard.visual.test.js
import { test, expect } from '@playwright/test';

test('MetricCard renders correctly in idle state', async ({ page }) => {
  await page.goto('/storybook/?path=/story/metriccard--idle');
  await expect(page).toHaveScreenshot('metric-card-idle.png');
});

test('MetricCard renders correctly in loading state', async ({ page }) => {
  await page.goto('/storybook/?path=/story/metriccard--loading');
  await expect(page).toHaveScreenshot('metric-card-loading.png');
});
```

---

## Common Issues & Solutions

### Issue 1: Colors Don't Match Figma

**Cause:** Color space conversion (Figma uses RGB, browser displays in sRGB)

**Solution:**
```
Claude, the generated colors look different from Figma. Please:

1. Double-check hex codes match exactly
2. Add color profile meta tag for consistent rendering
3. Test in multiple browsers (Chrome, Firefox, Safari)
```

### Issue 2: Spacing is Off

**Cause:** Figma uses absolute pixels, but we need responsive units

**Solution:**
```
Claude, convert all px values to rem for better scalability:

1. Base font size is 16px
2. Use rem for font sizes and spacing
3. Use em for component-specific spacing
4. Keep px only for borders (1px, 2px)
```

### Issue 3: Animations Not Smooth

**Cause:** Missing GPU acceleration or complex animations

**Solution:**
```
Claude, optimize animations for 60fps:

1. Use transform instead of top/left/width/height
2. Add will-change for animated properties
3. Use cubic-bezier for natural easing
4. Test on lower-end devices
```

### Issue 4: Component Not Accessible

**Cause:** Missing ARIA attributes or semantic HTML

**Solution:**
```
/developer-council quick review src/components/Button.jsx

Focus: WCAG 2.1 AA accessibility
Run full accessibility audit and provide specific fixes.
```

---

## Sample Project Structure

After following these workflows, your project should look like:

```
src/
├── constants/
│   └── design-tokens.js          # Generated from Figma
├── styles/
│   ├── design-tokens.css         # CSS custom properties
│   └── main.css                  # Global styles
├── components/
│   ├── MetricCard/
│   │   ├── MetricCard.jsx        # Generated component
│   │   ├── MetricCard.css        # BEM styles
│   │   ├── MetricCard.test.jsx   # Unit tests
│   │   └── index.js              # Barrel export
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Button.test.jsx
│   │   └── index.js
│   └── ...
├── types/
│   └── design-tokens.d.ts        # TypeScript types
└── utils/
    └── validate-tokens.js        # Token validation script

design-specs/                     # Source of truth
├── figma-link.md
├── design-tokens.json            # Exported from Figma
├── component-specs/
│   ├── metric-card-spec.md
│   └── button-spec.md
└── screenshots/
    ├── metric-card-idle.png
    └── button-states.png

documentation/
└── FIGMA_TO_CODE_WORKFLOWS.md   # This file
```

---

## Quick Reference Commands

### Generate Design Tokens
```bash
# In Claude Code chat:
Please convert design-tokens.json to CSS custom properties and JS constants.
Follow corporate naming conventions (--kebab-case for CSS, camelCase for JS).
```

### Generate Component from Spec
```bash
# In Claude Code chat:
Generate React component from this specification.
Use BEM CSS, design tokens, and include tests.
[Attach: component-spec.md]
```

### Generate Component from Screenshot
```bash
# In Claude Code chat:
Generate React component matching this screenshot exactly.
[Attach: screenshot.png]
```

### Review Component
```bash
# In Claude Code chat:
/developer-council quick review src/components/MetricCard/
Focus: Accessibility and performance
```

### Compare to Figma
```bash
# In Claude Code chat:
Compare the rendered component to Figma and list any differences.
[Attach: figma-screenshot.png]
[Attach: rendered-screenshot.png]
```

---

## Next Steps

1. ✅ Read this workflow guide
2. [ ] Export design tokens from your Figma file
3. [ ] Generate CSS and JS constants using Claude Code
4. [ ] Create specifications for 2-3 key components
5. [ ] Generate those components using Claude Code
6. [ ] Review with /developer-council
7. [ ] Refine based on feedback
8. [ ] Integrate into your project

---

**Document Created:** 2026-03-25
**Version:** 1.0
**Related Docs:**
- [Integration Plan](./CLAUDE_CODE_INTEGRATION_PLAN.md)
- [Session Inputs Guide](./DEVELOPER_COUNCIL_SESSION_INPUTS.md)
- [Integration Roadmap](./INTEGRATION_ROADMAP.md)
