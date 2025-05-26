"use client"

import type { PieceType } from "../types/chess"
import { PIECE_SYMBOLS, PIECE_NAMES } from "../utils/chess-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dice6, Shuffle } from "lucide-react"

interface PieceSelectorProps {
  selectedPieces: PieceType[]
  usedPiecesCount: Record<PieceType, number>
  movesRemaining: number
  rerollsLeft: number
  onReroll: () => void
  canReroll: boolean
  // Chaos mode props
  isChaosModeActive?: boolean
  chaosPieces?: PieceType[]
}

export function PieceSelector({
  selectedPieces,
  usedPiecesCount,
  movesRemaining,
  rerollsLeft,
  onReroll,
  canReroll,
  isChaosModeActive = false,
  chaosPieces = [],
}: PieceSelectorProps) {
  // For chaos mode, count pieces from chaosPieces; for normal mode, use selected pieces
  const displayPieces = isChaosModeActive ? chaosPieces : selectedPieces

  // Count how many of each piece type we have
  const pieceCounts: Record<PieceType, number> = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0,
  }

  displayPieces.forEach((piece) => {
    pieceCounts[piece]++
  })

  // Get unique piece types for display
  const uniquePieceTypes = Object.entries(pieceCounts)
    .filter(([, count]) => count > 0)
    .map(([type]) => type as PieceType)

  const getGridCols = () => {
    const numTypes = uniquePieceTypes.length
    if (numTypes <= 2) return "grid-cols-2"
    if (numTypes === 3) return "grid-cols-3"
    return "grid-cols-2" // For 4+ types, use 2x2 grid
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isChaosModeActive ? <Shuffle className="w-5 h-5" /> : <Dice6 className="w-5 h-5" />}
          {isChaosModeActive ? "Chế độ Hỗn Loạn" : "Quân cờ được chọn"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isChaosModeActive && (
          <div className="text-center">
            <p className="text-sm text-purple-600 font-medium mb-2">
              Quay được {displayPieces.length} quân - Tối đa 3 nước đi
            </p>
            <p className="text-xs text-gray-600">Sử dụng quân theo số lượng đã quay</p>
          </div>
        )}

        <div className={`grid ${getGridCols()} gap-2`}>
          {uniquePieceTypes.map((pieceType) => {
            const total = pieceCounts[pieceType]
            const used = usedPiecesCount[pieceType] || 0
            const remaining = total - used
            const isFullyUsed = remaining === 0

            return (
              <div
                key={pieceType}
                className={`
                  p-3 border-2 rounded-lg text-center transition-all
                  ${isFullyUsed ? "border-green-500 bg-green-50 opacity-50" : "border-blue-500 bg-blue-50"}
                `}
              >
                <div className="text-3xl mb-1">{PIECE_SYMBOLS[pieceType].white}</div>
                <div className="text-sm font-medium">{PIECE_NAMES[pieceType]}</div>
                <div className="text-xs text-gray-600">
                  {isChaosModeActive ? (
                    <>
                      <div>Có: {total} quân</div>
                      <div>Còn: {remaining} lượt</div>
                    </>
                  ) : (
                    `${used}/${total}`
                  )}
                </div>
                {isChaosModeActive && remaining > 0 && <div className="text-xs text-blue-600 mt-1">✓ Có thể đi</div>}
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Còn lại: {movesRemaining} nước</p>
          <Button
            onClick={onReroll}
            disabled={!canReroll || rerollsLeft === 0}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isChaosModeActive ? <Shuffle className="w-4 h-4 mr-2" /> : <Dice6 className="w-4 h-4 mr-2" />}
            Quay lại ({rerollsLeft} lần)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
