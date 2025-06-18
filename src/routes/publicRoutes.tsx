import Waiver from "../pages/waiver/Waiver";

export const publicRoutes = [
  {
    path: "waiver/:waiverId?",
    component: Waiver,
  },
];

export default publicRoutes;

// UPDATE TO THIS FLOW BELOW
// Guest Sign Flow
// /waiver/:seedSlug/:waiverId
//     → Load and render waiver for a specific business (seedSlug)
//     → Dynamic field parsing and e-sign
//     → Submission creates a guest waiver record

// /waiver/:seedSlug/success
//     → Confirmation page post-submission

// /waiver/:seedSlug/expired
//     → If the waiver link is expired or revoked

// /waiver/:seedSlug/already-submitted
//     → For returning users or duplicate submissions
// -----------------------------------------------------------------------
// Admin/Client Flow
// /:seedSlug/admin/login
//     → Login for this seed's admin
//     → JWT or session-based authentication, scoped to seed

// /:seedSlug/admin/dashboard
//     → Waiver submissions summary and filtering
//     → Analytics per field (e.g., board type, age group, etc.)

// /:seedSlug/admin/waivers
//     → List all completed waivers
//     → Filtering, sorting, export options

// /:seedSlug/admin/waivers/:waiverId
//     → View an individual waiver's filled data + signature

// /:seedSlug/admin/template
//     → View/edit waiver template for that seed
//     → Dynamic field token mapping (e.g., `{{input:age}}`, etc.)

// /:seedSlug/admin/settings
//     → Seed configuration (branding, contact email, etc.)
