# AI Agent Fit Diagnostic
## Product Requirements Document and Build Specification

**Version:** V1 MVP  
**Product Type:** Platform-neutral lead magnet, business diagnostic, and personalised recommendation report  
**Primary Audience:** Solopreneurs and SMEs  
**Delivery Stack:** Next.js, TypeScript, Supabase, Vercel, GitHub  
**Future Integration:** CRM integration planned later, with no live GHL dependency in V1

---

# 1. Product Summary

The **AI Agent Fit Diagnostic** is a single-purpose web application that helps solopreneurs and SMEs identify where they are losing time, leads, sales, or customer opportunities.

The user completes a short assessment covering:

- enquiry handling
- lead qualification
- sales follow-up
- appointments
- customer support
- payment follow-up
- reviews and reactivation
- operations and reporting

The application uses a transparent weighted scoring model to rank eight predefined AI Agent roles.

It then generates an instant **AI Workforce Fit Report** containing:

- a personalised summary of the business’s main gaps
- the top three recommended AI Agents
- an explanation of why each Agent was recommended
- a suggested AI Workforce implementation sequence
- readiness and foundation notes
- two possible next-phase AI Agents

The public-facing product must remain platform-neutral.

Do not publicly mention:

- GHL
- GoHighLevel
- GuaranteedCRM
- any specific CRM or automation platform

A CRM may later be used as the backend follow-up engine, but this must not be a dependency in V1.

---

# 2. Product Purpose

Many business owners understand that AI and automation may help them, but they do not know:

- which process should be improved first
- which AI Agent is most relevant
- whether their biggest problem is enquiry handling, sales, appointments, support, payments, retention, or operations
- whether their current processes are ready for automation
- how multiple AI Agents could work together as one connected system

The product should answer:

> Which AI Agents should this business consider first, and why?

---

# 3. Product Positioning

The product is:

- a lead magnet
- a business diagnostic
- a recommendation tool
- a personalised report generator
- a demand-validation MVP
- a future entry point into CRM and automation services

The product is not:

- an AI Agent deployment platform
- a CRM
- a full automation builder
- a paid SaaS product in V1
- an implementation proposal generator
- a replacement for business consultation

---

# 4. Target Users

Primary users include:

- solopreneurs
- SME owners
- consultants
- coaches
- professional service businesses
- local service businesses
- agencies
- training and education providers
- membership and event businesses
- small sales teams
- small customer service teams
- small operations teams

The product is most suitable for businesses that depend on:

- receiving enquiries
- following up with prospects
- booking appointments
- preparing quotations or proposals
- converting leads into customers
- providing customer support
- collecting payments
- generating reviews
- generating repeat business
- coordinating internal tasks and reporting

---

# 5. Core Product Promise

## Suggested Headline

**Find the Right AI Agents for Your Business**

## Suggested Supporting Copy

> Answer a few questions about how your business handles enquiries, sales, customers, payments, and daily operations. Receive an instant personalised AI Workforce Fit Report showing the three AI Agents most likely to create an immediate impact.

## Primary CTA

**Start the Diagnostic**

Alternative CTA:

**Find My AI Agent Fit**

---

# 6. Terminology Rules

Use the following terminology consistently:

- **AI Workforce** for the overall connected system
- **AI Agents** for specialist business roles
- **AI Assistants** only for lighter task-based roles
- **AI Workforce Fit Report** for the final report

Preferred wording:

> Your recommended AI Workforce begins with three specialist AI Agents.

Avoid:

- using “AI employees” as the main public-facing term
- employee replacement language
- guaranteed savings or revenue claims
- technical CRM terminology
- claims such as “replace your whole team”

---

# 7. Product Architecture

The application has two distinct experiences.

## Public Experience

```text
Landing page
→ Diagnostic introduction
→ Assessment questions
→ Contact and consent form
→ Scoring
→ Report generation
→ AI Workforce Fit Report
```

## Private Admin Experience

```text
Admin login
→ Submissions list
→ Search and filter
→ Open client record
→ Review answers and scores
→ Review generated report
→ Review future CRM sync status
```

---

# 8. Navigation

V1 is a single-feature guided experience.

Do not build:

- desktop sidebar navigation for the public app
- mobile hamburger menu for the public app
- multi-section application navigation
- public user dashboard navigation

Use a minimal public header containing:

- application name or logo
- optional Privacy link
- optional Restart Diagnostic action

The private admin area may use a compact header or simple sidebar because it contains multiple private views.

---

# 9. Public User Flow

## Step 1: Landing Page

