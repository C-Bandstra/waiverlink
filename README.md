# waiverlink

*waiverlink* is a flexible and modular digital waiver platform built for businesses still using paper-based waivers, forms, or simple signature documents.
The system is designed to be frictionless for guests, easy to manage for staff, and deeply extensible for tracking, analytics, and potential customer conversion.

## Goals

- Guest-first flow with no login required
- Easily pluggable into existing business systems
- Reusable and dynamic data structures for multiple industries
- Lightweight admin interface for real-time tracking and management

## Tech Stack

- **Frontend:** React (Vite) + TypeScript + TailwindCSS
- **Backend:** Firebase (Auth + Firestore) Scalability - MySQL, Express

## Core Concepts

- **Seed-based architecture**: Each business gets a unique "seed" (config object) that defines their document templates and field rendering logic.
- **No hardcoded industry logic** – All business-specific logic lives in the seed, not the core renderer.
- **Dynamic document rendering**: Waivers are parsed from template strings using smart token parsing like `{{input:boardModel}}` or `{{radio:shirtSize:S:M:L:XL}}`.
- **Field modularity**: Supports various input types such as `input`, `checkbox`, `radio`, and `select` through a centralized `fieldDefinitions` object.
- **Pluggable UI components**: Fields are rendered dynamically via reusable render functions.

## Current Features

- Token-based waiver parsing
- Dynamic field rendering (`input`, `checkbox`, `radio`)
- Easy-to-extend `fieldDefinitions` system
- Subtype-based option parsing (`radio:shirtSize:S:M:L`)

## Upcoming Features

- Drag & drop admin template editor
- Seed-specific admin dashboards
- Advanced data filtering (e.g., all signed waivers with `boardModel = Eclipse`)
- QR-based guest access
- Optional user account conversion
- Signature capture
- Database write on submit
- Active demo tracking (admin)
- Guest profile export & analytics

## Dev Setup

```bash
git clone https://github.com/yourusername/waiverlink.git
cd waiverlink
npm install
npm run dev
