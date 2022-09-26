export function convertUnitToKg(value: number, unit: string): number {
  const toKgRatios: { [key: string]: number } = {
    'POUNDS': 0.45359,
    'SLUGS': 14.59390,
    'GRAMS': 1000,
    'MILLIGRAMS': 1000000,
    'TONS': 0.001,
    'OUNCES': 0.02835
  };

  return Math.round(value * toKgRatios[unit] * 100000)/100000;
}

export function convertFromKgToUnit(value: number, unit: string): number {
  const fromKgRatios: { [key: string]: number } = {
    'POUNDS': 2.20462,
    'SLUGS': 0.06852,
    'GRAMS': 0.001,
    'MILLIGRAMS': 0.000001,
    'TONS': 1000,
    'OUNCES': 35.274
  };

  return Math.round(value * fromKgRatios[unit] * 100000)/100000;
}
