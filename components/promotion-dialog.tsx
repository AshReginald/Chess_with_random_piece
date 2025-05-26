"use client"
import type { PieceType, PieceColor } from "../types/chess"
import { PIECE_SYMBOLS, PIECE_NAMES } from "../utils/chess-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PromotionDialogProps {
  color: PieceColor
  onSelect: (piece: PieceType) => void
}

export function PromotionDialog({ color, onSelect }: PromotionDialogProps) {
  const promotionPieces: PieceType[] = ["queen", "rook", "bishop", "knight"]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">Phong cấp tốt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Chọn quân cờ để phong cấp:</p>
          <div className="grid grid-cols-2 gap-4">
            {promotionPieces.map((pieceType) => (
              <Button
                key={pieceType}
                onClick={() => onSelect(pieceType)}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2"
              >
                <span className="text-4xl">{PIECE_SYMBOLS[pieceType][color]}</span>
                <span className="text-sm">{PIECE_NAMES[pieceType]}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
