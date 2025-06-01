import type { ComponentType } from "react";

export interface AppRoute {
  path: string;               // always a string, empty string for "index"
  component: ComponentType<any>;
  children?: AppRoute[];
}