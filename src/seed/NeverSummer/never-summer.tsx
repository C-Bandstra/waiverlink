// import React from 'react';
import type { FieldDefinition } from '../../types/waiver';
import { demoWaiverTemplate, adminWaiverTemplate } from './templates';
import logo from "../../assets/never-summer.png"
import { baseFieldDefinitions } from '../../fields/fieldDefinitions/main';
import type { Template } from '../../types/admin';

const NeverSummer = {
  id: "never-summer",
  name: "Never Summer",
  image: logo,
  waiverTemplates: {
    demo: demoWaiverTemplate,
    admin: adminWaiverTemplate, //copy of demo to assume list of templates
  } as Record<string, Template>,
  trackingLabels: ["boardModel"],
  fieldDefinitions: baseFieldDefinitions satisfies Record<string, FieldDefinition>,
};

export default NeverSummer;