Include:

- application name
- strong headline
- concise value proposition
- expected completion time
- one primary CTA
- trust indicators
- privacy reassurance
- no pricing
- no CRM platform mention

Suggested trust indicators:

- 3–5 minutes
- Instant personalised report
- Built for solopreneurs and SMEs

## Step 2: Diagnostic Introduction

Suggested text:

> This short diagnostic assesses how your business handles enquiries, sales, appointments, customers, payments, and daily operations. Your answers will be used to identify your three highest-priority AI Agents.

Include:

- number of questions
- estimated duration
- progress indicator
- explanation that recommendations are based on submitted answers

## Step 3: Assessment

Use 10 questions.

The interface should show:

- one question per screen
- current question number
- progress percentage or progress bar
- Back button
- Continue button
- clear selected states
- mobile-friendly answer cards

Users must be able to return to previous questions without losing their answers.

## Step 4: Contact and Consent

Collect contact details near the end, after the diagnostic questions.

Required fields:

- first name
- email
- business name

Optional fields:

- last name
- phone number
- website

Use separate consent records.

### Required Report-Processing Consent

> I agree to the processing of my submitted information so that my AI Workforce Fit Report can be generated and stored.

### Optional Marketing Consent

> I would also like to receive useful information about AI, CRM, and business automation. I understand that I can unsubscribe at any time.

A user must still be allowed to receive the requested report without accepting promotional marketing.

## Step 5: Report Generation

Suggested loading message:

> Analysing your business gaps and matching your highest-priority AI Agents…

The ranking must come from the scoring engine.

An LLM may help write the narrative, but it must not choose or change the top-three recommendations.

## Step 6: Report

The report must be:

- visible immediately
- mobile-friendly
- accessible through a unique report URL
- saved in Supabase
- retrievable later
- understandable without a sales consultation

Do not place a strong consultation CTA inside the report.

---

# 10. Diagnostic Questions

## Question 1: Business Type

**What best describes your business?**

Single choice:

- Professional services or consulting
- Coaching, training, or education
- Property, finance, or insurance
- Healthcare, wellness, or beauty
- Home, repair, or local services
- Events, membership, or community
- E-commerce or online business
- Agency, creative, or marketing services
- Other

Purpose:

- personalise examples
- provide context
- make limited scoring adjustments

This answer must not dominate the recommendations.

## Question 2: Primary Goal

**What is your most important business goal right now?**

Single choice:

- Generate more qualified enquiries
- Respond to enquiries faster
- Convert more leads into customers
- Book more appointments
- Reduce repetitive customer support
- Improve payment collection
- Generate more reviews and repeat business
- Reduce administrative work and improve visibility

## Question 3: Enquiry Sources

**Where do most new enquiries currently come from?**

Multiple choice:

- Website forms
- Landing pages
- WhatsApp
- Social media messages
- Phone calls
- Email
- Referrals
- Events or QR codes
- Online advertising
- Other

## Question 4: Response Speed

**How quickly do new enquiries usually receive a meaningful response?**

Single choice:

- Within a few minutes
- Within one hour
- Within the same working day
- The next working day
- It depends on staff availability
- Some enquiries are missed completely

## Question 5: Lead Qualification

**How are new leads currently assessed before your team spends time on them?**

Single choice:

- We use clear qualification questions and criteria
- Staff qualify leads manually and consistently
- Staff qualify leads, but the process varies
- We collect only basic contact details
- We speak to almost every lead before knowing whether they are suitable
- We do not have a qualification process

## Question 6: Sales Follow-Up

**What usually happens when a prospect does not respond or decide immediately?**

Single choice:

- A consistent multi-step follow-up process begins
- Staff follow up using reminders or a CRM
- Staff follow up manually when they remember
- We usually follow up only once
- Follow-up is inconsistent
- Most quiet leads receive no further follow-up

## Question 7: Appointment Process

**How important are appointments, consultations, demonstrations, or calls in your sales process?**

Single choice:

- Essential, and booking is already well automated
- Essential, but booking and reminders require manual work
- Important, but we experience cancellations or no-shows
- Sometimes used, depending on the lead
- Not part of our sales process

## Question 8: Main Bottlenecks

**Which problems currently create the most work or lost opportunities?**

Select up to three:

- Repetitive enquiry questions
- Slow responses outside business hours
- Too many unsuitable leads
- Leads going cold
- Manual appointment booking
- Appointment reminders and rescheduling
- Repetitive customer support requests
- Outstanding invoices or payment chasing
- Too few customer reviews
- Inactive leads or past customers not returning
- Manual reporting and scattered information
- Tasks or handovers being missed

