export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type PieceColor = "white" | "black"

export interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

export interface Position {
  row: number
  col: number
}

export interface Move {
  from: Position
  to: Position
  piece: Piece
  capturedPiece?: Piece
  notation: string
  isCheck?: boolean
  isCheckmate?: boolean
  isCastling?: boolean
  isEnPassant?: boolean
  promotionPiece?: PieceType
  turnChange?: boolean // Đánh dấu khi nào turn thay đổi
}

export interface GameState {
  board: (Piece | null)[][]
  currentPlayer: PieceColor
  selectedPieces: PieceType[]
  usedPiecesCount: Record<PieceType, number>
  movesRemaining: number
  rerollsLeft: { white: number; black: number }
  isInCheck: boolean
  gameOver: boolean
  winner?: PieceColor
  moveHistory: Move[]
  lastMove?: Move
  enPassantTarget?: Position
}
