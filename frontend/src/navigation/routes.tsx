import type { ComponentType, JSX } from 'react';

import {AdminDashboard} from "@/pages/AdminDashboard.tsx";
import {InitDataPage} from "@/pages/InitDataPage.tsx";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: InitDataPage },
  { path: '/dashboard', Component: AdminDashboard },
];
