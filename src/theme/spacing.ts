export const spacing = {
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 12,
  spaceLg: 16,
  spaceXl: 24,
  space2xl: 32,
  gutter: 12,
  margin: 16,
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 12,
  borderRadiusXl: 16,
  borderRadiusFull: 9999,
} as const;

export type Spacing = typeof spacing;