The interface must prevent more than three selections.

## Question 9: Time-Consuming Tasks

**Which activities consume the most founder or staff time?**

Select up to three:

- Replying to new enquiries
- Asking qualification questions
- Following up with leads
- Booking or rescheduling appointments
- Answering customer questions
- Sending invoices or payment reminders
- Requesting reviews
- Re-engaging inactive contacts
- Updating spreadsheets or CRM records
- Preparing reports
- Assigning tasks and notifying staff

The interface must prevent more than three selections.

## Question 10: Automation Readiness

**How prepared is your business to automate these processes?**

Single choice:

- Our processes and rules are clearly documented
- Our processes are mostly clear but not documented
- Different staff handle the same task differently
- Many processes depend on one person
- We need to clarify the process before automating it
- I am not sure

This answer should primarily affect readiness notes rather than recommendation ranking.

---

# 11. Eight AI Agent Roles

## 1. AI Enquiry Assistant

Addresses:

- delayed responses
- missed enquiries
- repetitive questions
- after-hours enquiries
- enquiries arriving through multiple channels

Possible tasks:

- acknowledge enquiries
- answer approved FAQs
- collect contact details
- ask initial questions
- route enquiries
- alert staff when human help is required

## 2. Lead Qualification Agent

Addresses:

- unsuitable enquiries
- inconsistent qualification
- missing lead information
- staff spending time on low-fit leads

Possible tasks:

- ask qualification questions
- collect budget, need, urgency, and service interest
- classify leads
- identify priority leads
- route leads by suitability
- trigger human follow-up

## 3. Sales Follow-Up Agent

Addresses:

- leads going cold
- inconsistent follow-up
- follow-up depending on staff memory
- prospects receiving too few follow-ups

Possible tasks:

- immediate acknowledgement
- multi-step follow-up
- conditional message paths
- lead nurturing
- sales reminders
- pipeline updates
- human escalation

## 4. Appointment Coordinator

Addresses:

- manual booking
- scheduling delays
- cancellations
- no-shows
- reminder and rescheduling work

Possible tasks:

- booking links
- calendar coordination
- confirmations
- reminders
- cancellation handling
- rescheduling
- no-show recovery

## 5. Customer Support Agent

Addresses:

- repetitive support questions
- slow service
- inconsistent answers
- poor issue routing

Possible tasks:

- answer approved support questions
- collect issue details
- create support requests
- route issues
- escalate urgent matters
- follow up on unresolved requests

## 6. Payment Follow-Up Assistant

Addresses:

- overdue invoices
- manual payment chasing
- delayed payments
- unclear payment status

Possible tasks:

- send payment links
- send reminders
- track payment status
- alert staff
- trigger payment confirmations
- support invoice and receipt workflows

## 7. Review and Reactivation Agent

Addresses:

- too few reviews
- inactive customers
- cold leads
- weak retention
- limited repeat business

Possible tasks:

- request reviews
- send review reminders
- reactivate cold leads
- run win-back campaigns
- support loyalty and referral journeys
- remind customers to return

## 8. Operations and Reporting Assistant

Addresses:

- scattered information
- missed tasks
- weak visibility
- unclear ownership
- manual reporting

Possible tasks:

- internal notifications
- staff tasks
- workflow tracking
- pipeline monitoring
- summaries
- bottleneck identification
- operational reporting

---

# 12. Scoring Model

The recommendation engine must be deterministic, transparent, and testable.

Each answer adds points to one or more Agent scores.

Scoring values:

- strong relevance: +3
- moderate relevance: +2
- supporting relevance: +1
- no relevance: 0

Example:

```text
Answer:
Some enquiries are missed completely

AI Enquiry Assistant: +3
Sales Follow-Up Agent: +2
Operations and Reporting Assistant: +1
```

Example:

```text
Answer:
We speak to almost every lead before knowing whether they are suitable

Lead Qualification Agent: +3
AI Enquiry Assistant: +1
Sales Follow-Up Agent: +1
```

Example:

```text
Selected bottleneck:
Outstanding invoices or payment chasing

Payment Follow-Up Assistant: +3
Operations and Reporting Assistant: +1
```

The final scoring matrix must exist as structured code or configuration, not scattered across unrelated components.

Recommended implementation model:

```text
Question ID
→ Answer ID
→ Agent score adjustments
```

All questions and answer options must use stable IDs.

Do not use visible answer text as the permanent database key.

Example:

