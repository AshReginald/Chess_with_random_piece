"use client"

import type { Move } from "../types/chess"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"

interface MoveHistoryProps {
  moves: Move[]
}

interface TurnGroup {
  turnNumber: number
  player: "white" | "black"
  moves: Move[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  // Group moves by actual turns (based on turnChange flag)
  const groupedMoves: TurnGroup[] = []
  let currentTurn: TurnGroup | null = null
  let turnCounter = 1

  moves.forEach((move, index) => {
    // Start a new turn if:
    // 1. It's the first move, OR
    // 2. The previous move had turnChange = true
    const isNewTurn = index === 0 || (index > 0 && moves[index - 1].turnChange)

    if (isNewTurn) {
      // Push the previous turn if it exists
      if (currentTurn) {
        groupedMoves.push(currentTurn)
      }

      // Start a new turn
      currentTurn = {
        turnNumber: Math.ceil(turnCounter / 2),
        player: move.piece.color,
        moves: [move],
      }

      // Increment turn counter when starting a new turn
      if (move.piece.color === "white") {
        turnCounter++
      }
    } else {
      // Add move to current turn
      if (currentTurn) {
        currentTurn.moves.push(move)
      }
    }
  })

  // Don't forget to push the last turn
  if (currentTurn) {
    groupedMoves.push(currentTurn)
  }

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Kí phổ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {groupedMoves.map((group, index) => (
              <div key={index} className="border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Lượt {group.turnNumber}
                    {group.player === "black" && "..."}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      group.player === "white" ? "bg-gray-100 text-gray-800" : "bg-gray-800 text-white"
                    }`}
                  >
                    {group.player === "white" ? "Trắng" : "Đen"}
                  </span>
                  <span className="text-xs text-gray-500">({group.moves.length} nước)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.moves.map((move, moveIndex) => (
                    <span
                      key={moveIndex}
                      className={`text-sm px-2 py-1 rounded ${
                        move.isCheck
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : move.isCheckmate
                            ? "bg-red-100 text-red-900 border border-red-300"
                            : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      {move.notation}
                      {move.isCheck && "+"}
                      {move.isCheckmate && "#"}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
