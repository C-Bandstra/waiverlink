export const gearRentalWaiverTemplate = {
  id: "gear-rental",
  title: "Gear Rental Waiver",
  groupingId: "waivers",
  content: `
    I, {{name}}, acknowledge and agree to the terms and conditions outlined in this release of liability. I understand that snowboarding, demoing equipment, and related activities involve inherent risks. I voluntarily assume full responsibility for any injuries or damages that may occur during my participation in a Christy Sports event or while using Christy Sports gear.
    {{br}}
    Participant Signature: {{signature}}
    {{br}}
    Date: {{date:current|color:blue;}}
    {{br}}
    Participant Signature: {{signature|font-size:40px;color:red}}
    {{br}}
    `,
};