```text
Question ID: response_speed
Answer ID: depends_on_staff
Display label: It depends on staff availability
```

---

# 13. Recommendation Logic

At completion:

1. Validate that all required questions are answered.
2. Calculate scores for all eight Agents.
3. Rank all eight scores.
4. Select the highest three as primary recommendations.
5. Select positions four and five as next-phase Agents.
6. Apply tie-breaking rules where necessary.
7. Save the score breakdown.
8. Generate the personalised narrative.
9. Store the final report.

Tie-breaking order:

1. number of +3 relevance matches
2. match to the stated primary goal
3. match to selected bottlenecks
4. earlier position in the customer journey

Customer journey tie order:

```text
Enquiry
→ Qualification
→ Follow-Up
→ Appointment
→ Customer Support
→ Payment
→ Review and Reactivation
→ Operations and Reporting
```

The system must not return duplicate roles.

---

# 14. Report Structure

## Section 1: AI Workforce Fit Summary

Summarise:

- primary goal
- main bottlenecks
- strongest opportunity areas
- how the recommended roles connect

## Section 2: Top Three Recommended AI Agents

Each recommendation card must show:

- ranking
- Agent name
- priority label
- why it was recommended
- problems it addresses
- example tasks
- potential operational benefit
- readiness consideration

Priority labels:

- Immediate Priority
- High Priority
- Supporting Priority

Do not promise guaranteed revenue, savings, or staffing reductions.

## Section 3: Recommended AI Workforce Sequence

Desktop:

```text
Agent 1 → Agent 2 → Agent 3
```

Mobile:

```text
Agent 1
↓
Agent 2
↓
Agent 3
```

Explain what each role hands to the next.

## Section 4: Readiness and Foundation Notes

Possible recommendations:

- define qualification criteria
- document FAQs
- clarify handover rules
- confirm booking rules
- define payment-reminder policies
- assign process ownership
- prepare approved messages
- organise customer data

## Section 5: Possible Next-Phase AI Agents

Show only the fourth- and fifth-ranked roles.

These should be visually secondary to the primary three.

## Section 6: Disclaimer

Use:

> This diagnostic provides an initial recommendation based on the information submitted. Actual implementation requirements depend on your existing systems, customer journey, operating processes, and data readiness. The recommendations do not guarantee specific financial or business outcomes.

---

# 15. Narrative Generation

The scoring engine determines the recommendations.

An LLM may be used only to write:

- the summary
- recommendation explanations
- workforce sequence explanation
- readiness notes
- next-phase explanation

The LLM must receive structured inputs:

- business type
- primary goal
- bottlenecks
- relevant answers
- all eight scores
- top-three roles
- next-phase roles
- readiness answer

The LLM must not:

- alter the ranking
- add unsupported Agent types
- mention GHL
- invent facts
- promise results
- contradict submitted answers
- include a sales pitch

Use tested fallback templates if the LLM fails.

A failed LLM request must not destroy or lose the submission.

The report must still work without an LLM.

---

# 16. Visual Design

The application must be designed in dark mode from the beginning.

Do not build a light interface and invert it later.

## Visual Direction

A premium business diagnostic using:

- black
- charcoal grey
- white
- restrained gold accents

The design should feel:

- professional
- credible
- premium
- modern
- business-focused
- consulting-grade

Avoid:

- gaming visuals
- neon effects
- excessive gradients
- playful illustrations
- clutter
- stock-photo-heavy design
- generic AI chatbot styling

## Colour Palette

```text
Primary background: #0B0B0D
Secondary background: #141416
Card background: #1B1B1F
Elevated card: #222226
Border: #34343A

Primary gold: #D8B45A
Bright gold: #E6C66A
Muted gold: #9D8241

Primary text: #F5F5F2
Secondary text: #B8B8B2
Muted text: #85858B
Success: #68B984
Error: #E06C75
```

Gold should be used selectively for:

- primary CTAs
- selected answers
- progress indicators
- recommendation rankings
- priority badges
- important borders
- icons

Do not use large bright-gold backgrounds.

## Typography

Use:

- Inter
- Geist
- Manrope
- or a similar modern sans-serif

Requirements:

- strong hierarchy
- readable body copy
- generous line spacing
- no decorative fonts

## Diagnostic Answer Cards

Default state:

- dark grey background
- neutral border
- white heading
- muted description

Selected state:

- gold border
- subtle gold-tinted background
- visible check icon
- strong text contrast

Colour must not be the only selected-state indicator.

## Responsive Breakpoints to Test

- 375 px
- 430 px
- 768 px
- 1024 px
- 1440 px

