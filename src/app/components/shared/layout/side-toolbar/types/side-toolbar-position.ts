export const TYPES_OF_SIDE_TOOLBAR_POSITIONS = ['left', 'right'] as const;

export type SideToolbarPosition =
  (typeof TYPES_OF_SIDE_TOOLBAR_POSITIONS)[number];
