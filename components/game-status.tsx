"use client"

import type { PieceColor } from "../types/chess"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Crown, Users } from "lucide-react"

interface GameStatusProps {
  currentPlayer: PieceColor
  isInCheck: boolean
  gameOver: boolean
  winner?: PieceColor
  movesRemaining: number
  rerollsLeft: number
}

export function GameStatus({
  currentPlayer,
  isInCheck,
  gameOver,
  winner,
  movesRemaining,
  rerollsLeft,
}: GameStatusProps) {
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        return `${winner === "white" ? "Trắng" : "Đen"} thắng!`
      }
      return "Hòa!"
    }

    if (isInCheck) {
      const hasRerolls = rerollsLeft > 0
      const canRerollNow = movesRemaining === 3

      if (hasRerolls && canRerollNow) {
        return `${currentPlayer === "white" ? "Trắng" : "Đen"} đang bị chiếu! Có thể reroll để tìm cách cản.`
      } else {
        return `${currentPlayer === "white" ? "Trắng" : "Đen"} đang bị chiếu!`
      }
    }

    return `Lượt của ${currentPlayer === "white" ? "Trắng" : "Đen"}`
  }

  const getStatusIcon = () => {
    if (gameOver && winner) {
      return <Crown className="w-5 h-5 text-yellow-500" />
    }
    if (isInCheck) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    }
    return <Users className="w-5 h-5 text-blue-500" />
  }

  return (
    <Card className={`${isInCheck ? "border-red-500" : ""} ${gameOver ? "border-yellow-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium">{getStatusMessage()}</p>
            {!gameOver && <p className="text-sm text-gray-600">Còn {movesRemaining} nước trong lượt này</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