There must be no unintended horizontal scrolling.

---

# 17. Public Report Access

Each completed submission receives a unique public report token.

Recommended route pattern:

```text
/report/[secure-random-token]
```

Public report URLs must not expose:

- sequential database IDs
- admin-only information
- raw internal notes
- future CRM sync details
- another user’s submission

The report should be read-only.

---

# 18. Private Admin Portal

The private admin portal is part of V1, but it must be implemented only after the public diagnostic and report flow works correctly.

Suggested routes:

```text
/admin/login
/admin/submissions
/admin/submissions/[submission-id]
```

## Authentication

Use Supabase Authentication.

Only approved administrator email addresses may access the admin portal.

Authentication alone is not enough. Every admin route and API must also enforce server-side authorisation.

## Admin Submissions List

Display:

- submitted date
- respondent name
- business name
- email
- business type
- primary goal
- recommendation 1
- recommendation 2
- recommendation 3
- consent status
- report status
- future CRM sync status
- View action

## Search and Filters

Support:

- name
- email
- business name
- date
- business type
- primary goal
- top recommended Agent
- report generation status
- future CRM sync status

## Submission Detail Page

Show:

### Contact and Business Information

- first name
- last name
- email
- phone
- business name
- website
- submission date
- consent records

### Original Answers

Display the full question and human-readable selected answer.

Do not show only IDs.

### Scoring Results

- all eight scores
- top three
- next-phase roles
- tie-break reason when one was applied
- scoring evidence where practical

### Generated Report

- summary
- recommendations
- sequence
- readiness notes
- report URL

### Integration Data

- future CRM sync status
- last attempt
- success timestamp
- failure reason
- retry placeholder for a later integration phase

---

# 19. Supabase as the Source of Truth

Supabase is the source of truth for:

- contact and business information
- consent records
- every original diagnostic answer
- all eight Agent scores
- scoring evidence
- tie-breaking information
- top-three recommendations
- next-phase recommendations
- generated report content
- public report token
- report-generation status
- future CRM-sync status

The application must not depend on an external CRM to display, recover, or administer a diagnostic submission.

---

# 20. Supabase Data Model

## Table: submissions

Suggested fields:

```text
id
public_report_token
created_at
updated_at

first_name
last_name
email
phone
business_name
website

report_processing_consent
report_processing_consent_at
marketing_consent
marketing_consent_at

business_type
primary_goal
enquiry_sources
response_speed
qualification_process
sales_follow_up_process
appointment_process
main_bottlenecks
time_consuming_tasks
automation_readiness

agent_scores
recommendation_1
recommendation_2
recommendation_3
next_phase_1
next_phase_2
tie_break_data

workforce_summary
recommendation_content
workforce_sequence
readiness_notes
next_phase_content
full_report_content

report_generation_status
report_generation_error
report_generated_at

crm_sync_status
crm_sync_error
crm_last_attempt_at
crm_synced_at
external_contact_id
```

## Recommended Field Types

- IDs: UUID
- timestamps: timestamptz
- single-choice answers: text or controlled enum-like values
- multiple-choice answers: text array or JSONB
- Agent scores: JSONB
- recommendation content: JSONB
- full report content: JSONB or structured text
- consent: boolean plus timestamp
- public report token: unique text value

Store stable answer IDs rather than display labels.

Human-readable labels should be resolved in the application.

---

# 21. Database Constraints

The database must enforce:

- unique submission UUID
- unique public report token
- valid required contact fields
- valid consent state
- required diagnostic answers before completion
- known Agent IDs only
- score values stored as numbers
- timestamps generated consistently
- no duplicate recommendation positions
- valid report-generation statuses
- valid CRM-sync statuses

Suggested status values:

```text
report_generation_status:
pending
processing
completed
failed
```

```text
crm_sync_status:
not_started
pending
completed
failed
```

---

# 22. Data Integrity Requirements

The application must ensure:

- submitted answers match saved answers
- saved scores match displayed recommendations
- reloading the report shows the same recommendations
- answers are not lost when moving backwards
- repeated clicks do not create accidental duplicate submissions
- failed narrative generation does not delete answers
- one public report cannot retrieve another submission
- admin records are not visible publicly
- the score calculation is deterministic

Given the same answer set, the same ranking must be returned every time.

---

# 23. Row Level Security and Data Security

Supabase Row Level Security must be enabled.

Requirements:

