# Documentation Index
## Claude Code Integration for UIUX-to-Production Workflow

**Last Updated:** 2026-03-25
**Status:** Ready for Implementation

---

## ⚡ Quick Decision: Which Workflow Should I Use?

### 🚀 **Git-Versioned Figma Workflow** (RECOMMENDED)

**Use this if you have:**
- ✅ 5+ components to build
- ✅ Frequent design updates expected
- ✅ Multiple developers on the team
- ✅ Need for CI/CD integration
- ✅ Building a design system

**Time investment:** 2-4 hours setup, then fully automated
**Read:** [GIT_VERSIONED_FIGMA_WORKFLOW.md](./GIT_VERSIONED_FIGMA_WORKFLOW.md) ⭐

---

### 📋 Manual Figma Workflow (Simple Projects)

**Use this if you have:**
- ✅ 1-3 components only
- ✅ One-off prototype
- ✅ Solo developer
- ✅ Designs are frozen (no updates)

**Time investment:** 5 minutes per component
**Read:** [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md)

---

## 📚 Documentation Structure

This directory contains comprehensive guides for integrating Claude Code into your corporate development workflow.

```
documentation/
├── README.md                              ← YOU ARE HERE (start here!)
├── GIT_VERSIONED_FIGMA_WORKFLOW.md        ← ⭐ RECOMMENDED: Automated workflow
├── INTEGRATION_ROADMAP.md                 ← Quick start: 4-week plan
├── CLAUDE_CODE_INTEGRATION_PLAN.md        ← Full strategy (50+ pages)
├── DEVELOPER_COUNCIL_SESSION_INPUTS.md    ← Preparation checklist
├── FIGMA_TO_CODE_WORKFLOWS.md             ← Manual workflows (simple projects)
├── ENHANCED_FIGMA_SESSION_EXAMPLE.md      ← Real Figma session with screenshots
├── EXAMPLE_SESSION_TRANSCRIPT.md          ← Text-based session example
└── ai/
    └── cloudflare-sdk-sequence-diagram.puml ← Technical reference

project-root/
├── INTEGRATION_ROADMAP.md                 ← Symlink to docs
├── CLAUDE_CODE_INTEGRATION_PLAN.md        ← Symlink to docs
└── DEVELOPER_COUNCIL_SESSION_INPUTS.md    ← Symlink to docs
```

---

## 🎯 Start Here: Choose Your Path

