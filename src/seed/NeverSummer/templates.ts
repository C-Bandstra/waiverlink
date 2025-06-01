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
 