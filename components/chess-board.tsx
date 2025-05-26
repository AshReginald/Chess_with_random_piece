"use client"

import type { Piece, Position, PieceColor } from "../types/chess"
import { PIECE_SYMBOLS, findKing } from "../utils/chess-logic"

interface ChessBoardProps {
  board: (Piece | null)[][]
  selectedSquare: Position | null
  validMoves: Position[]
  onSquareClick: (position: Position) => void
  lastMove?: { from: Position; to: Position } | null
  currentPlayer: PieceColor
  isInCheck: boolean
}

export function ChessBoard({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  lastMove,
  currentPlayer,
  isInCheck,
}: ChessBoardProps) {
  const kingInCheckPos = isInCheck ? findKing(board, currentPlayer) : null

  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isLastMove = (row: number, col: number) => {
    return (
      lastMove &&
      ((lastMove.from.row === row && lastMove.from.col === col) || (lastMove.to.row === row && lastMove.to.col === col))
    )
  }

  const isKingInCheck = (row: number, col: number) => {
    return kingInCheckPos && kingInCheckPos.row === row && kingInCheckPos.col === col
  }

  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0
    let baseColor = isLight ? "bg-amber-100" : "bg-amber-800"

    if (isKingInCheck(row, col)) {
      baseColor = "bg-red-500" // Highlight king in check
    } else if (isSquareSelected(row, col)) {
      baseColor = "bg-blue-400"
    } else if (isValidMove(row, col)) {
      baseColor = isLight ? "bg-green-200" : "bg-green-600"
    } else if (isLastMove(row, col)) {
      baseColor = isLight ? "bg-yellow-200" : "bg-yellow-600"
    }

    return baseColor
  }

  return (
    <div className="grid grid-cols-8 gap-0 border-2 border-amber-900 bg-amber-900">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-16 h-16 flex items-center justify-center cursor-pointer
              text-4xl font-bold transition-colors duration-200
              ${getSquareColor(rowIndex, colIndex)}
              hover:brightness-110
            `}
            onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
          >
            {piece && <span className="select-none">{PIECE_SYMBOLS[piece.type][piece.color]}</span>}
          </div>
        )),
      )}
    </div>
  )
}
