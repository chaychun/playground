const SA_59_PALETTE = [
  "#8a9a9f",
  "#b7291d",
  "#d0c7b8",
  "#978c84",
  "#3d4966",
  "#7f6a5a",
  "#c67441",
  "#645c60",
  "#cdcb8a",
  "#f9f8f7",
  "#362731",
  "#190d10",
  "#68221c",
];

function shuffleArray<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

export function selectRandomColors(n: number): string[] {
  return shuffleArray(SA_59_PALETTE).slice(0, n);
}
