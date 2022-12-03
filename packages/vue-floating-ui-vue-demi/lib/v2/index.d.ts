/* eslint-disable */

import type { Vue2 } from 'vue-demi';

export interface RendererNode {
  [key: string]: any;
}

export declare interface RendererElement extends RendererNode {}

export interface TeleportProps {
  to: string | RendererElement | null | undefined;
  disabled?: boolean;
}

export const Teleport: typeof Vue2;

export * from 'vue-demi';