- anonymous users may create a submission only through an approved server-side path or tightly controlled insert policy
- anonymous users must not list submissions
- public report access must be limited to the matching secure token
- public reports must expose only safe report fields
- administrators may view submissions only after authentication and authorisation
- service-role credentials must never appear in browser code
- LLM API keys must never appear in browser code
- future CRM credentials must never appear in browser code

Prefer server-side API routes for:

- submission creation
- scoring validation
- report generation
- public report retrieval
- admin data retrieval
- future CRM sync

---

# 24. Future CRM Integration

V1 must remain independent of GHL or any external CRM.

The application must store clean, stable, and structured data that can later be mapped to a CRM, but it must not make live CRM calls during the initial build.

The future CRM integration may send a selected subset of:

- contact details
- business name
- primary goal
- main bottlenecks
- top-three recommendations
- readiness notes
- public report URL
- private admin record URL
- submission date
- marketing consent status

The complete original assessment will remain available in Supabase and the private admin portal.

Do not finalise CRM field names or mappings until the diagnostic has been tested with real submissions.

---

# 25. Error Handling

The application must provide useful states for:

- invalid or missing answers
- invalid email
- database write failure
- report generation timeout
- LLM failure
- duplicate submission attempt
- unavailable public report
- expired or invalid token
- admin authentication failure
- unauthorised admin account
- future CRM sync failure

Do not show raw stack traces, database messages, API keys, or technical secrets to users.

When report generation fails:

1. preserve the completed submission
2. mark the report as failed
3. show a friendly retry state
4. permit an authorised admin retry
5. retain the error internally for debugging

---

# 26. Technical Delivery Strategy

The application may be generated initially through OnlyAIApps and then refined through Codex.

The intended stack is:

- Next.js
- TypeScript
- GitHub
- Vercel
- Supabase Postgres
- Supabase Authentication for administrators
- server-side API routes
- optional LLM integration for report narratives

OnlyAIApps may create the initial repository, deployment project, and database project.

The implementation must not assume these resources are configured correctly merely because they exist.

Before feature development, Codex must inspect and verify:

- Git repository and active branch
- GitHub remote configuration
- Vercel project connection
- Vercel deployment status
- Supabase project connection
- environment-variable names
- local and production environment variables
- database migration status
- authentication configuration
- Row Level Security status
- whether the production build can connect to Supabase

Do not create replacement GitHub, Vercel, or Supabase projects unless the existing projects are missing, inaccessible, or clearly unusable.

---

# 27. Phased Codex Build Plan

## Phase 0: Project and Infrastructure Audit

Codex must inspect the OnlyAIApps-generated project before changing application functionality.

Tasks:

1. Read this PRD and inspect the existing repository.
2. Identify the framework, package manager, and project structure.
3. Check the GitHub remote and current branch.
4. Confirm whether the repository is clean or contains uncommitted generated changes.
5. Check Vercel project linkage and build configuration.
6. Check Supabase environment-variable names.
7. Confirm that local and production environments use the intended Supabase project.
8. Inspect existing schema and migration files.
9. Inspect existing authentication and Row Level Security configuration.
10. Run the existing project locally.
11. Run lint, typecheck, tests, and production build.
12. Produce a concise gap analysis against this PRD.

Phase 0 deliverable:

```text
Existing setup confirmed
Missing setup identified
Files and migrations required
Security risks identified
Implementation plan confirmed
```

Codex must not create duplicate infrastructure unless necessary.

## Phase 1: Data Model and Scoring Foundation

Build:

- stable question IDs
- stable answer IDs
- stable AI Agent IDs
- typed diagnostic configuration
- complete weighted scoring matrix
- deterministic ranking
- tie-breaking rules
- input-validation schemas
- Supabase migration
- database constraints
- Row Level Security policies
- scoring unit tests
- database validation tests

Phase 1 is complete only when:

- migration applies successfully
- all question and answer IDs are recognised
- all eight scores calculate correctly
- tie-breaking tests pass
- invalid payloads are rejected
- lint passes
- typecheck passes
- tests pass
- production build passes

## Phase 2: Public Diagnostic Flow

Build:

- dark professional landing page
- diagnostic introduction
- ten-question guided assessment
- progress indicator
- Back and Continue controls
- answer persistence
- multi-select maximum enforcement
- contact form
- separate report-processing and marketing consent
- server-side submission endpoint
- duplicate-submit protection
- successful Supabase persistence

Do not add LLM generation yet unless the deterministic and templated report flow already works.

Phase 2 acceptance test:

```text
Start diagnostic
→ Complete all questions
→ Move backward and forward
→ Confirm answers remain selected
→ Submit contact details
→ Save complete record
→ Retrieve the same answers from Supabase
```

