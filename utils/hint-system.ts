import type { Position, Piece, PieceType, PieceColor } from "../types/chess"
import { isValidMove, makeMove, isInCheck } from "./chess-logic"

export interface Hint {
  from: Position
  to: Position
  piece: Piece
  score: number
  reason: string
}

export function getBestHints(
  board: (Piece | null)[][],
  currentPlayer: PieceColor,
  selectedPieces: PieceType[],
  usedPiecesCount: Record<PieceType, number>,
  enPassantTarget?: Position,
): Hint[] {
  const hints: Hint[] = []

  // Count available pieces
  const availablePieces: Record<PieceType, number> = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0,
  }

  selectedPieces.forEach((piece) => {
    availablePieces[piece]++
  })

  // Find all possible moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (!piece || piece.color !== currentPlayer) continue

      const used = usedPiecesCount[piece.type] || 0
      const available = availablePieces[piece.type]

      if (used >= available || !selectedPieces.includes(piece.type)) continue

      // Check all possible destinations
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (row === toRow && col === toCol) continue

          const from = { row, col }
          const to = { row: toRow, col: toCol }

          try {
            if (isValidMove(board, from, to, piece, enPassantTarget)) {
              const newBoard = makeMove(board, from, to)
              if (!isInCheck(newBoard, currentPlayer)) {
                const hint = evaluateMove(board, from, to, piece, currentPlayer)
                if (hint.score > 0) {
                  hints.push(hint)
                }
              }
            }
          } catch (error) {
            continue
          }
        }
      }
    }
  }

  // Sort by score and return top hints
  return hints.sort((a, b) => b.score - a.score).slice(0, 3)
}

function evaluateMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  currentPlayer: PieceColor,
): Hint {
  let score = 1 // Base score
  let reason = "Nước đi hợp lệ"

  const targetPiece = board[to.row][to.col]
  const opponentColor = currentPlayer === "white" ? "black" : "white"

  // Capture bonus
  if (targetPiece) {
    const captureValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100,
    }
    score += captureValues[targetPiece.type] * 10
    reason = `Ăn ${getPieceName(targetPiece.type)}`
  }

  // Check bonus
  const newBoard = makeMove(board, from, to)
  if (isInCheck(newBoard, opponentColor)) {
    score += 50
    reason = "Chiếu vua đối thủ"
  }

  // Center control bonus
  if (to.row >= 3 && to.row <= 4 && to.col >= 3 && to.col <= 4) {
    score += 5
    if (!targetPiece) reason = "Kiểm soát trung tâm"
  }

  // King safety - penalize moves that expose king
  if (piece.type === "king") {
    // Check if king moves to a safer position
    const kingDanger = countAttackers(newBoard, to, opponentColor)
    if (kingDanger === 0) {
      score += 10
      if (!targetPiece && reason === "Nước đi hợp lệ") reason = "Vua an toàn"
    } else {
      score -= kingDanger * 5
    }
  }

  // Development bonus for early game
  if (piece.type === "knight" || piece.type === "bishop") {
    if ((piece.color === "white" && from.row === 7) || (piece.color === "black" && from.row === 0)) {
      score += 8
      if (!targetPiece && reason === "Nước đi hợp lệ") reason = "Phát triển quân"
    }
  }

  // Pawn promotion bonus
  if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
    score += 80
    reason = "Phong cấp tốt"
  }

  return {
    from,
    to,
    piece,
    score: Math.max(score, 1),
    reason,
  }
}

function countAttackers(board: (Piece | null)[][], position: Position, attackerColor: PieceColor): number {
  let count = 0

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === attackerColor) {
        try {
          if (isValidMove(board, { row, col }, position, piece)) {
            count++
          }
        } catch (error) {
          continue
        }
      }
    }
  }

  return count
}

function getPieceName(pieceType: PieceType): string {
  const names = {
    king: "vua",
    queen: "hậu",
    rook: "xe",
    bishop: "tượng",
    knight: "mã",
    pawn: "tốt",
  }
  return names[pieceType]
}
