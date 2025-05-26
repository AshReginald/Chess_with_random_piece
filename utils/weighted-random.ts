import type { PieceType, PieceColor } from "../types/chess"

// Weighted probabilities for piece selection
const PIECE_WEIGHTS: Record<PieceType, number> = {
  king: 15, // 15% - Lower because it's always important
  queen: 10, // 10% - Lower because it's very powerful
  rook: 18, // 18% - Moderate
  bishop: 18, // 18% - Moderate
  knight: 18, // 18% - Moderate
  pawn: 21, // 21% - Higher because there are many pawns
}

export function getWeightedRandomPieces(board: (any | null)[][], color: PieceColor, count = 3): PieceType[] {
  // Get available piece types on the board
  const availablePieces = new Set<PieceType>()

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        availablePieces.add(piece.type)
      }
    }
  }

  if (availablePieces.size === 0) {
    return ["king"] // Fallback
  }

  const availableArray = Array.from(availablePieces)
  const selected: PieceType[] = []

  for (let i = 0; i < count; i++) {
    // Create weighted array
    const weightedArray: PieceType[] = []

    availableArray.forEach((pieceType) => {
      const weight = PIECE_WEIGHTS[pieceType] || 10
      for (let j = 0; j < weight; j++) {
        weightedArray.push(pieceType)
      }
    })

    // Select random piece from weighted array
    const randomIndex = Math.floor(Math.random() * weightedArray.length)
    selected.push(weightedArray[randomIndex])
  }

  return selected
}

// Special weighted selection for chaos mode (4 pieces)
export function getChaosModePieces(board: (any | null)[][], color: PieceColor): PieceType[] {
  return getWeightedRandomPieces(board, color, 4)
}

// Bonus system: if you get 3 of the same piece, get an extra reroll
export function checkForBonusReroll(pieces: PieceType[]): boolean {
  const counts = pieces.reduce(
    (acc, piece) => {
      acc[piece] = (acc[piece] || 0) + 1
      return acc
    },
    {} as Record<PieceType, number>,
  )

  return Object.values(counts).some((count) => count >= 3)
}
