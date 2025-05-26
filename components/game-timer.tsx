"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import type { PieceColor } from "../types/chess"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Zap } from "lucide-react"

interface GameTimerProps {
  currentPlayer: PieceColor
  gameOver: boolean
  mode?: "classic" | "blitz" | "ai" | "chaos"
  onTimeUp?: (player: PieceColor) => void
}

export interface GameTimerRef {
  reset: () => void
  resetTurn: () => void // New method for blitz mode
}

export const GameTimer = forwardRef<GameTimerRef, GameTimerProps>(
  ({ currentPlayer, gameOver, mode = "classic", onTimeUp }, ref) => {
    // Different time limits based on mode
    const getInitialTime = () => {
      switch (mode) {
        case "blitz":
          return 30 // 30 seconds per turn
        default:
          return 600 // 10 minutes total
      }
    }

    const [whiteTime, setWhiteTime] = useState(getInitialTime())
    const [blackTime, setBlackTime] = useState(getInitialTime())
    const [lastPlayer, setLastPlayer] = useState<PieceColor>(currentPlayer)

    // Track if we've already called onTimeUp to prevent multiple calls
    const [timeUpCalled, setTimeUpCalled] = useState<{ white: boolean; black: boolean }>({
      white: false,
      black: false,
    })

    useImperativeHandle(ref, () => ({
      reset: () => {
        const initialTime = getInitialTime()
        setWhiteTime(initialTime)
        setBlackTime(initialTime)
        setLastPlayer(currentPlayer)
        setTimeUpCalled({ white: false, black: false })
      },
      resetTurn: () => {
        // For blitz mode: reset current player's time when turn changes
        if (mode === "blitz") {
          const resetTime = getInitialTime()
          if (currentPlayer === "white") {
            setWhiteTime(resetTime)
            setTimeUpCalled((prev) => ({ ...prev, white: false }))
          } else {
            setBlackTime(resetTime)
            setTimeUpCalled((prev) => ({ ...prev, black: false }))
          }
        }
      },
    }))

    // Reset turn time when player changes in blitz mode
    useEffect(() => {
      if (mode === "blitz" && currentPlayer !== lastPlayer && !gameOver) {
        const resetTime = getInitialTime()
        if (currentPlayer === "white") {
          setWhiteTime(resetTime)
        } else {
          setBlackTime(resetTime)
        }
        setLastPlayer(currentPlayer)
      }
    }, [currentPlayer, lastPlayer, mode, gameOver])

    useEffect(() => {
      if (gameOver) return

      const interval = setInterval(() => {
        if (currentPlayer === "white") {
          setWhiteTime((prev) => Math.max(0, prev - 1))
        } else {
          setBlackTime((prev) => Math.max(0, prev - 1))
        }
      }, 1000)

      return () => clearInterval(interval)
    }, [currentPlayer, gameOver])

    // Separate useEffect to handle time up events
    useEffect(() => {
      if (gameOver) return

      if (whiteTime === 0 && !timeUpCalled.white && onTimeUp) {
        setTimeUpCalled((prev) => ({ ...prev, white: true }))
        onTimeUp("white")
      }

      if (blackTime === 0 && !timeUpCalled.black && onTimeUp) {
        setTimeUpCalled((prev) => ({ ...prev, black: true }))
        onTimeUp("black")
      }
    }, [whiteTime, blackTime, timeUpCalled, onTimeUp, gameOver])

    // Reset timeUpCalled when game resets
    useEffect(() => {
      if (whiteTime > 0 || blackTime > 0) {
        setTimeUpCalled({ white: false, black: false })
      }
    }, [whiteTime, blackTime])

    const formatTime = (seconds: number) => {
      if (mode === "blitz") {
        // For blitz mode, show seconds only
        return `${seconds}s`
      } else {
        // For other modes, show mm:ss
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      }
    }

    const getTimeColor = (time: number, isCurrentPlayer: boolean) => {
      if (mode === "blitz") {
        if (time <= 5) return "text-red-600" // Red when <= 5 seconds
        if (time <= 10) return "text-orange-600" // Orange when <= 10 seconds
        return "text-green-600" // Green otherwise
      }
      return "text-gray-900" // Default for other modes
    }

    const isBlitzMode = mode === "blitz"

    return (
      <div className="space-y-2">
        <Card className={`${currentPlayer === "black" ? "ring-2 ring-blue-500" : ""}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded-full"></div>
                <span className="font-medium">Đen</span>
                {isBlitzMode && <Zap className="w-3 h-3 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span
                  className={`font-mono text-lg ${getTimeColor(blackTime, currentPlayer === "black")} ${
                    isBlitzMode && blackTime <= 10 ? "font-bold" : ""
                  }`}
                >
                  {formatTime(blackTime)}
                </span>
              </div>
            </div>
            {isBlitzMode && currentPlayer === "black" && (
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      blackTime <= 5 ? "bg-red-500" : blackTime <= 10 ? "bg-orange-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(blackTime / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`${currentPlayer === "white" ? "ring-2 ring-blue-500" : ""}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-400 rounded-full"></div>
                <span className="font-medium">Trắng</span>
                {isBlitzMode && <Zap className="w-3 h-3 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span
                  className={`font-mono text-lg ${getTimeColor(whiteTime, currentPlayer === "white")} ${
                    isBlitzMode && whiteTime <= 10 ? "font-bold" : ""
                  }`}
                >
                  {formatTime(whiteTime)}
                </span>
              </div>
            </div>
            {isBlitzMode && currentPlayer === "white" && (
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      whiteTime <= 5 ? "bg-red-500" : whiteTime <= 10 ? "bg-orange-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(whiteTime / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isBlitzMode && (
          <div className="text-center">
            <p className="text-xs text-gray-600">⚡ Chế độ Chớp Nhoáng: 30s/lượt</p>
          </div>
        )}
      </div>
    )
  },
)

GameTimer.displayName = "GameTimer"
