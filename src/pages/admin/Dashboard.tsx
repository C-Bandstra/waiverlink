// import React from "react";
import { DataGrid } from "../../components/DataGrid";

//Data will be supplied by waiver submissions; waiver context before DB writes

const waiverSubmissions = [
  {
    seedId: "never_summer",
    templateId: "demo",
    timestamp: "2025-05-28T00:36:28.099Z",
    submittedBy: { name: "Charlie Bandstra" },
    values: {
      "input-boardModel": "Eclipse",
      "dropdown-riderLevel": "Advanced",
      "radio-shirtSize": "Large",
      "date-birthDate": "2010-07-14",
      "input-guardian": "Josh Bandstra",
      "textarea-concerns": "High Blood Pressure",
      "checkbox-agreeToTerms": "true"
    }
  },
  {
    seedId: "never_summer",
    templateId: "demo",
    timestamp: "2025-05-28T00:36:28.099Z",
    submittedBy: { name: "Charlie Bandstra" },
    values: {
      "input-boardModel": "Eclipse",
      "dropdown-riderLevel": "Advanced",
      "radio-shirtSize": "Small",
      "date-birthDate": "2010-07-14",
      "input-guardian": "Josh Bandstra",
      "textarea-concerns": "High Blood Pressure",
      "checkbox-agreeToTerms": "true"
    }
  },
  {
    seedId: "never_summer",
    templateId: "demo",
    timestamp: "2025-05-27T18:45:11.229Z",
    submittedBy: { name: "Alice Johnson" },
    values: {
      "input-boardModel": "Proto Slinger",
      "dropdown-riderLevel": "Beginner",
      "radio-shirtSize": "Small",
      "date-birthDate": "2012-03-10",
      "input-guardian": "Lara Johnson",
      "textarea-concerns": "None",
      "checkbox-agreeToTerms": "true"
    }
  },
  {
    seedId: "never_summer",
    templateId: "demo",
    timestamp: "2025-05-27T12:22:03.515Z",
    submittedBy: { name: "Bob Stone" },
    values: {
      "input-boardModel": "Swift",
      "dropdown-riderLevel": "Intermediate",
      "radio-shirtSize": "Medium",
      "date-birthDate": "2008-11-23",
      "input-guardian": "N/A",
      "textarea-concerns": "Asthma",
      "checkbox-agreeToTerms": "false"
    }
  }
];



const Dashboard = () => {
  const dataGridValues = waiverSubmissions.map((submission) => submission.values);

  return (
    <div className="max-w-4xl mt-8">
      <h1 className="text-xl font-semibold mb-4">Signed Waivers</h1>
      <DataGrid data={dataGridValues} />
    </div>
  );
}

export default Dashboard;