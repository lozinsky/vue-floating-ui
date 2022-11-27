/* eslint-disable */

import type { Component } from 'vue-demi';

export interface RendererNode {
  [key: string]: any;
}

export declare interface RendererElement extends RendererNode {}

export interface TeleportProps {
  to: string | RendererElement | null | undefined;
  disabled?: boolean;
}

export const Teleport: Component<TeleportProps>;

export * from 'vue-demi';
