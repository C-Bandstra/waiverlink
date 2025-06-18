import React from "react";
import type { ComponentType } from "react";

export interface AppRoute {
  path: string; // always a string, empty string for "index"
  component: ComponentType<any>;
  children?: AppRoute[];
}

export type Event = React.ChangeEvent<HTMLInputElement>;
