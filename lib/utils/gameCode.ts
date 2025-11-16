// Generate a random 6-digit number for game codes
export function generateGameCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}
