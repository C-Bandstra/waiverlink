export const demoWaiverTemplate = {
  id: "demo",
  title: "Equipment Demo Waiver",
  groupingId: "waivers",
  content: `
    I, {{name}}, acknowledge and agree to the terms and conditions outlined in this release of liability. I understand that snowboarding, demoing equipment, and related activities involve inherent risks. I voluntarily assume full responsibility for any injuries or damages that may occur during my participation in a Never Summer Industries event or while using Never Summer demo gear.
    {{br}}
    Board Model Requested: {{input:boardModel;Enter Board Model}}
    {{br}}
    Please provide your skill level: {{dropdown:riderLevel:Beginner:Intermediate:Advanced:Expert}}
    {{br}}
    Preferred T-Shirt Size (for giveaways, if applicable):
    {{br}}
    {{radio:shirtSize:Small:Medium:Large:Extra Large}}
    {{br}}
    If you are under the age of 18, the following section must be completed by a parent or legal guardian:
    {{br}}
    - Date of Birth: {{date:birthDate}}
    {{br}}
    - Name of Parent or Guardian: {{input:guardian}}
    {{br}}
    Optional Info: {{input:optional}}
    {{br}}
    Please list any concerns or notes (e.g., medical conditions, previous injuries):
    {{br}} 
    {{textarea:concerns:Example of option}}
    {{br}}
    Participant Signature: {{signature}}
    {{br}}
    Date: {{date:current}}
    {{br}}
    `
  }
  // {{checkbox:agreeToTerms:I have read and agree to the terms of this waiver and voluntarily participate in Never Summer activities.}}

export const adminWaiverTemplate = {
  id: "admin",
  title: "Admin Waiver",
  groupingId: "waivers",
  content: `
    I, {{name}}, acknowledge and agree to the terms and conditions outlined in this release of liability. I understand that snowboarding, demoing equipment, and related activities involve inherent risks. I voluntarily assume full responsibility for any injuries or damages that may occur during my participation in a Never Summer Industries event or while using Never Summer demo gear.
    {{br}}
    Board Model Requested: {{input:boardModel;Enter Board Model}}
    {{br}}
    Please provide your skill level: {{dropdown:riderLevel:Beginner:Intermediate:Advanced:Expert}}
    {{br}}
    Preferred T-Shirt Size (for giveaways, if applicable):
    {{br}}
    {{radio:shirtSize:Small:Medium:Large:Extra Large}}
    {{br}}
    If you are under the age of 18, the following section must be completed by a parent or legal guardian:
    {{br}}
    - Date of Birth: {{date:birthDate}}
    {{br}}
    - Name of Parent or Guardian: {{input:guardian}}
    {{br}}
    Optional Info: {{input:optional}}
    {{br}}
    Please list any concerns or notes (e.g., medical conditions, previous injuries):
    {{br}} 
    {{textarea:concerns:Example of option}}
    {{br}}
    Participant Signature: {{signature}}
    {{br}}
    Date: {{date:current}}
    {{br}}
    {{checkbox:agreeToTerms:I have read and agree to the terms of this waiver and voluntarily participate in Never Summer activities.}}
  `
}

export const multiSignerTemplate = {
  id: "multi-signer",
  title: "Multi Signer Waiver",
  groupingId: "waivers",
  content: `
    I, {{name:signer-1}}, agree to participate in the activity described above and accept full responsibility for my actions and well-being during the event.
    {{br}}
    Emergency Contact Name: {{input:emergencyContact:signer-1}}
    {{br}}
    Emergency Contact Phone: {{input:emergencyPhone:signer-1}}
    {{br}}
    Signature (Initial): {{signature:initial:signer-1;Initial to Confirm}}
    {{br}}
    Signature (Full): {{signature:final:signer-1;Full Signature of Agreement}}
    {{br}}
    Date: {{date:current:signer-1}}
    {{br}}
    ---
    {{br}}
    I, {{name:signer-2}}, acknowledge that I am the legal guardian or authorized representative of the participant named above. I consent to their participation in the activity.
    {{br}}
    Relationship to Participant: {{input:relationship:signer-2}}
    {{br}}
    Signature: {{signature:final:signer-2;Guardian Signature}}
    {{br}}
    Date: {{date:current:signer-2}}
  `
}