# Mapping Me Workbook

## Project overview

Mapping Me is an open-source, local-first neurodiversity workbook.

It is designed for neurodivergent users, including people with ADHD, Autism, and AuDHD.

The central goal is not to diagnose, assess, correct, or normalize users.

The intended feeling is:

> I understand myself better.

The workbook should help users explore how their brain, body, emotions, needs, values, identity, and energy work.

## Product format

Build this as a responsive web application that:

* can be hosted at `/workbook` on an existing website
* works on desktop, tablet, and mobile
* can be used without an account
* automatically saves progress locally
* can work offline as a PWA
* can print blank worksheets
* can print completed worksheets
* can export completed content as PDF
* can export and import editable workbook data
* may support optional cloud sync later
* remains open source

## Privacy principles

The workbook may contain sensitive personal information involving:

* neurodivergence
* diagnosis
* emotions
* sensory experiences
* boundaries
* identity
* beliefs
* health and body signals
* family and school experiences

For the first version:

* store answers locally on the user’s device
* do not require registration
* do not upload answers to a server
* clearly explain where answers are stored
* provide JSON export and import
* never claim that browser storage is a permanent backup
* do not add analytics that capture workbook answers

Optional accounts and cloud sync may be added later, but they must remain optional.

## Technical direction

Preferred stack:

* Next.js
* TypeScript
* React
* IndexedDB for local workbook storage
* PWA support
* print-specific CSS
* reusable components
* accessible semantic HTML
* GitHub for the open-source repository

Prepare the architecture so optional Supabase authentication and sync can be added later, but do not implement cloud storage in the first MVP.

## Accessibility

Aim for WCAG 2.2 AA.

Requirements include:

* complete keyboard navigation
* visible focus indicators
* properly associated labels and inputs
* screen-reader-friendly status messages
* no information communicated through color alone
* sufficient text contrast
* support for browser zoom and text resizing
* respect `prefers-reduced-motion`
* avoid unnecessary animation
* avoid time limits
* do not require drag-and-drop as the only interaction method
* do not force users to complete sections in order
* allow users to pause and return later
* use clear, literal interface language

## Visual direction

The visual style should use:

* bold shapes
* collage-inspired forms
* playful visual language
* clear hierarchy
* warmth and humor
* a handmade feeling
* playful but not childish design

Avoid:

* polished educational-app aesthetics
* overly smooth generic vector illustrations
* excessive visual clutter
* puzzle-piece Autism symbolism
* presenting ADHD only as chaos
* presenting Autism only through cold or muted colors
* framing neurodivergence as a superpower or a list of deficits

## Display modes

The interface should include two presentation modes.

### Lively Mode

May include:

* stronger color contrast
* collage textures
* decorative shapes
* subtle motion
* visual jokes and supporting details

### Calm Mode

Should include:

* reduced decoration
* reduced texture
* less motion
* more whitespace
* lower visual density
* one clear primary focus per page

Both modes must contain exactly the same:

* information
* questions
* functionality
* saved answers

Calm Mode must not be a reduced-content version.

## Workbook structure

The planned workbook chapters are:

1. Mapping My Energy
2. Understanding My Sensory Profile
3. How I Learn
4. Processing My Emotions
5. Exploring My Boundaries
6. Discovering My Values
7. Exploring My Identity & Beliefs
8. Checking In with My Body
9. What Helps Me Get Started
10. What I Love About Myself

Users must be able to complete chapters in any order.

## First MVP

Implement only the first chapter:

# Mapping My Energy

Suggested flow:

1. What gives me energy?
2. What uses up my energy?
3. How does low energy feel in my body?
4. What helps me recharge?
5. My Energy Map summary

Each step should feel small and manageable.

Possible answer formats include:

* free text
* selectable suggestion cards
* custom user-created cards
* simple scales
* optional notes
* reorderable items, with accessible non-drag controls as an alternative

Do not frame the questions as a score, test, diagnosis, or performance assessment.

## Saving behaviour

* autosave after each meaningful change
* show a quiet status such as “Saved on this device”
* avoid disruptive success notifications
* restore progress when the user returns
* allow users to reset a section or the entire workbook with confirmation
* provide JSON export
* provide JSON import with validation and error handling

## Printing

Support:

* Print This Section
* Print My Completed Workbook
* Print a Blank Workbook

Print output should:

* support A4
* remain usable on US Letter
* work in black and white
* avoid relying on background colors
* keep prompts and answers together when possible
* hide navigation and interactive controls
* provide writing space in blank versions

## Content and ethical boundaries

The workbook is educational and reflective.

It must not:

* diagnose users
* assign a neurotype
* calculate a clinical score
* promise health outcomes
* provide medical conclusions
* compare users with one another
* use streaks, rankings, or completion pressure
* shame users for unfinished work
* automatically interpret sensitive answers
* present support needs as personal failures

Use affirming, neutral, and non-clinical language.

## Coding workflow

Before implementing major features:

1. inspect the existing project
2. explain the proposed change briefly
3. identify reusable components
4. preserve accessibility and privacy requirements
5. run relevant checks and tests
6. update documentation when behaviour changes

Prefer simple, readable code over unnecessary abstraction.

Do not add external dependencies unless they provide a clear benefit.

## Initial task

Start by:

1. proposing the project structure
2. defining the workbook data model
3. defining the reusable component system
4. explaining the local saving strategy
5. explaining the print architecture
6. explaining the accessibility approach
7. scaffolding the first working MVP
8. adding a README with setup, privacy, accessibility, printing, data export, and contribution instructions

