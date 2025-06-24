import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/Dashboard";
import SubmissionSelector from "../pages/admin/SubmissionSelector";
import Submission from "../pages/admin/Submission";
import TemplateBuilder from "../pages/admin/TemplateBuilder";
import type { AppRoute } from "../types";

const adminRoutes: AppRoute[] = [
  {
    path: "", // root of admin, acts like index here
    component: Admin,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        children: [
          {
            path: "", // this is the "index" route of dashboard
            component: SubmissionSelector,
          },
          {
            path: ":templateId",
            component: Submission,
          },
        ],
      },
      {
        path: "template-builder",
        component: TemplateBuilder,
        children: [],
      },
    ],
  },
];

export default adminRoutes;
