export const TYPES_OF_RIGHT_TOOLBAR_STATE = ['none', 'trade'] as const;

export type RightToolbarState = (typeof TYPES_OF_RIGHT_TOOLBAR_STATE)[number];
