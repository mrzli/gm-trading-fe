export const TYPES_OF_RIGHT_TOOLBAR_STATE = ['trade'] as const;

export type RightToolbarState = (typeof TYPES_OF_RIGHT_TOOLBAR_STATE)[number];