## Phase 3: Scoring and Report Experience

Build:

- score calculation from saved answers
- top-three selection
- fourth- and fifth-place selection
- secure public report token
- report summary
- three recommendation cards
- connected AI Workforce sequence
- readiness notes
- next-phase recommendations
- report disclaimer
- secure read-only report URL
- templated fallback report

The report must work without an LLM.

After the deterministic report works, an LLM may be added for narrative enhancement.

The LLM must not:

- choose the recommendations
- alter rankings
- invent business details
- mention GHL
- add unsupported Agent roles
- promise results

Phase 3 is complete only when the stored scores, stored recommendations, and displayed report all match.

## Phase 4: Private Admin Portal

Build:

- Supabase administrator login
- approved-admin allowlist
- server-side route protection
- submissions list
- search
- filters
- full submission detail page
- complete original answers
- all eight scores
- recommendations and report
- report-generation status
- consent records
- future CRM-sync placeholders

Security tests must prove:

- unauthenticated visitors cannot access admin pages
- authenticated but unapproved users cannot access them
- public report visitors cannot access private fields
- one report token cannot retrieve another report
- service-role credentials are absent from client code

## Phase 5: End-to-End Verification and Deployment

Run:

- scoring unit tests
- validation tests
- database tests
- admin security tests
- end-to-end tests
- lint
- typecheck
- production build
- responsive checks
- migration verification
- live deployment smoke test

Test at:

- 375 px
- 430 px
- 768 px
- 1024 px
- 1440 px

Verify in the deployed environment:

1. The production site loads.
2. A diagnostic can be completed.
3. The submission appears in the correct Supabase project.
4. The report URL works.
5. The admin login works.
6. The new submission appears in admin.
7. Saved answers match selected answers.
8. Scores match recommendations.
9. No private data appears publicly.
10. A new GitHub push triggers the intended Vercel deployment.

---

# 28. Required Diagnostic Test Scenarios

## Scenario A: Enquiry Leakage

Answers should strongly favour:

1. AI Enquiry Assistant
2. Sales Follow-Up Agent
3. Lead Qualification Agent

## Scenario B: Appointment-Heavy Business

Answers should strongly favour:

1. Appointment Coordinator
2. Sales Follow-Up Agent
3. AI Enquiry Assistant or Operations and Reporting Assistant

## Scenario C: Customer Support and Retention

Answers should strongly favour:

1. Customer Support Agent
2. Review and Reactivation Agent
3. Operations and Reporting Assistant

## Scenario D: Payment and Administration

Answers should strongly favour:

1. Payment Follow-Up Assistant
2. Operations and Reporting Assistant
3. another role supported by the remaining answers

## Scenario E: Mature Processes with Limited Pain

The system should still return three recommendations, but the language must avoid false urgency.

Example:

> Your current processes appear relatively structured. These recommendations represent possible optimisation areas rather than urgent operational gaps.

---

# 29. Testing Requirements

The implementation is not complete until the following tests pass.

## Unit Tests

Test:

- scoring for each answer option
- accumulation of scores across questions
- top-three ranking
- fourth- and fifth-place selection
- tie-breaking rules
- maximum-three selection rules
- readiness-note mapping
- stable answer-ID mapping
- deterministic scoring
- fallback report generation

## Database Tests

Test:

- successful full submission
- required-field constraints
- arrays and JSON fields
- all eight scores saved correctly
- recommendations saved correctly
- consent timestamps saved correctly
- unique public token
- report status transitions
- CRM status transitions
- rejection of malformed payloads
- duplicate-submit handling

## End-to-End Tests

Test the complete flow:

```text
Landing page
→ Start
→ Answer every question
→ Move backward and forward
→ Submit contact details
→ Save to Supabase
→ Calculate scores
→ Generate report
→ Open report URL
→ Open admin submission
→ Confirm answers and results match
```

## Admin Security Tests

Test:

- unauthenticated user cannot access `/admin`
- non-approved authenticated user cannot access `/admin`
- approved admin can access submissions
- public report cannot expose internal data
- one public report cannot retrieve another submission
- service-role key is not present in client bundles

## Responsive Tests

Verify:

- no horizontal overflow
- readable cards
- visible selection states
- usable Back and Continue buttons
- report sequence stacks correctly
- admin tables remain usable on smaller screens

## Quality Checks

Run and pass:

- lint
- typecheck
- production build
- automated tests
- database migration validation
- manual end-to-end smoke test

---

