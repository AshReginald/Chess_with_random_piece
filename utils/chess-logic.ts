import type { Piece, PieceType, PieceColor, Position } from "../types/chess"

export const PIECE_SYMBOLS: Record<PieceType, { white: string; black: string }> = {
  king: { white: "♔", black: "♚" },
  queen: { white: "♕", black: "♛" },
  rook: { white: "♖", black: "♜" },
  bishop: { white: "♗", black: "♝" },
  knight: { white: "♘", black: "♞" },
  pawn: { white: "♙", black: "♟" },
}

export const PIECE_NAMES: Record<PieceType, string> = {
  king: "Vua",
  queen: "Hậu",
  rook: "Xe",
  bishop: "Tượng",
  knight: "Mã",
  pawn: "Tốt",
}

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Black pieces
  board[0] = [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ]

  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: "pawn", color: "black" }
    board[6][i] = { type: "pawn", color: "white" }
  }

  // White pieces
  board[7] = [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ]

  return board
}

export function getAvailablePieceTypes(board: (Piece | null)[][], color: PieceColor): PieceType[] {
  const availablePieces = new Set<PieceType>()

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        availablePieces.add(piece.type)
      }
    }
  }

  return Array.from(availablePieces)
}

export function getRandomPieces(
  board: (Piece | null)[][],
  color: PieceColor,
  count = 3,
): { pieces: PieceType[]; hasTriple: boolean; tripleType?: PieceType } {
  const availablePieces = getAvailablePieceTypes(board, color)

  if (availablePieces.length === 0) {
    return { pieces: ["king"], hasTriple: false } // Fallback - should never happen
  }

  const selected: PieceType[] = []

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availablePieces.length)
    selected.push(availablePieces[randomIndex])
  }

  // Check for triple (3 pieces of the same type)
  const pieceCounts: Record<PieceType, number> = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0,
  }

  selected.forEach((piece) => {
    pieceCounts[piece]++
  })

  const tripleType = Object.entries(pieceCounts).find(([, count]) => count === 3)?.[0] as PieceType
  const hasTriple = !!tripleType

  return { pieces: selected, hasTriple, tripleType }
}

// For chaos mode - get 4 pieces
export function getChaosModePieces(board: (Piece | null)[][], color: PieceColor): PieceType[] {
  const availablePieces = getAvailablePieceTypes(board, color)

  if (availablePieces.length === 0) {
    return ["king", "king", "king", "king"] // Fallback
  }

  const selected: PieceType[] = []

  // Always get exactly 4 pieces for chaos mode
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * availablePieces.length)
    selected.push(availablePieces[randomIndex])
  }

  console.log(`Chaos mode: Generated 4 pieces:`, selected)
  return selected
}

export function findKing(board: (Piece | null)[][], color: PieceColor): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === "king" && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

export function isInCheck(board: (Piece | null)[][], color: PieceColor): boolean {
  const kingPos = findKing(board, color)
  if (!kingPos) {
    console.log(`No king found for ${color}`)
    return false
  }

  const opponentColor = color === "white" ? "black" : "white"

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === opponentColor) {
        if (canPieceAttackSquare(board, { row, col }, kingPos, piece)) {
          console.log(`${color} king is in check from ${piece.type} at ${row},${col}`)
          return true
        }
      }
    }
  }

  return false
}

// Simplified attack check without recursion
function canPieceAttackSquare(board: (Piece | null)[][], from: Position, to: Position, piece: Piece): boolean {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  switch (piece.type) {
    case "pawn":
      const direction = piece.color === "white" ? -1 : 1
      return rowDiff === direction && Math.abs(colDiff) === 1

    case "rook":
      if (rowDiff !== 0 && colDiff !== 0) return false
      return isPathClear(board, from, to)

    case "bishop":
      if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false
      return isPathClear(board, from, to)

    case "queen":
      if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) return false
      return isPathClear(board, from, to)

    case "knight":
      return (
        (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
      )

    case "king":
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1

    default:
      return false
  }
}

function isPathClear(board: (Piece | null)[][], from: Position, to: Position): boolean {
  const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0
  const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    if (currentRow < 0 || currentRow > 7 || currentCol < 0 || currentCol > 7) return false
    if (board[currentRow][currentCol]) return false
    currentRow += rowStep
    currentCol += colStep
  }

  return true
}

export function isValidMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  enPassantTarget?: Position,
): boolean {
  if (!board || !from || !to || !piece) return false
  if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false
  if (from.row < 0 || from.row > 7 || from.col < 0 || from.col > 7) return false

  const targetPiece = board[to.row][to.col]
  if (targetPiece && targetPiece.color === piece.color) return false

  // Don't allow capturing the king directly
  if (targetPiece && targetPiece.type === "king") return false

  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  let isValidBasicMove = false

  switch (piece.type) {
    case "pawn":
      isValidBasicMove = isValidPawnMove(board, from, to, piece, rowDiff, colDiff, enPassantTarget)
      break
    case "rook":
      isValidBasicMove = isValidRookMove(board, from, to, rowDiff, colDiff)
      break
    case "bishop":
      isValidBasicMove = isValidBishopMove(board, from, to, rowDiff, colDiff)
      break
    case "queen":
      isValidBasicMove = isValidQueenMove(board, from, to, rowDiff, colDiff)
      break
    case "knight":
      isValidBasicMove = isValidKnightMove(rowDiff, colDiff)
      break
    case "king":
      isValidBasicMove = isValidKingMove(board, from, to, piece, rowDiff, colDiff)
      break
    default:
      return false
  }

  if (!isValidBasicMove) return false

  // Special check for king: cannot move into check
  if (piece.type === "king") {
    const newBoard = makeMove(board, from, to)
    if (isInCheck(newBoard, piece.color)) {
      return false
    }
  }

  return true
}

function isValidPawnMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  rowDiff: number,
  colDiff: number,
  enPassantTarget?: Position,
): boolean {
  const direction = piece.color === "white" ? -1 : 1
  const startRow = piece.color === "white" ? 6 : 1

  if (colDiff === 0) {
    // Forward move
    if (rowDiff === direction && !board[to.row][to.col]) return true
    if (from.row === startRow && rowDiff === 2 * direction && !board[to.row][to.col]) return true
  } else if (Math.abs(colDiff) === 1 && rowDiff === direction) {
    // Diagonal capture
    if (board[to.row][to.col]) return true
    // En passant
    if (enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col) {
      return true
    }
  }

  return false
}

function isValidRookMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number,
): boolean {
  if (rowDiff !== 0 && colDiff !== 0) return false
  return isPathClear(board, from, to)
}

function isValidBishopMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number,
): boolean {
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false
  return isPathClear(board, from, to)
}

function isValidQueenMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  rowDiff: number,
  colDiff: number,
): boolean {
  if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) return false
  return isPathClear(board, from, to)
}

function isValidKnightMove(rowDiff: number, colDiff: number): boolean {
  return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
}

function isValidKingMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  rowDiff: number,
  colDiff: number,
): boolean {
  // Normal king move
  if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) {
    return true
  }

  // Castling
  if (!piece.hasMoved && rowDiff === 0 && Math.abs(colDiff) === 2) {
    return canCastle(board, from, to, piece)
  }

  return false
}

function canCastle(board: (Piece | null)[][], from: Position, to: Position, king: Piece): boolean {
  if (king.hasMoved) return false

  const isKingSide = to.col > from.col
  const rookCol = isKingSide ? 7 : 0
  const rook = board[from.row][rookCol]

  if (!rook || rook.type !== "rook" || rook.color !== king.color || rook.hasMoved) {
    return false
  }

  // Check if path is clear
  const startCol = Math.min(from.col, rookCol) + 1
  const endCol = Math.max(from.col, rookCol) - 1

  for (let col = startCol; col <= endCol; col++) {
    if (board[from.row][col]) return false
  }

  // Check if king is in check or would pass through check
  if (isInCheck(board, king.color)) return false

  const step = isKingSide ? 1 : -1
  for (let col = from.col; col !== to.col + step; col += step) {
    const testBoard = JSON.parse(JSON.stringify(board))
    testBoard[from.row][col] = king
    testBoard[from.row][from.col] = null
    if (isInCheck(testBoard, king.color)) return false
  }

  return true
}

export function canMakeValidMove(
  board: (Piece | null)[][],
  color: PieceColor,
  selectedPieces: PieceType[],
  usedPiecesCount: Record<PieceType, number>,
  enPassantTarget?: Position,
): boolean {
  if (!board || !color || !selectedPieces || selectedPieces.length === 0) return false

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

  // Check if we can make at least one valid move with remaining pieces
  for (const pieceType of Object.keys(availablePieces) as PieceType[]) {
    const used = usedPiecesCount[pieceType] || 0
    const available = availablePieces[pieceType]

    if (used < available) {
      // We still have this piece type available
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col]
          if (piece && piece.color === color && piece.type === pieceType) {
            for (let toRow = 0; toRow < 8; toRow++) {
              for (let toCol = 0; toCol < 8; toCol++) {
                if (row === toRow && col === toCol) continue

                try {
                  if (isValidMove(board, { row, col }, { toRow, toCol }, piece, enPassantTarget)) {
                    const newBoard = makeMove(board, { row, col }, { toRow, toCol })
                    if (!isInCheck(newBoard, color)) {
                      return true
                    }
                  }
                } catch (error) {
                  continue
                }
              }
            }
          }
        }
      }
    }
  }
  return false
}

export function makeMove(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  promotionPiece?: PieceType,
): (Piece | null)[][] {
  if (!board || !from || !to) return board

  const newBoard = board.map((row) => [...row])
  const piece = newBoard[from.row][from.col]

  if (!piece) return newBoard

  // Handle castling
  if (piece.type === "king" && Math.abs(to.col - from.col) === 2) {
    const isKingSide = to.col > from.col
    const rookFromCol = isKingSide ? 7 : 0
    const rookToCol = isKingSide ? to.col - 1 : to.col + 1

    // Move rook
    const rook = newBoard[from.row][rookFromCol]
    if (rook) {
      newBoard[from.row][rookToCol] = { ...rook, hasMoved: true }
      newBoard[from.row][rookFromCol] = null
    }
  }

  // Handle en passant
  if (piece.type === "pawn" && Math.abs(to.col - from.col) === 1 && !newBoard[to.row][to.col]) {
    // Remove captured pawn
    const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1
    newBoard[capturedPawnRow][to.col] = null
  }

  // Handle pawn promotion
  if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
    const promoteTo = promotionPiece || "queen"
    newBoard[to.row][to.col] = { type: promoteTo, color: piece.color, hasMoved: true }
  } else {
    newBoard[to.row][to.col] = { ...piece, hasMoved: true }
  }

  newBoard[from.row][from.col] = null

  return newBoard
}

export function getEnPassantTarget(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
): Position | undefined {
  if (piece.type === "pawn" && Math.abs(to.row - from.row) === 2) {
    return { row: (from.row + to.row) / 2, col: from.col }
  }
  return undefined
}

export function getMoveNotation(
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  capturedPiece?: Piece,
): string {
  const pieceSymbol = piece.type === "pawn" ? "" : piece.type.charAt(0).toUpperCase()
  const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`
  const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`
  const capture = capturedPiece ? "x" : ""

  return `${pieceSymbol}${fromSquare}${capture}${toSquare}`
}
