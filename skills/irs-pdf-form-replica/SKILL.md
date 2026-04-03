---
name: irs-pdf-form-replica
description: "Reconstruct IRS PDF forms with high visual fidelity for app integration, preserving original layout, typography hierarchy, line structure, spacing, columns, boxes, labels, and printable geometry."
---

# IRS PDF Form Replica

## Overview

This skill is designed to recreate official IRS PDF forms as faithful working UI/document assets for app usage.

Its purpose is **not** to reinterpret, simplify, or redesign the form, but to **replicate the visual and structural behavior of the original IRS PDF** as accurately as possible.

The output must preserve, as closely as technically possible:

- page size and proportions
- margins and printable area
- grid structure
- line spacing
- column widths
- label placement
- checkboxes and entry fields
- borders and separators
- text hierarchy
- pagination
- alignment of all form elements

This skill should be used when converting official IRS forms into structured application work elements while maintaining the original visual identity and operational layout of the source PDF.

## Primary Goal

Produce a form replica that is visually and structurally consistent with the source IRS PDF, so that:

1. users recognize the official form immediately
2. field locations match the original document
3. printed or exported output aligns closely with the source form
4. the converted form can function as a reliable work surface inside the app

## When to Use This Skill

Use this skill when:

- converting an official IRS PDF form into an app-ready working form
- recreating a tax form UI with the same official layout
- preserving the original design language of IRS forms
- building print-compatible replicas of IRS forms
- aligning data-entry fields with the original PDF geometry
- extracting a reusable form system from official federal tax documents
- reproducing schedules, worksheets, or attachments that depend on exact positioning

Do **not** use this skill for:

- simplified consumer-friendly redesigns
- generic tax interview flows
- non-fidelity mockups
- loose approximations of IRS documents

## Core Principle

**Faithful reproduction over reinterpretation.**

The skill must avoid making aesthetic decisions unless absolutely necessary for technical reasons.

If a visual element exists in the source PDF, it should be preserved in the replica whenever possible.

If an exact reproduction is not possible, the output must use the closest visually equivalent implementation while preserving:

- relative position
- proportion
- hierarchy
- spacing rhythm
- field logic

## Source Requirements

The skill should always work from the **official source PDF** whenever available.

Preferred inputs:

1. original IRS PDF
2. high-resolution vector PDF
3. high-resolution scan only if vector PDF is unavailable

If the PDF is vector-based, preserve vector geometry whenever possible.

If the PDF is raster/scanned:

- identify page bounds precisely
- reconstruct layout using measured coordinates
- avoid visual drift caused by OCR alone
- use OCR only for text extraction support, not as the sole layout source

## Output Expectations

The recreated form should preserve:

### 1. Document Geometry

- original page size
- portrait/landscape orientation
- top, bottom, left, and right margins
- printable safe zones
- section spacing
- page breaks

### 2. Typography

- same or closest matching font family
- same weight hierarchy
- same relative font sizes
- same uppercase/lowercase treatment
- same line-height rhythm
- same label density and emphasis

### 3. Structural Elements

- horizontal rules
- vertical dividers
- table borders
- row heights
- column widths
- underlines
- entry boxes
- checkboxes
- shaded headers if present
- section titles and instruction blocks

### 4. Field Placement

- field coordinates aligned with original
- matching baseline alignment
- same label-to-field spacing
- preserved grouping of related inputs
- consistent numeric alignment for money fields

### 5. Print Fidelity

- printable without layout shift
- compatible with PDF export
- no unintended reflow
- no responsive behavior that breaks official layout in print mode

## Reconstruction Workflow

### Step 1: Analyze the Original PDF

Identify and document:

- page dimensions
- section boundaries
- grid system
- typography hierarchy
- field structure
- reusable components
- repeated layout patterns
- special alignment areas for numeric totals, signatures, or schedules

### Step 2: Map the Layout

Create a coordinate-based layout map including:

- x/y positions
- widths and heights
- row and column relationships
- grouped sections
- repeated field types
- heading and label anchors

### Step 3: Rebuild the Form

Recreate the form using components that preserve exact placement:

- containers
- text blocks
- table structures
- bordered fields
- checkboxes
- aligned numeric entry areas
- signature/date zones if applicable

### Step 4: Validate Against Source

Compare the replica to the original PDF and verify:

- element position
- scale
- spacing
- column alignment
- line thickness
- visual hierarchy
- page-level fidelity

### Step 5: Optimize for App Use

Only after fidelity is achieved, adapt the reconstructed form for application usage while keeping the original design intact.

Allowed adaptations:

- interactive fields
- internal field IDs
- validation bindings
- accessibility metadata
- hidden technical wrappers

Not allowed:

- altering layout proportions
- changing section order
- modernizing the visual style
- simplifying official labeling
- introducing decorative UI styles

## Fidelity Rules

### Rule 1: No Redesign

Do not redesign the form.

### Rule 2: No Visual Simplification

Do not remove lines, borders, labels, or instructional text unless explicitly requested.

### Rule 3: Preserve Relative Positioning

All elements must remain in the same visual relationship as in the source PDF.

### Rule 4: Match Typographic Hierarchy

If the exact typeface is unavailable, choose the closest visual substitute and preserve size, weight, and spacing relationships.

### Rule 5: Maintain Table Integrity

Columns and rows must remain dimensionally stable.

### Rule 6: Preserve Numeric Layout

Amounts, totals, and calculation lines must remain aligned exactly as in the source.

### Rule 7: Print First

The form must work as a print-stable artifact, not only as a screen layout.

## Technical Recommendations

Prefer:

- vector reconstruction
- absolute or grid-assisted coordinate placement where necessary
- reusable field primitives
- print-safe CSS
- precise spacing tokens derived from source measurements
- componentized layout only when it does not alter fidelity

Avoid:

- fluid responsive restructuring
- arbitrary padding normalization
- automatic typography substitutions without review
- OCR-only replication workflows
- generic form-builder layouts
- CSS frameworks that force spacing inconsistencies

## Font Handling

When reproducing fonts:

1. Detect whether the original PDF embeds fonts
2. If embedded fonts are available and legally usable, preserve them
3. If not, choose the closest metric-compatible substitute
4. Preserve:
   - character width feel
   - uppercase density
   - numeric alignment
   - baseline rhythm

If exact font parity is not possible, the skill must explicitly note:

- original font unavailable
- substitute chosen
- expected visual difference

## Quality Checklist

Before finalizing, verify all of the following:

- page size matches source
- margins match source
- all headings are present
- all labels are present
- all lines and borders are preserved
- column widths are accurate
- text alignment is consistent
- money fields align correctly
- checkboxes match original size and placement
- section spacing matches source rhythm
- print preview is stable
- exported PDF remains visually faithful
- no responsive distortion affects official layout

## Acceptance Criteria

A reconstruction is acceptable only if:

- the form is immediately recognizable as the original IRS document
- a side-by-side comparison shows close positional and visual correspondence
- linework, spacing, and field grouping match the source
- the result can be used as a production work form inside the app
- print/export output preserves the official structure

## Example Use Case

Recreate IRS Schedule C from the official PDF as an interactive app form while preserving:

- official page layout
- section titles and part structure
- line numbering
- amount columns
- underlined numeric entry zones
- checkbox placement
- expense tables
- vehicle information layout
- other expenses continuation structure

## Non-Negotiable Constraint

The skill must prioritize **faithful document reproduction** over convenience, responsiveness, or stylistic modernization.

When in doubt, preserve the source layout.