# 30. Acceptance Criteria

The MVP is accepted only when:

1. A user can complete the diagnostic without logging in.
2. Required questions cannot be skipped.
3. Multi-select questions enforce the maximum of three.
4. Answers remain selected when navigating backwards.
5. Contact and consent data is validated.
6. The complete submission is saved in Supabase.
7. All eight Agent scores are calculated and stored.
8. The top three recommendations are deterministic.
9. The next two Agents are stored.
10. Tie-breaking behaves as documented.
11. The generated report matches the saved scores and answers.
12. A failed LLM request does not lose the submission.
13. The public report is accessible only through a secure token.
14. The public report reveals no admin-only information.
15. The admin portal is protected.
16. An approved admin can review every original answer.
17. The admin can see all scores and recommendations.
18. The app works on mobile and desktop.
19. Lint, typecheck, tests, and production build pass.
20. No secret key is exposed in browser code.
21. Database field names and application payloads are verified against the live schema.
22. At least five defined end-to-end diagnostic scenarios have been tested.

---

# 31. Build Documentation Requirements

Codex should create or update:

```text
README.md
.env.example
supabase/migrations/
docs/scoring-model.md
docs/data-model.md
docs/testing.md
```

Documentation should include:

- setup instructions
- environment-variable reference
- scoring logic
- question and answer ID reference
- database field reference
- test instructions
- deployment instructions
- known limitations
- future CRM integration notes

Do not include real secrets in `.env.example`.

---

# 32. V1 Exclusions

Do not include:

- live GHL integration
- CRM webhook calls
- GHL custom-field mapping
- GHL tags
- GHL opportunity creation
- GHL workflow triggers
- payment
- subscriptions
- public user accounts
- public client dashboard
- editable scoring admin interface
- actual AI Agent deployment
- WhatsApp automation
- live calendar booking
- advertising integrations
- complex analytics dashboards
- downloadable PDF requirement
- full automation blueprint generation
- public GHL branding
- aggressive consultation CTA
- multiple diagnostic products
- multilingual support
- team roles beyond basic approved administrators

---

# 33. Future Possibilities

Possible later phases:

- GHL integration
- personalised nurture workflows
- PDF export
- client accounts
- saved report history
- industry-specific assessments
- editable scoring administration
- implementation-roadmap generation
- consultation booking
- white-label versions
- partner or agency dashboards
- aggregate analytics
- recommendation comparison over time

---

# 34. Definition of Success

V1 is successful when:

- real users complete the diagnostic
- users understand the recommendations
- the report feels useful and credible
- contact and consent details are stored accurately
- all assessment answers are retrievable
- the top-three recommendations reflect the submitted answers
- the administrator can review each client’s complete record
- the database and scoring flow operate reliably
- the application works across mobile and desktop

Initial validation metrics:

- landing-page-to-start rate
- diagnostic completion rate
- contact submission rate
- marketing consent rate
- report-generation success rate
- most common bottlenecks
- most common top recommendations
- qualitative user feedback
- number of qualified follow-up conversations

---

# 35. Main V1 Workflow

> A solopreneur or SME owner starts the diagnostic, completes ten business questions, submits contact and consent details, receives a personalised AI Workforce Fit Report containing the top three recommended AI Agents, and the complete assessment, scoring results, and report are saved in Supabase. An authorised administrator can later review the client’s original answers, scores, and report through a secure private admin portal.

---

# 36. Final Build Instruction

> Build the application as a complete, testable end-to-end product rather than a visual prototype. Verify that every diagnostic field maps correctly to the Supabase schema, that every answer contributes the intended scoring values, that the saved scores match the displayed recommendations, and that the public report and private admin views retrieve the correct submission. Run database validation, unit tests, end-to-end diagnostic scenarios, lint, typecheck, and a production build before considering the implementation complete.

---

# 37. First Codex Instruction After OnlyAIApps Generates the Project

> Review the complete PRD and inspect the existing OnlyAIApps-generated repository before changing code. Do not assume that GitHub, Vercel, Supabase, environment variables, migrations, authentication, or Row Level Security are configured correctly merely because files or projects exist. Begin with Phase 0 only. Verify the repository, remote, branch, deployment connection, Supabase project, environment-variable names, existing schema, migration state, and security setup. Run the current lint, typecheck, tests, and production build. Then provide a concise gap analysis and an ordered implementation plan for Phases 1–5. Do not create replacement GitHub, Vercel, or Supabase projects unless the existing resources are unavailable or clearly unsuitable. Do not proceed to Phase 1 until approval is given.
