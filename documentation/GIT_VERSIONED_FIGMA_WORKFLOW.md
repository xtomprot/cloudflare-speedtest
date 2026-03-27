# Git-Versioned Figma Assets Workflow
## Automated Design-to-Code with Version Control

**Purpose:** Treat Figma design assets like code - version controlled, automated, and integrated into CI/CD pipelines.

**Key Principle:** Figma assets (tokens, screenshots, specs) are stored in a Git repository and serve as the single source of truth for component generation.

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Setup](#setup)
4. [Core Workflows](#core-workflows)
5. [Automation & CI/CD](#automation--cicd)
6. [DeveloperCouncil Integration](#developercouncil-integration)
7. [Best Practices](#best-practices)

---

## Overview

### Traditional Approach (Manual)

```
Designer → Figma → Manual Export → Email/Slack → Developer
→ Manual Attachment to Claude → Generate One Component
```

**Problems:**
- ❌ Manual, error-prone process
- ❌ No version tracking
- ❌ One component at a time
- ❌ No automated validation
- ❌ Design drift undetected

### Git-Versioned Approach (Automated)

```
Designer → Figma → Automated Export → Git Commit → Claude Code
→ Batch Generate ALL Components → Automated Validation → CI/CD
```

**Benefits:**
- ✅ Fully automated pipeline
- ✅ Version control for design assets
- ✅ Batch component generation
- ✅ Automated design drift detection
- ✅ Traceability (design version ↔ code version)
- ✅ CI/CD integration

---

## Repository Structure

### Recommended Monorepo Structure

```
project-root/
├── .git/
├── figma-assets/ (Design asset repository - SSOT for designs)
│   ├── .figma-sync.json (Tracks Figma file version & sync state)
│   ├── README.md (How to update assets)
│   │
│   ├── design-tokens/
│   │   ├── tokens.json (Exported via Figma API/plugin)
│   │   ├── tokens.yaml (Alternative format)
│   │   ├── colors.md (Human-readable reference)
│   │   ├── typography.md (Human-readable reference)
│   │   └── CHANGELOG.md (Design system changes log)
│   │
│   ├── components/
│   │   ├── MetricCard/
│   │   │   ├── metadata.json (Component metadata)
│   │   │   ├── spec.md (Brief component spec)
│   │   │   ├── figma-link.txt (Link to Figma frame)
│   │   │   ├── states/
│   │   │   │   ├── idle.png (2x resolution)
│   │   │   │   ├── active.png
│   │   │   │   ├── complete.png
│   │   │   │   └── error.png
│   │   │   ├── responsive/
│   │   │   │   ├── mobile.png
│   │   │   │   ├── tablet.png
│   │   │   │   └── desktop.png
│   │   │   └── interactions/
│   │   │       ├── hover.png
│   │   │       └── focus.png
│   │   │
│   │   ├── Button/
│   │   │   ├── metadata.json
│   │   │   ├── spec.md
│   │   │   └── states/
│   │   │       ├── default.png
│   │   │       ├── hover.png
│   │   │       ├── active.png
│   │   │       └── disabled.png
│   │   └── ...
│   │
│   ├── icons/
│   │   ├── icon-download.svg
│   │   ├── icon-upload.svg
│   │   └── ...
│   │
│   ├── illustrations/
│   │   └── ...
│   │
│   └── templates/
│       ├── component-template/ (Template for new components)
│       │   ├── metadata.json.template
│       │   └── spec.md.template
│       └── README.md
│
├── src/
│   ├── components/ (Generated from figma-assets/components/)
│   │   ├── MetricCard/
│   │   │   ├── MetricCard.jsx (Generated)
│   │   │   ├── MetricCard.css (Generated)
│   │   │   ├── MetricCard.test.jsx (Generated)
│   │   │   ├── index.js
│   │   │   └── .figma-version (Tracks source design version)
│   │   └── ...
│   │
│   ├── constants/
│   │   ├── design-tokens.js (Generated from figma-assets/design-tokens/)
│   │   └── .design-tokens-version (Tracks source version)
│   │
│   └── styles/
│       ├── design-tokens.css (Generated from figma-assets/design-tokens/)
│       └── .design-tokens-version
│
├── scripts/
│   ├── sync-figma-assets.js (Figma API integration)
│   ├── generate-components.js (Batch component generation)
│   ├── validate-design-sync.js (CI/CD validation)
│   └── update-design-tokens.js (Token generation)
│
└── .github/
    └── workflows/
        ├── figma-sync.yml (Auto-sync on Figma changes)
        └── validate-design.yml (Validate design-code sync)
```

### Alternative: Git Submodule Approach

```
project-root/
├── .git/
├── figma-assets/ (Git submodule → separate repo)
│   └── (same structure as above)
└── src/
    └── ...
```

**When to use submodule:**
- Multiple projects share same design system
- Design team manages assets independently
- Strict separation of design/code repositories

---

## Setup

### Step 1: Initialize Figma Assets Repository

```bash
# Create figma-assets directory
mkdir figma-assets
cd figma-assets
git init

# Create directory structure
mkdir -p design-tokens components icons illustrations templates

# Create metadata file
cat > .figma-sync.json << 'EOF'
{
  "figmaFileId": "abc123xyz",
  "lastSyncVersion": "0",
  "lastSyncDate": null,
  "components": []
}
EOF

# Create README
cat > README.md << 'EOF'
# Figma Assets Repository

This repository contains version-controlled design assets exported from Figma.

## Updating Assets

### Option 1: Manual Export (Quick)
1. Export design tokens from Figma (Design Tokens plugin)
2. Export component screenshots (2x resolution PNG)
3. Update corresponding directories
4. Commit and push

### Option 2: Automated Sync (Recommended)
1. Run: `npm run sync-figma`
2. Review changes: `git diff`
3. Commit and push

## Structure
- `design-tokens/` - Color palettes, typography, spacing
- `components/` - Component screenshots and specs
- `icons/` - SVG icon exports
- `illustrations/` - Illustration assets
EOF

# Initial commit
git add .
git commit -m "feat: initialize figma-assets repository"
```

### Step 2: Create Component Template

```bash
# Create template structure
mkdir -p templates/component-template/states

cat > templates/component-template/metadata.json.template << 'EOF'
{
  "componentName": "ComponentName",
  "figmaNodeId": "node-id-from-figma",
  "figmaLink": "https://figma.com/file/...",
  "createdDate": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "version": "1.0.0",
  "states": ["default", "hover", "active", "disabled"],
  "responsive": ["mobile", "tablet", "desktop"],
  "framework": "React",
  "status": "ready-for-development"
}
EOF

cat > templates/component-template/spec.md.template << 'EOF'
# ComponentName

## Purpose
Brief description of what this component does.

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description |

## States
- default: Description
- hover: Description
- active: Description
- disabled: Description

## Accessibility
- ARIA attributes required
- Keyboard interactions
- Screen reader behavior

## Figma Link
[View in Figma](https://figma.com/file/...)
EOF
```

### Step 3: Add Design Tokens

```bash
cd figma-assets/design-tokens

# Export from Figma (using Design Tokens plugin) and save as tokens.json
# Or use Figma API (see automation section)

# Example tokens.json structure
cat > tokens.json << 'EOF'
{
  "$schema": "https://design-tokens.org/schema.json",
  "colors": {
    "brand": {
      "primary": { "value": "#0066CC", "type": "color" },
      "secondary": { "value": "#6B7280", "type": "color" }
    },
    "status": {
      "success": { "value": "#10B981", "type": "color" },
      "warning": { "value": "#F59E0B", "type": "color" },
      "error": { "value": "#EF4444", "type": "color" }
    }
  },
  "spacing": {
    "xs": { "value": "4px", "type": "dimension" },
    "sm": { "value": "8px", "type": "dimension" },
    "md": { "value": "16px", "type": "dimension" },
    "lg": { "value": "24px", "type": "dimension" }
  }
}
EOF

# Commit
git add .
git commit -m "feat: add initial design tokens"
```

### Step 4: Add First Component

```bash
cd figma-assets/components
mkdir -p MetricCard/states

# Copy template
cp ../templates/component-template/metadata.json.template MetricCard/metadata.json
cp ../templates/component-template/spec.md.template MetricCard/spec.md

# Edit metadata.json (update componentName, figmaLink, etc.)
# Export screenshots from Figma and save to MetricCard/states/

# Commit
git add .
git commit -m "feat: add MetricCard component assets"
```

---

## Core Workflows

### Workflow 1: Initial Design Token Generation

**Context:** You have `figma-assets/` as the entire context in your Claude Code session.

**Prompt to Claude Code:**

```
I have a Git repository of Figma assets at figma-assets/.

Please read figma-assets/design-tokens/tokens.json and generate:

1. src/styles/design-tokens.css (CSS custom properties)
2. src/constants/design-tokens.js (JavaScript constants)
3. src/styles/.design-tokens-version (track source version)

Also create a git commit hash reference so we know which design
token version generated this code.

Follow corporate naming conventions:
- CSS: --color-brand-primary (kebab-case)
- JS: colorBrandPrimary (camelCase)
```

**Expected Output:**

Claude Code will:
1. Read `figma-assets/design-tokens/tokens.json`
2. Generate CSS and JS files
3. Create version tracking file
4. Provide git commands to track relationship

```bash
# Claude suggests tracking command
git log -1 --format="%H" figma-assets/design-tokens/tokens.json > src/styles/.design-tokens-version
```

---

### Workflow 2: Batch Component Generation

**Prompt to Claude Code:**

```
I have Figma component assets in figma-assets/components/.

Please analyze ALL components in this directory and:

1. For each component folder:
   - Read metadata.json
   - Read spec.md
   - Read all screenshots in states/

2. Generate corresponding React components in src/components/:
   - ComponentName.jsx
   - ComponentName.css (BEM naming)
   - ComponentName.test.jsx
   - index.js
   - .figma-version (track source version)

3. Use design tokens from src/constants/design-tokens.js

4. Create a manifest file: src/components/.generation-manifest.json
   tracking which Figma version generated each component

Start with these components:
- MetricCard
- Button
- QualityBadge

After generating, I'll review and you can continue with remaining components.
```

**Expected Output:**

Claude Code will:
1. Read all component assets
2. Generate components in batch
3. Create version tracking
4. Provide manifest for traceability

```json
// src/components/.generation-manifest.json
{
  "generatedDate": "2026-03-25T10:30:00Z",
  "figmaAssetsCommit": "abc123def456",
  "designTokensVersion": "xyz789",
  "components": [
    {
      "name": "MetricCard",
      "figmaVersion": "1.0.0",
      "figmaCommit": "abc123",
      "generatedFiles": [
        "MetricCard.jsx",
        "MetricCard.css",
        "MetricCard.test.jsx"
      ],
      "status": "generated"
    }
  ]
}
```

---

### Workflow 3: Design Change Detection & Regeneration

**When Figma assets are updated (new commit in figma-assets/):**

**Prompt to Claude Code:**

```
Figma assets have been updated. Please:

1. Compare figma-assets/ current state to the version recorded in
   src/components/.generation-manifest.json

2. Identify which components have changed:
   - New screenshots added
   - metadata.json updated
   - spec.md modified
   - design tokens changed

3. List components that need regeneration

4. For each changed component:
   - Regenerate React component
   - Update tests if props changed
   - Update .figma-version
   - Update .generation-manifest.json

Show me the diff before regenerating so I can review.
```

**Expected Output:**

```
Analyzing design changes...

Changed Components:
1. MetricCard
   - New state: error.png (added)
   - spec.md updated (new prop: showError)
   - Requires regeneration

2. Button
   - No changes detected
   - Skip regeneration

3. Design Tokens
   - colors.status.info added (#3B82F6)
   - Requires CSS/JS regeneration

Proceed with regeneration? [Y/n]
```

---

### Workflow 4: Automated Design Validation

**CI/CD Integration - Validate design-code sync:**

**Script: `scripts/validate-design-sync.js`**

```javascript
#!/usr/bin/env node
/**
 * Validate that generated components are in sync with Figma assets
 * Run in CI/CD to prevent design drift
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function validateDesignSync() {
  console.log('🔍 Validating design-code synchronization...\n');

  const manifest = JSON.parse(
    fs.readFileSync('src/components/.generation-manifest.json', 'utf8')
  );

  const figmaAssetsCommit = execSync('git log -1 --format="%H" figma-assets/')
    .toString()
    .trim();

  if (manifest.figmaAssetsCommit !== figmaAssetsCommit) {
    console.error('❌ DESIGN DRIFT DETECTED!');
    console.error(`
Design assets have been updated but components were not regenerated.

Expected Figma commit: ${manifest.figmaAssetsCommit}
Actual Figma commit:   ${figmaAssetsCommit}

Please regenerate components:
  npm run generate-components

Or if intentional, update the manifest.
    `);
    process.exit(1);
  }

  console.log('✅ Design-code synchronization validated!');
  console.log(`Figma assets version: ${figmaAssetsCommit.substring(0, 7)}`);
}

validateDesignSync();
```

**package.json:**

```json
{
  "scripts": {
    "validate-design": "node scripts/validate-design-sync.js",
    "generate-components": "node scripts/generate-components.js",
    "sync-figma": "node scripts/sync-figma-assets.js"
  }
}
```

**GitHub Actions: `.github/workflows/validate-design.yml`**

```yaml
name: Validate Design Sync

on:
  pull_request:
    paths:
      - 'figma-assets/**'
      - 'src/components/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Need full history for git log

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Validate design-code sync
        run: npm run validate-design

      - name: Check for design changes without code updates
        run: |
          FIGMA_CHANGED=$(git diff --name-only origin/main...HEAD | grep -c "^figma-assets/" || true)
          CODE_CHANGED=$(git diff --name-only origin/main...HEAD | grep -c "^src/components/" || true)

          if [ "$FIGMA_CHANGED" -gt 0 ] && [ "$CODE_CHANGED" -eq 0 ]; then
            echo "::error::Figma assets changed but components not updated"
            exit 1
          fi
```

---

### Workflow 5: DeveloperCouncil Batch Review

**Prompt to Claude Code:**

```
/developer-council full council

Review ALL components in figma-assets/components/ and their
corresponding implementations in src/components/.

For each component:
1. Verify implementation matches Figma screenshots
2. Check accessibility (WCAG 2.1 AA)
3. Validate code quality (tests, PropTypes, BEM)
4. Check design token usage (no hardcoded values)

Focus areas:
- Design compliance across all components
- Consistency in implementation patterns
- Accessibility standards
- Code quality and maintainability

Provide:
1. Component-by-component assessment
2. Overall design system health
3. Common issues across components
4. Recommendations for improvement
```

**Expected Output:**

```
Convening full developer council...
Specialists: All 6 (SoftwareDeveloper, QaTester, DatabaseEngineer,
              DevOpsEngineer, DocumentationWriter, SecurityArchitect)

=== DESIGN SYSTEM REVIEW ===

Total Components: 12
Figma Assets Version: abc123def

=== COMPONENT ASSESSMENTS ===

1. MetricCard
   ✓ Design compliance: 100%
   ✓ Accessibility: WCAG 2.1 AA
   ✓ Test coverage: 87%
   ⚠️ Suggestion: Extract ProgressBar as reusable component

2. Button
   ✓ Design compliance: 100%
   ⚠️ Color contrast warning: disabled state (3.8:1)
   ✓ Test coverage: 92%

3. QualityBadge
   ✓ Design compliance: 100%
   ✓ Accessibility: WCAG 2.1 AA
   ⚠️ Missing responsive states

... (continues for all components)

=== OVERALL HEALTH ===

Design Compliance: 98% (excellent)
Accessibility: 95% (2 components need fixes)
Test Coverage: 85% average (target: 80%+)
Code Quality: Good (consistent patterns)

=== COMMON ISSUES ===

1. Three components missing responsive breakpoints (Priority: Medium)
2. Two components have color contrast issues (Priority: High)
3. Progress bar pattern duplicated 3x (consider extraction)

=== RECOMMENDATIONS ===

Priority 1 (Before Production):
- Fix Button disabled state contrast (WCAG violation)
- Fix Badge text contrast on yellow background

Priority 2 (Post-MVP):
- Extract ProgressBar as shared component
- Add responsive states to QualityBadge, Summary, DataDisplay

Priority 3 (Nice to Have):
- Add dark mode variants
- Create Storybook stories for all components
```

---

## Automation & CI/CD

### Automated Figma Sync (Advanced)

**Prerequisites:**
- Figma API access token
- Figma file ID

**Script: `scripts/sync-figma-assets.js`**

```javascript
#!/usr/bin/env node
/**
 * Sync Figma file to local figma-assets/ directory
 * Uses Figma API to export screenshots and styles
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

async function syncFigmaAssets() {
  console.log('🔄 Syncing Figma assets...\n');

  // 1. Fetch file metadata
  const fileResponse = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_ID}`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  const fileData = await fileResponse.json();

  // 2. Find components page
  const componentsPage = fileData.document.children.find(
    page => page.name === 'Components'
  );

  // 3. For each component frame, export screenshots
  for (const frame of componentsPage.children) {
    const componentName = frame.name;
    const componentDir = `figma-assets/components/${componentName}`;

    await fs.mkdir(componentDir, { recursive: true });
    await fs.mkdir(`${componentDir}/states`, { recursive: true });

    // Export screenshots for each state
    const states = frame.children.filter(child => child.type === 'FRAME');
    for (const state of states) {
      const imageUrl = await exportImage(state.id, '2x');
      await downloadImage(
        imageUrl,
        `${componentDir}/states/${state.name}.png`
      );
    }

    // Update metadata
    const metadata = {
      componentName,
      figmaNodeId: frame.id,
      figmaLink: `https://figma.com/file/${FIGMA_FILE_ID}?node-id=${frame.id}`,
      lastUpdated: new Date().toISOString(),
      version: fileData.version,
    };

    await fs.writeFile(
      `${componentDir}/metadata.json`,
      JSON.stringify(metadata, null, 2)
    );
  }

  // 4. Export design tokens (if using Figma Variables API)
  const styles = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_ID}/styles`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  const stylesData = await styles.json();

  // Convert to design tokens format
  const tokens = convertStylesToTokens(stylesData);
  await fs.writeFile(
    'figma-assets/design-tokens/tokens.json',
    JSON.stringify(tokens, null, 2)
  );

  console.log('✅ Figma assets synced successfully!');
}

async function exportImage(nodeId, scale = '2x') {
  const response = await fetch(
    `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${nodeId}&scale=2&format=png`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  const data = await response.json();
  return data.images[nodeId];
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await fs.writeFile(filepath, buffer);
}

function convertStylesToTokens(stylesData) {
  // Convert Figma styles to design tokens format
  // This is simplified - real implementation would be more complex
  return {
    colors: {},
    spacing: {},
    typography: {},
  };
}

syncFigmaAssets().catch(console.error);
```

**GitHub Actions: `.github/workflows/figma-sync.yml`**

```yaml
name: Sync Figma Assets

on:
  schedule:
    - cron: '0 9 * * 1-5'  # Daily at 9 AM on weekdays
  workflow_dispatch:  # Manual trigger
  repository_dispatch:  # Figma webhook trigger
    types: [figma-updated]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Sync Figma assets
        env:
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
          FIGMA_FILE_ID: ${{ secrets.FIGMA_FILE_ID }}
        run: npm run sync-figma

      - name: Check for changes
        id: git-check
        run: |
          git diff --quiet figma-assets/ || echo "changed=true" >> $GITHUB_OUTPUT

      - name: Commit changes
        if: steps.git-check.outputs.changed == 'true'
        run: |
          git config user.name "Figma Sync Bot"
          git config user.email "bot@example.com"
          git add figma-assets/
          git commit -m "chore: sync figma assets [skip ci]"
          git push

      - name: Create PR for component regeneration
        if: steps.git-check.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: Figma assets updated - regenerate components"
          body: |
            Figma assets have been automatically synced.

            Please review the design changes and regenerate affected components:

            ```bash
            npm run generate-components
            ```

            Components that may need updates:
            - [List will be auto-populated]
          branch: figma-sync-${{ github.run_id }}
          labels: design-sync, automated
```

---

### Batch Component Generation Script

**Script: `scripts/generate-components.js`**

```javascript
#!/usr/bin/env node
/**
 * Generate React components from figma-assets/
 * Can be run manually or in CI/CD
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function generateComponents() {
  console.log('🏗️  Generating components from Figma assets...\n');

  const componentsDir = 'figma-assets/components';
  const components = await fs.readdir(componentsDir);

  for (const componentName of components) {
    const componentPath = path.join(componentsDir, componentName);
    const stat = await fs.stat(componentPath);

    if (!stat.isDirectory()) continue;

    console.log(`📦 Processing ${componentName}...`);

    // Check if already generated and up-to-date
    const needsRegeneration = await checkIfNeedsRegeneration(componentName);

    if (!needsRegeneration) {
      console.log(`   ✓ Up-to-date, skipping\n`);
      continue;
    }

    // Generate component using Claude Code
    await generateComponent(componentName);
    console.log(`   ✓ Generated\n`);
  }

  console.log('✅ All components processed!');
}

async function checkIfNeedsRegeneration(componentName) {
  const versionFile = `src/components/${componentName}/.figma-version`;

  try {
    const currentVersion = await fs.readFile(versionFile, 'utf8');
    const latestVersion = execSync(
      `git log -1 --format="%H" figma-assets/components/${componentName}`
    )
      .toString()
      .trim();

    return currentVersion.trim() !== latestVersion;
  } catch (err) {
    // Version file doesn't exist, needs generation
    return true;
  }
}

async function generateComponent(componentName) {
  // This would integrate with Claude Code API or CLI
  // For now, it's a placeholder that would be filled with actual integration

  console.log(`   → Reading metadata...`);
  const metadata = JSON.parse(
    await fs.readFile(
      `figma-assets/components/${componentName}/metadata.json`,
      'utf8'
    )
  );

  console.log(`   → Reading spec...`);
  const spec = await fs.readFile(
    `figma-assets/components/${componentName}/spec.md`,
    'utf8'
  );

  console.log(`   → Reading screenshots...`);
  // Screenshots would be passed to Claude Code

  // TODO: Integrate with Claude Code to generate component
  // For manual workflow: this script would output what to do
  console.log(`
   Manual steps:
   1. Open Claude Code
   2. Load context: figma-assets/components/${componentName}/
   3. Run: Generate React component from Figma assets
  `);

  // Update version file
  const latestVersion = execSync(
    `git log -1 --format="%H" figma-assets/components/${componentName}`
  )
    .toString()
    .trim();

  await fs.mkdir(`src/components/${componentName}`, { recursive: true });
  await fs.writeFile(
    `src/components/${componentName}/.figma-version`,
    latestVersion
  );
}

generateComponents().catch(console.error);
```

---

## DeveloperCouncil Integration

### Batch Review of Design System

**Prompt for Full Design System Review:**

```
/developer-council full council

Context: Git repository of Figma assets at figma-assets/

Please conduct a comprehensive design system review:

1. DESIGN TOKEN ANALYSIS
   - Review figma-assets/design-tokens/tokens.json
   - Check for inconsistencies or missing tokens
   - Validate against generated code in src/

2. COMPONENT INVENTORY
   - List all components in figma-assets/components/
   - Check which are implemented in src/components/
   - Identify missing components

3. DESIGN COMPLIANCE
   - For each implemented component:
     - Compare src/ to figma-assets/ screenshots
     - Verify design token usage
     - Check for hardcoded values

4. CODE QUALITY
   - Test coverage across all components
   - Accessibility compliance (WCAG 2.1 AA)
   - Performance considerations
   - Security review

5. DESIGN SYSTEM HEALTH
   - Pattern consistency across components
   - Reusability opportunities
   - Design debt identification

Provide:
- Executive summary
- Component-by-component assessment
- Critical issues (must fix)
- Recommendations (should fix)
- Nice-to-haves

Generate a report in Markdown format.
```

---

## Best Practices

### 1. Version Control Discipline

**Design Token Changes:**
```bash
# Always document WHY tokens changed
git commit -m "feat(tokens): add info color for new status badges

Adds --color-status-info (#3B82F6) to support new
information-level notifications in MetricCard component.

Design: https://figma.com/file/abc/...?node-id=123
JIRA: DESIGN-456"
```

**Component Changes:**
```bash
git commit -m "feat(MetricCard): add error state

Adds error.png screenshot and updates spec.md to
document error state behavior.

Components affected: src/components/MetricCard/
Regeneration required: Yes

Design: https://figma.com/file/...
```

### 2. Semantic Versioning for Design Assets

**figma-assets/components/MetricCard/metadata.json:**
```json
{
  "version": "1.2.0",
  "changelog": [
    {
      "version": "1.2.0",
      "date": "2026-03-25",
      "changes": ["Added error state", "Updated hover animation"],
      "breaking": false
    },
    {
      "version": "1.1.0",
      "date": "2026-03-20",
      "changes": ["Added responsive mobile variant"],
      "breaking": false
    },
    {
      "version": "1.0.0",
      "date": "2026-03-15",
      "changes": ["Initial component design"],
      "breaking": false
    }
  ]
}
```

### 3. Automated Validation

**Pre-commit Hook:**
```bash
# .git/hooks/pre-commit
#!/bin/bash

# If Figma assets changed, remind to regenerate
FIGMA_CHANGED=$(git diff --cached --name-only | grep -c "^figma-assets/" || true)

if [ "$FIGMA_CHANGED" -gt 0 ]; then
  echo "⚠️  Figma assets changed. Remember to regenerate components:"
  echo "   npm run generate-components"
  echo ""
  echo "Continue anyway? [y/N]"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

### 4. Documentation Generation

**Auto-generate design system documentation:**

```bash
# scripts/generate-docs.js
# Reads figma-assets/ and generates Storybook stories, README files, etc.
```

### 5. Design Token Inheritance

**Support token inheritance/theming:**

```json
{
  "colors": {
    "base": {
      "primary": { "value": "#0066CC" }
    },
    "dark-mode": {
      "primary": { "$ref": "base.primary", "alpha": 0.9 }
    }
  }
}
```

---

## Summary: Key Advantages of Git-Versioned Approach

| Aspect | Manual Approach | Git-Versioned Approach |
|--------|----------------|------------------------|
| **Tracking** | None | Full version history |
| **Automation** | Manual export every time | Automated sync via Figma API |
| **Batch Processing** | One component at a time | All components at once |
| **Change Detection** | Manual comparison | `git diff figma-assets/` |
| **CI/CD Integration** | Not possible | Automated validation in PRs |
| **Design Drift** | Undetected | Fails CI if out of sync |
| **Traceability** | None | Design version ↔ Code version |
| **Collaboration** | Email/Slack chaos | Git PRs, reviews, merges |
| **Rollback** | Can't revert designs | `git revert` design changes |

---

## Next Steps

1. **Set up repository structure** (1 hour)
2. **Export initial Figma assets** (2 hours)
3. **Generate first batch of components** with Claude Code (1 hour)
4. **Set up CI/CD validation** (2 hours)
5. **(Optional) Automate Figma sync** (4-8 hours)

**Total time investment:** 6-14 hours
**Ongoing time savings:** 70-80% on every design update

---

**Document Created:** 2026-03-25
**Version:** 1.0
**Recommended for:** Teams with >5 components, frequent design updates
