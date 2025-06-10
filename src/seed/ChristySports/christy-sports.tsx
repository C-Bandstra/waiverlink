// import React from 'react';
import type { FieldDefinition } from '../../types/waiver';
import { gearRentalWaiverTemplate } from './templates';
import logo from "../../assets/christy-sports.svg"
import { baseFieldDefinitions } from '../../fields/fieldDefinitions/main';
import type { Template } from '../../types/admin';

const ChristySports = {
  id: "christy-sports",
  name: "Christy Sports",
  image: logo,
  waiverTemplates: {
    "gear-rental": gearRentalWaiverTemplate,
  } as Record<string, Template>,
  trackingLabels: ["returnDate"],
  fieldDefinitions: baseFieldDefinitions satisfies Record<string, FieldDefinition>,
}

export default ChristySports;