// import React from 'react';
import type { FieldDefinition } from '../../types/waiver';
import { demoWaiverTemplate, adminWaiverTemplate } from './templates';
import logo from "../../assets/never-summer.png"
import { baseFieldDefinitions } from '../../fields/fieldDefinitions/main';

const NeverSummer = {
  id: "never_summer",
  name: "Never Summer",
  image: logo,
  waiverTemplates: {
    demo: demoWaiverTemplate,
    admin: adminWaiverTemplate,
  },
  trackingLabels: ["boardModel"],
  fieldDefinitions: baseFieldDefinitions satisfies Record<string, FieldDefinition>,
};

export default NeverSummer;