### Path 0: "Which workflow should I use?" ⭐ START HERE
**Decision Matrix:** See [Which Workflow When?](#-which-workflow-when) below
- **Time:** 2 minutes
- **What you'll learn:** Git-versioned vs. Manual workflow decision
- **Next step:** Choose Path 1 (Git-versioned) or Path 3 (Manual)

### Path 1: "I want Git-versioned Figma workflow" 🚀 RECOMMENDED
**Read this:** [GIT_VERSIONED_FIGMA_WORKFLOW.md](./GIT_VERSIONED_FIGMA_WORKFLOW.md)
- **Time:** 30 minutes
- **What you'll learn:** Automated, version-controlled Figma-to-Code pipeline
- **Next step:** Set up figma-assets/ repository structure
- **Best for:** Teams with 5+ components, design systems, frequent updates

### Path 2: "I want to understand the big picture"
**Read this:** [INTEGRATION_ROADMAP.md](../INTEGRATION_ROADMAP.md)
- **Time:** 15 minutes
- **What you'll learn:** Overall integration strategy, 4-week timeline
- **Next step:** Review the full integration plan
- **Best for:** Project managers, team leads

### Path 3: "I want manual Figma-to-code workflow"
**Read this:** [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md)
- **Time:** 20 minutes
- **What you'll learn:** 5 manual workflows (one component at a time)
- **Next step:** Try the enhanced Figma example
- **Best for:** Small projects (1-3 components), solo developers

### Path 4: "I want to see a real Figma example"
**Read this:** [ENHANCED_FIGMA_SESSION_EXAMPLE.md](./ENHANCED_FIGMA_SESSION_EXAMPLE.md)
- **Time:** 15 minutes
- **What you'll learn:** Real session with Figma screenshots as input
- **Next step:** Try generating your own component
- **Best for:** Visual learners, understanding Figma handoff

### Path 5: "I need to prepare for a DeveloperCouncil session"
**Read this:** [DEVELOPER_COUNCIL_SESSION_INPUTS.md](../DEVELOPER_COUNCIL_SESSION_INPUTS.md)
- **Time:** 30 minutes
- **What you'll learn:** Exact artifacts needed, preparation checklist
- **Next step:** Start preparing input packages
- **Best for:** All team members preparing for council session

### Path 6: "I need the complete reference"
**Read this:** [CLAUDE_CODE_INTEGRATION_PLAN.md](../CLAUDE_CODE_INTEGRATION_PLAN.md)
- **Time:** 90 minutes
- **What you'll learn:** Everything - strategy, templates, examples
- **Next step:** Start executing the plan
- **Best for:** Technical leads, architects

---

## 📖 Document Quick Reference

### GIT_VERSIONED_FIGMA_WORKFLOW.md ⭐ NEW
**Purpose:** Automated Figma-to-Code workflow with Git version control

**Key Sections:**
- Repository structure for figma-assets/
- Automated design token generation
- Batch component generation (all at once)
- CI/CD integration and design drift detection
- Figma API automation (optional)

**Key Workflows:**
1. Initial design token generation from Git
2. Batch component generation (all components)
3. Design change detection & regeneration
4. Automated design validation in CI/CD
5. DeveloperCouncil batch review

**Benefits:**
- ✅ 70-80% time savings on design updates
- ✅ Prevents design drift (automated validation)
- ✅ Batch processing (all components at once)
- ✅ Full version control and traceability
- ✅ CI/CD integration

**Best for:** Teams with 5+ components, design systems, frequent updates

---

### INTEGRATION_ROADMAP.md
**Purpose:** Quick-start guide for the 4-week integration process

**Key Sections:**
- Week-by-week action plan
- Team effort breakdown
- Critical success factors
- Pre-session checklist

**Best for:** Project managers, team leads

---

### CLAUDE_CODE_INTEGRATION_PLAN.md
**Purpose:** Complete integration strategy (comprehensive reference)

**Key Sections:**
1. Current State Analysis
2. Corporate Workflow Overview
3. Integration Strategy
4. Pre-DeveloperCouncil Preparation
5. DeveloperCouncil Session Inputs
6. Post-Council Implementation Workflow
7. Success Criteria

**Appendices:**
- Design token examples
- Component specification templates
- Gap analysis templates

**Best for:** Technical leads, architects

---

### DEVELOPER_COUNCIL_SESSION_INPUTS.md
**Purpose:** Preparation checklist for DeveloperCouncil sessions

**Key Sections:**
1. Design Specifications Package (UIUX team)
2. Prototype Analysis Package (Frontend team)
3. Target Environment Package (DevOps team)
4. Business Requirements Package (Product team)
5. Session Brief (Technical lead)

**Best for:** All team members preparing for council session

---

### FIGMA_TO_CODE_WORKFLOWS.md
**Purpose:** Manual workflows for transforming designs into code (one component at a time)

**Workflows:**
1. Design Token Extraction
2. Component Generation from Specs
3. Screenshot-to-Component
4. Iterative Refinement
5. DeveloperCouncil Integration

**Best for:** Small projects (1-3 components), solo developers

**Note:** For teams with 5+ components, see [GIT_VERSIONED_FIGMA_WORKFLOW.md](./GIT_VERSIONED_FIGMA_WORKFLOW.md) instead

---

### ENHANCED_FIGMA_SESSION_EXAMPLE.md
**Purpose:** Real Figma-to-Code session with actual Figma assets

**Content:**
- Designer handoff with Figma exports
- design-tokens.json from Figma plugin
- Component screenshots (3 states)
- Complete session transcript (6 rounds)
- Generated component code (React + CSS + Tests + Storybook)
- Design validation (screenshot comparison)
- DeveloperCouncil feedback
- Time savings: 5.5 hours → 45 minutes (92%)

**Best for:** Understanding real Figma workflows, visual learners

---

### EXAMPLE_SESSION_TRANSCRIPT.md
**Purpose:** Text-based example showing exact prompts and responses

**Content:**
- Complete session transcript (4 rounds)
- Generated component code (React + CSS + Tests)
- DeveloperCouncil feedback
- Accessibility fixes
- Time savings comparison

**Best for:** Quick reference for prompts, beginners

**Note:** See ENHANCED_FIGMA_SESSION_EXAMPLE.md for a more realistic workflow with actual Figma assets

---

## 🚀 Quick Start Guide

### For Project Managers

**Day 1:**
1. ✅ Read [INTEGRATION_ROADMAP.md](../INTEGRATION_ROADMAP.md) (15 min)
2. ✅ Review Week 1 actions (5 min)
3. ✅ Schedule kickoff meeting with team (30 min)
4. ✅ Assign preparation owners

**Week 1:**
- Set up shared repository for input materials
- Schedule DeveloperCouncil session (Week 5)
- Distribute preparation assignments

**Week 2-4:**
- Monitor preparation progress weekly
- Review completed input packages
- Prepare demo environment

---

### For UIUX Designers

**Choose Your Workflow:**
- **5+ components?** → Use [Git-Versioned Workflow](./GIT_VERSIONED_FIGMA_WORKFLOW.md) (RECOMMENDED)
- **1-3 components?** → Use [Manual Workflow](./FIGMA_TO_CODE_WORKFLOWS.md)

**Git-Versioned Setup (Recommended):**
1. ✅ Set up figma-assets/ repository structure
2. ✅ Export design tokens using Figma plugin → `design-tokens/tokens.json`
3. ✅ Export component screenshots (2x) → `components/*/states/*.png`
4. ✅ Create brief spec.md for each component
5. ✅ Commit and push to Git

**Manual Setup (Simple Projects):**
1. ✅ Read [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md) § Workflow 1
2. ✅ Export design tokens from Figma
3. ✅ Create component specifications
4. ✅ Export visual assets (screenshots, icons)

**Reference:**
- [Git-Versioned Repository Structure](./GIT_VERSIONED_FIGMA_WORKFLOW.md#repository-structure)
- [Design Specifications Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#11-figma-designs)
- [Design Tokens Example](../CLAUDE_CODE_INTEGRATION_PLAN.md#b1-design-tokens-example)
- [Component Specs Example](../CLAUDE_CODE_INTEGRATION_PLAN.md#b2-component-specification-example)

---

### For Frontend Developers

**Choose Your Workflow:**
- **5+ components?** → Use [Git-Versioned Workflow](./GIT_VERSIONED_FIGMA_WORKFLOW.md) ⭐
- **1-3 components?** → Use [Manual Workflow](./FIGMA_TO_CODE_WORKFLOWS.md)

**Git-Versioned Development (Recommended):**
1. ✅ Read [GIT_VERSIONED_FIGMA_WORKFLOW.md](./GIT_VERSIONED_FIGMA_WORKFLOW.md)
2. ✅ Clone/pull figma-assets/ repository
3. ✅ Use Claude Code with entire figma-assets/ context
4. ✅ Batch generate components: `npm run generate-components`
5. ✅ Validate design sync: `npm run validate-design`

**Key Prompts for Git-Versioned:**
```
I have figma-assets/ as the entire context.

Please batch generate ALL components in figma-assets/components/
by reading metadata.json, spec.md, and all screenshots.

Generate to src/components/ using design tokens from
figma-assets/design-tokens/tokens.json
```

**Manual Development (Simple Projects):**
1. ✅ Read [ENHANCED_FIGMA_SESSION_EXAMPLE.md](./ENHANCED_FIGMA_SESSION_EXAMPLE.md)
2. ✅ Generate one component at a time
3. ✅ Use `/developer-council` for reviews

**Analysis & Planning:**
1. ✅ Complete component inventory of prototype
2. ✅ Perform gap analysis (prototype vs. corporate standards)
3. ✅ Audit dependencies

**Reference:**
- [Batch Generation Workflow](./GIT_VERSIONED_FIGMA_WORKFLOW.md#workflow-2-batch-component-generation)
- [Component Inventory Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#21-component-inventory)
- [Gap Analysis Template](../CLAUDE_CODE_INTEGRATION_PLAN.md#b3-gap-analysis-template)

---

### For DevOps/Platform Engineers

**Preparation:**
1. ✅ Document Liferay environment specifications
2. ✅ Gather corporate coding standards
3. ✅ Prepare deployment checklist
4. ✅ Collect portal theme reference materials

**Reference:**
- [Liferay Environment Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#31-liferay-environment-specifications)
- [Corporate Standards Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#32-corporate-coding-standards)

---

### For Product Owners

**Preparation:**
1. ✅ Document feature requirements
2. ✅ Write user stories
3. ✅ Define acceptance criteria
4. ✅ Specify non-functional requirements

**Reference:**
- [Feature Requirements Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#41-feature-requirements)
- [User Stories Template](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#42-user-stories)

---

## 🎓 Learning Path

### Beginner (Never used Claude Code before)

**Day 1: Introduction (2 hours)**
1. Read [INTEGRATION_ROADMAP.md](../INTEGRATION_ROADMAP.md)
2. Read [EXAMPLE_SESSION_TRANSCRIPT.md](./EXAMPLE_SESSION_TRANSCRIPT.md)
3. Try the example prompt at the end

**Day 2: First Component (2 hours)**
1. Read [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md) § Workflow 2
2. Generate a simple component (Button or Card)
3. Review with `/developer-council quick review`

**Day 3: Refinement (2 hours)**
1. Read [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md) § Workflow 4
2. Iterate on your component
3. Fix accessibility issues

**Day 4: Practice (2 hours)**
1. Generate 2-3 more components
2. Get comfortable with the workflow
3. Document your learnings

**Week 2: Ready for Real Work**
- Apply to actual project components
- Participate in DeveloperCouncil session preparation

---

### Intermediate (Some experience with AI coding tools)

**Day 1: Strategy (1 hour)**
1. Skim [CLAUDE_CODE_INTEGRATION_PLAN.md](../CLAUDE_CODE_INTEGRATION_PLAN.md) (focus on Sections 1-3)
2. Understand how this fits into your workflow

**Day 2: Workflows (2 hours)**
1. Read [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md) (all workflows)
2. Try workflows 1-3
3. Practice with your actual Figma designs

**Day 3: Advanced Techniques (2 hours)**
1. Read [FIGMA_TO_CODE_WORKFLOWS.md](./FIGMA_TO_CODE_WORKFLOWS.md) § Workflow 5
2. Practice DeveloperCouncil integration
3. Learn when to ask for reviews

**Week 2: Lead the Effort**
- Help team members onboard
- Review generated code
- Contribute to input package preparation

---

### Advanced (Ready to lead integration)

**Day 1: Full Picture (3 hours)**
1. Read [CLAUDE_CODE_INTEGRATION_PLAN.md](../CLAUDE_CODE_INTEGRATION_PLAN.md) (complete)
2. Understand all integration points
3. Identify potential challenges for your organization

**Day 2: Preparation Planning (2 hours)**
1. Read [DEVELOPER_COUNCIL_SESSION_INPUTS.md](../DEVELOPER_COUNCIL_SESSION_INPUTS.md)
2. Create preparation plan for your team
3. Identify resource needs

**Day 3: Execution (ongoing)**
1. Lead DeveloperCouncil session preparation
2. Facilitate the council session
3. Drive post-session implementation

---

## 📊 Integration Timeline

```
Week 1: Planning
├── Day 1-2: Team kickoff, assign owners
├── Day 3-4: Set up infrastructure (repos, tools)
└── Day 5: Preparation begins

Week 2: Design & Requirements
├── UIUX: Figma designs + design tokens
├── Product: Feature requirements + user stories
└── Review checkpoint (Friday)

Week 3: Technical Analysis
├── Frontend: Component inventory + gap analysis
├── DevOps: Liferay specs + deployment checklist
└── Review checkpoint (Friday)

Week 4: Session Preparation
├── Tech Lead: Complete session brief
├── All: Review input packages
├── Council: Prep time (2-3 hours each)
└── Final review (Thursday)

Week 5: DeveloperCouncil Session
├── Session Day: 2-hour council meeting
├── Post-session: Capture outputs (ADR, roadmap)
└── Create implementation backlog

Weeks 6-15: Implementation
├── Phase 1: Foundation (3 weeks)
├── Phase 2: Core features (4 weeks)
├── Phase 3: Quality & integration (3 weeks)
└── Phase 4: Deployment (1 week)
```

---

## ✅ Checklists

### Pre-DeveloperCouncil Session Checklist

**1 Week Before:**
- [ ] All input packages complete (5 packages)
- [ ] Figma designs accessible to all council specialists
- [ ] Input repository set up and populated
- [ ] README.md index created
- [ ] Prototype demo environment ready
- [ ] Council specialists confirmed attendance
- [ ] Prep time allocated (2-3 hours per specialist)

**1 Day Before:**
- [ ] Session brief reviewed with facilitator
- [ ] Demo script prepared
- [ ] Note-taker assigned
- [ ] Recording setup tested (if applicable)
- [ ] Whiteboard/Miro ready
- [ ] All materials distributed

**Day Of:**
- [ ] Join 10 minutes early
- [ ] Test screen sharing
- [ ] Have prototype running
- [ ] Capture template ready
- [ ] Questions list prepared

---

### Post-Session Checklist

**Week 1 After Session:**
- [ ] Architecture Decision Record (ADR) published
- [ ] Implementation tasks created in backlog
- [ ] Risk register documented
- [ ] Effort estimates refined

**Week 2 After Session:**
- [ ] Technical spike: Framework POC complete
- [ ] Design system integration POC complete
- [ ] Cloudflare SDK bundling validated

**Week 3 After Session:**
- [ ] Phase 1 development kickoff
- [ ] Team onboarded to chosen approach
- [ ] First components in review

---

## 🔀 Which Workflow When?

### Decision Matrix

| Criteria | Git-Versioned Workflow | Manual Workflow |
|----------|----------------------|-----------------|
| **Number of components** | 5+ components | 1-3 components |
| **Design updates** | Frequent updates | Frozen/rare updates |
| **Team size** | Multiple developers | Solo developer |
| **Project type** | Design system, production app | Prototype, POC |
| **CI/CD needed** | Yes | No |
| **Time investment** | 2-4 hours setup, then automated | 5 min per component |
| **Time savings** | 70-80% on updates | 90% on first generation |
| **Version control** | Full Git history | Manual tracking |
| **Design drift detection** | Automated (fails CI) | Manual comparison |
| **Batch processing** | Yes (all at once) | No (one at a time) |

### Workflow Comparison

#### Git-Versioned Workflow

**Pros:**
- ✅ Batch processing (generate all components at once)
- ✅ Automated design drift detection (CI fails if out of sync)
- ✅ Full version control for design assets
- ✅ Traceability (design version ↔ code version)
- ✅ CI/CD integration
- ✅ Massive time savings on design updates (70-80%)
- ✅ Design change detection (`git diff figma-assets/`)
- ✅ Team collaboration via Git (PRs, reviews)

**Cons:**
- ❌ Initial setup required (2-4 hours)
- ❌ Learning curve for repository structure
- ❌ Overkill for 1-2 components

**Best For:**
- Teams building 5+ components
- Design systems
- Production applications
- Frequent design iterations
- Multiple developers
- **Your speedtest project** (13 components to migrate)

---

#### Manual Workflow

**Pros:**
- ✅ No setup required (start immediately)
- ✅ Simple to understand
- ✅ Good for learning
- ✅ Flexible (one-off components)

**Cons:**
- ❌ One component at a time
- ❌ No version control for designs
- ❌ No automated design drift detection
- ❌ Manual tracking of design versions
- ❌ Tedious for 5+ components
- ❌ No CI/CD integration

**Best For:**
- Solo developers
- 1-3 component projects
- Quick prototypes
- Learning Claude Code
- One-off components

---

### Recommendation for This Project

**Your Project:** Cloudflare Speedtest (13 Vue components)

**Recommended Workflow:** 🚀 **Git-Versioned** (strongly recommended)

**Reasoning:**
- ✅ 13 components to migrate (well above 5 threshold)
- ✅ Ongoing design work expected
- ✅ Corporate production deployment target (Liferay)
- ✅ Design system integration planned
- ✅ Multiple phases of development (design will evolve)

**Next Steps:**
1. Set up `figma-assets/` repository structure (30 min)
2. Export initial Figma assets (design tokens, screenshots) (1 hour)
3. Batch generate all 13 components with Claude Code (1 hour)
4. Set up CI/CD validation (optional, 30 min)

**Total Investment:** 2.5-3 hours
**Payoff:** 70-80% time savings on every design update thereafter

---

## 🆘 Troubleshooting

### "I don't know where to start"
→ Read [INTEGRATION_ROADMAP.md](../INTEGRATION_ROADMAP.md) - it's a 15-minute overview with clear next steps

### "I need to prepare for the council session but don't know what to create"
→ Read [DEVELOPER_COUNCIL_SESSION_INPUTS.md](../DEVELOPER_COUNCIL_SESSION_INPUTS.md) - it has templates and checklists for all 5 input packages

### "I want to try generating a component but don't know the prompts"
→ Read [EXAMPLE_SESSION_TRANSCRIPT.md](./EXAMPLE_SESSION_TRANSCRIPT.md) - it shows exact prompts and responses

### "Claude Code generated code but it doesn't match our standards"
→ Use `/developer-council quick review [file]` - it will identify issues and suggest fixes

### "How do I know if we're ready for the council session?"
→ Check the [Pre-Session Checklist](#pre-developercouncil-session-checklist) - all items must be complete

### "The council session gave us recommendations but now what?"
→ Check [Post-Session Checklist](#post-session-checklist) and [Section 6 of Integration Plan](../CLAUDE_CODE_INTEGRATION_PLAN.md#6-post-council-implementation-workflow)

---

## 📞 Getting Help

### For General Questions
- Review the [Troubleshooting](#troubleshooting) section above
- Search the documentation for keywords
- Ask Claude Code: "I read [document name] but I'm confused about [topic]"

### For Preparation Questions
- **UIUX:** See [Design Specifications](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#1-design-specifications-package)
- **Frontend:** See [Prototype Analysis](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#2-prototype-analysis-package)
- **DevOps:** See [Target Environment](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#3-target-environment-package)
- **Product:** See [Business Requirements](../DEVELOPER_COUNCIL_SESSION_INPUTS.md#4-business-requirements-package)

### For Technical Questions
- Use `/developer-council` in Claude Code for specific reviews
- Reference the [Technical Architecture](ai/cloudflare-sdk-sequence-diagram.puml)

---

## 🎉 Success Stories

### Expected Benefits

After successful integration, you should see:

**Development Velocity:**
- ✅ 30% faster component development
- ✅ 50% reduction in boilerplate code
- ✅ 40% faster design-to-code handoff

**Code Quality:**
- ✅ Consistent use of design tokens
- ✅ Better accessibility compliance (WCAG 2.1 AA)
- ✅ Higher test coverage (>80%)
- ✅ Fewer design-implementation inconsistencies

**Team Productivity:**
- ✅ Designers spend less time on redlines
- ✅ Developers spend more time on business logic
- ✅ QA finds fewer visual bugs
- ✅ Faster iteration cycles

**Business Outcomes:**
- ✅ Faster time to market
- ✅ Better design consistency
- ✅ Lower maintenance costs
- ✅ Higher user satisfaction

---

## 📝 Document Maintenance

### When to Update This Documentation

**Quarterly:**
- Review success metrics
- Update best practices based on learnings
- Add new workflow examples

**After Major Changes:**
- Liferay version upgrade
- Corporate standards update
- Design system changes
- Process improvements

### Contributing

If you find issues or have improvements:

1. Document the issue/improvement
2. Update the relevant section
3. Update the "Last Updated" date
4. Notify the team of changes

---

## 🔗 Related Resources

### Internal
- **Current Prototype:** `C:\Projects\cloudflare-speedtest\src\`
- **Design Tokens:** To be created from Figma
- **Corporate Standards:** [To be added by DevOps team]
- **Liferay Docs:** [To be added by Platform team]

### External
- **Claude Code:** https://claude.ai/code
- **DeveloperCouncil Skill:** `C:\Users\tomas\.claude\skills\DeveloperCouncil\`
- **Figma:** [Your organization's Figma workspace]
- **Cloudflare SDK:** https://github.com/cloudflare/speedtest

---

## 📅 Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.1 | 2026-03-25 | Added Git-Versioned Figma Workflow as recommended default | Claude Code |
| 1.0 | 2026-03-25 | Initial documentation created | Claude Code |
| - | - | Future updates will be tracked here | - |

---

## 🎯 Quick Start Recommendations

### For Your Speedtest Project (13 Components)

**Recommended:** 🚀 [Git-Versioned Figma Workflow](./GIT_VERSIONED_FIGMA_WORKFLOW.md)

**Quick Start (3 hours total):**

1. **Set up figma-assets/ repository** (30 min)
   ```bash
   mkdir -p figma-assets/{design-tokens,components,icons}
   cd figma-assets
   git init
   ```

2. **Export Figma assets** (1 hour)
   - Use "Design Tokens" Figma plugin → `design-tokens/tokens.json`
   - Export component screenshots (2x) → `components/*/states/*.png`
   - Create brief `spec.md` for each component

3. **Batch generate with Claude Code** (1 hour)
   ```
   I have figma-assets/ with 13 components as Git context.

   Please batch generate ALL React components by reading:
   - figma-assets/design-tokens/tokens.json
   - figma-assets/components/*/metadata.json
   - figma-assets/components/*/spec.md
   - figma-assets/components/*/states/*.png

   Generate to src/components/ with:
   - BEM CSS naming
   - Design token usage
   - WCAG 2.1 AA accessibility
   - Unit tests
   ```

4. **(Optional) Set up CI/CD validation** (30 min)
   - Prevents shipping code that doesn't match designs
   - See [Automation & CI/CD](./GIT_VERSIONED_FIGMA_WORKFLOW.md#automation--cicd)

**Payoff:** 70-80% time savings on every design update

---

**Ready to get started?**

1. ✅ Choose your [workflow](#-which-workflow-when) (Git-versioned recommended for 5+ components)
2. ✅ Read the recommended document
3. ✅ Follow the quick start guide above
4. ✅ Schedule your team kickoff meeting (if using DeveloperCouncil)

**Questions?** Start with the [Troubleshooting](#troubleshooting) section or [Decision Matrix](#-which-workflow-when).

**Good luck!** 🚀
