"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { GameState, Position, Move } from "./types/chess"
import {
  createInitialBoard,
  getRandomPieces,
  isValidMove,
  isInCheck,
  canMakeValidMove,
  makeMove,
  getMoveNotation,
  getEnPassantTarget,
} from "./utils/chess-logic"
import { ChessBoard } from "./components/chess-board"
import { PieceSelector } from "./components/piece-selector"
import { GameTimer, type GameTimerRef } from "./components/game-timer"
import { MoveHistory } from "./components/move-history"
import { GameStatus } from "./components/game-status"
import { PromotionDialog } from "./components/promotion-dialog"
import { Button } from "@/components/ui/button"
import { RotateCcw, SkipForward } from "lucide-react"

export default function RandomChessGame() {
  const timerRef = useRef<GameTimerRef>(null)

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = createInitialBoard()
    const initialPieces = getRandomPieces(initialBoard, "white")
    return {
      board: initialBoard,
      currentPlayer: "white",
      selectedPieces: initialPieces.length === 3 ? initialPieces : ["pawn", "knight", "rook"],
      movesRemaining: 3,
      rerollsLeft: { white: 2, black: 2 },
      isInCheck: false,
      gameOver: false,
      moveHistory: [],
      usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
    }
  })

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position } | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Position
    to: Position
    piece: any
    capturedPiece?: any
  } | null>(null)

  // Check for check status
  useEffect(() => {
    if (!gameState.board || !gameState.currentPlayer || gameState.gameOver) {
      return
    }

    const inCheck = isInCheck(gameState.board, gameState.currentPlayer)
    console.log(`${gameState.currentPlayer} is in check: ${inCheck}`)

    if (gameState.isInCheck !== inCheck) {
      setGameState((prev) => ({
        ...prev,
        isInCheck: inCheck,
      }))
    }
  }, [gameState.board, gameState.currentPlayer, gameState.isInCheck, gameState.gameOver])

  // Check for checkmate
  useEffect(() => {
    if (!gameState.isInCheck || gameState.gameOver) return

    const canMove = canMakeValidMove(
      gameState.board,
      gameState.currentPlayer,
      gameState.selectedPieces,
      gameState.usedPiecesCount,
      gameState.enPassantTarget,
    )

    // Chỉ checkmate khi: bị chiếu + không có nước đi + không còn reroll
    const hasRerollsLeft = gameState.rerollsLeft[gameState.currentPlayer] > 0
    const canRerollNow =
      gameState.movesRemaining === 3 && Object.values(gameState.usedPiecesCount).every((count) => count === 0)

    if (!canMove && (!hasRerollsLeft || !canRerollNow)) {
      console.log(`${gameState.currentPlayer} is checkmated! No moves and no rerolls available.`)
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        winner: prev.currentPlayer === "white" ? "black" : "white",
      }))
    }
  }, [
    gameState.isInCheck,
    gameState.board,
    gameState.currentPlayer,
    gameState.selectedPieces,
    gameState.usedPiecesCount,
    gameState.enPassantTarget,
    gameState.gameOver,
    gameState.rerollsLeft,
    gameState.movesRemaining,
  ])

  const canCurrentPlayerMove = useCallback(() => {
    if (gameState.gameOver) return true
    return canMakeValidMove(
      gameState.board,
      gameState.currentPlayer,
      gameState.selectedPieces,
      gameState.usedPiecesCount,
      gameState.enPassantTarget,
    )
  }, [
    gameState.board,
    gameState.currentPlayer,
    gameState.selectedPieces,
    gameState.usedPiecesCount,
    gameState.gameOver,
    gameState.enPassantTarget,
  ])

  const handleSkipTurn = useCallback(() => {
    const newPlayer = gameState.currentPlayer === "white" ? "black" : "white"
    const newPieces = getRandomPieces(gameState.board, newPlayer)

    setGameState((prev) => ({
      ...prev,
      currentPlayer: newPlayer,
      selectedPieces: newPieces,
      usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
      movesRemaining: 3,
      enPassantTarget: undefined,
    }))
    setSelectedSquare(null)
    setValidMoves([])
  }, [gameState.currentPlayer, gameState.board])

  const calculateValidMoves = useCallback(
    (position: Position): Position[] => {
      try {
        const piece = gameState.board[position.row][position.col]
        if (!piece || piece.color !== gameState.currentPlayer) return []

        const availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        const usedCount = gameState.usedPiecesCount[piece.type] || 0

        if (usedCount >= availableCount) return []
        if (!gameState.selectedPieces.includes(piece.type)) return []

        const moves: Position[] = []
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const to = { row, col }
            try {
              if (isValidMove(gameState.board, position, to, piece, gameState.enPassantTarget)) {
                const newBoard = makeMove(gameState.board, position, to)
                if (!isInCheck(newBoard, gameState.currentPlayer)) {
                  moves.push(to)
                }
              }
            } catch (error) {
              continue
            }
          }
        }
        return moves
      } catch (error) {
        console.error("Error calculating valid moves:", error)
        return []
      }
    },
    [
      gameState.board,
      gameState.currentPlayer,
      gameState.selectedPieces,
      gameState.usedPiecesCount,
      gameState.enPassantTarget,
    ],
  )

  const executeMoveAndCheckForCheck = useCallback(
    (from: Position, to: Position, piece: any, capturedPiece: any, promotionPiece?: any) => {
      const newBoard = makeMove(gameState.board, from, to, promotionPiece)

      const newUsedPiecesCount = {
        ...gameState.usedPiecesCount,
        [piece.type]: (gameState.usedPiecesCount[piece.type] || 0) + 1,
      }

      const newMovesRemaining = gameState.movesRemaining - 1

      // Check if this move causes check to the opponent
      const opponentColor = gameState.currentPlayer === "white" ? "black" : "white"
      const causesCheck = isInCheck(newBoard, opponentColor)

      console.log(`Move from ${from.row},${from.col} to ${to.row},${to.col} causes check: ${causesCheck}`)

      // If move causes check OR we've used all 3 moves, change turn
      const shouldChangeTurn = causesCheck || newMovesRemaining === 0

      const move: Move = {
        from,
        to,
        piece,
        capturedPiece,
        notation: getMoveNotation(gameState.board, from, to, piece, capturedPiece),
        promotionPiece,
        isCheck: causesCheck,
        turnChange: shouldChangeTurn, // Đánh dấu khi turn thay đổi
      }

      setLastMove({ from, to })

      if (shouldChangeTurn) {
        console.log(`Changing turn to ${opponentColor}`)
        const newPieces = getRandomPieces(newBoard, opponentColor)

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          currentPlayer: opponentColor,
          selectedPieces: newPieces,
          usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
          movesRemaining: 3,
          moveHistory: [...prev.moveHistory, move],
          lastMove: move,
          enPassantTarget: undefined,
        }))
      } else {
        console.log(`Continuing turn for ${gameState.currentPlayer}`)
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          usedPiecesCount: newUsedPiecesCount,
          movesRemaining: newMovesRemaining,
          moveHistory: [...prev.moveHistory, move],
          lastMove: move,
          enPassantTarget: getEnPassantTarget(gameState.board, from, to, piece),
        }))
      }
    },
    [gameState],
  )

  const handlePromotion = useCallback(
    (promotionPiece: any) => {
      if (!pendingPromotion) return

      const { from, to, piece, capturedPiece } = pendingPromotion
      setPendingPromotion(null)

      executeMoveAndCheckForCheck(from, to, piece, capturedPiece, promotionPiece)
    },
    [pendingPromotion, executeMoveAndCheckForCheck],
  )

  const handleSquareClick = useCallback(
    (position: Position) => {
      if (gameState.gameOver || pendingPromotion) return

      const piece = gameState.board[position.row][position.col]

      // If clicking on a valid move destination
      if (selectedSquare && validMoves.some((move) => move.row === position.row && move.col === position.col)) {
        const movingPiece = gameState.board[selectedSquare.row][selectedSquare.col]
        if (!movingPiece) return

        const capturedPiece = gameState.board[position.row][position.col]

        // Check for pawn promotion
        if (movingPiece.type === "pawn" && (position.row === 0 || position.row === 7)) {
          setPendingPromotion({
            from: selectedSquare,
            to: position,
            piece: movingPiece,
            capturedPiece,
          })
          setSelectedSquare(null)
          setValidMoves([])
          return
        }

        setSelectedSquare(null)
        setValidMoves([])

        executeMoveAndCheckForCheck(selectedSquare, position, movingPiece, capturedPiece)
        return
      }

      // If clicking on own piece
      if (piece && piece.color === gameState.currentPlayer) {
        const availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        const usedCount = gameState.usedPiecesCount[piece.type] || 0

        if (gameState.selectedPieces.includes(piece.type) && usedCount < availableCount) {
          setSelectedSquare(position)
          setValidMoves(calculateValidMoves(position))
        } else {
          setSelectedSquare(null)
          setValidMoves([])
        }
      } else {
        setSelectedSquare(null)
        setValidMoves([])
      }
    },
    [gameState, selectedSquare, validMoves, calculateValidMoves, pendingPromotion, executeMoveAndCheckForCheck],
  )

  const handleReroll = useCallback(() => {
    if (gameState.rerollsLeft[gameState.currentPlayer] > 0) {
      const newPieces = getRandomPieces(gameState.board, gameState.currentPlayer)
      setGameState((prev) => ({
        ...prev,
        selectedPieces: newPieces,
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        rerollsLeft: {
          ...prev.rerollsLeft,
          [prev.currentPlayer]: prev.rerollsLeft[prev.currentPlayer] - 1,
        },
      }))
      setSelectedSquare(null)
      setValidMoves([])
    }
  }, [gameState.currentPlayer, gameState.rerollsLeft, gameState.board])

  const handleNewGame = useCallback(() => {
    const initialBoard = createInitialBoard()
    const initialPieces = getRandomPieces(initialBoard, "white")

    setGameState({
      board: initialBoard,
      currentPlayer: "white",
      selectedPieces: initialPieces,
      usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
      movesRemaining: 3,
      rerollsLeft: { white: 2, black: 2 },
      isInCheck: false,
      gameOver: false,
      moveHistory: [],
    })
    setSelectedSquare(null)
    setValidMoves([])
    setLastMove(null)
    setPendingPromotion(null)

    if (timerRef.current) {
      timerRef.current.reset()
    }
  }, [])

  const canReroll =
    !gameState.gameOver &&
    gameState.movesRemaining === 3 &&
    Object.values(gameState.usedPiecesCount).every((count) => count === 0)
  const canMove = canCurrentPlayerMove()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Cờ Vua Ngẫu Nhiên</h1>
          <p className="text-amber-700">Mỗi lượt quay 3 loại quân cờ để di chuyển</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            <GameTimer ref={timerRef} currentPlayer={gameState.currentPlayer} gameOver={gameState.gameOver} />

            <PieceSelector
              selectedPieces={gameState.selectedPieces}
              usedPiecesCount={gameState.usedPiecesCount}
              movesRemaining={gameState.movesRemaining}
              rerollsLeft={gameState.rerollsLeft[gameState.currentPlayer]}
              onReroll={handleReroll}
              canReroll={canReroll}
            />

            {/* Skip turn button when no valid moves */}
            {!canMove && !gameState.gameOver && !gameState.isInCheck && (
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">Không có nước đi hợp lệ!</p>
                <Button onClick={handleSkipTurn} variant="outline" size="sm" className="w-full">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Bỏ lượt
                </Button>
              </div>
            )}

            <GameStatus
              currentPlayer={gameState.currentPlayer}
              isInCheck={gameState.isInCheck}
              gameOver={gameState.gameOver}
              winner={gameState.winner}
              movesRemaining={gameState.movesRemaining}
              rerollsLeft={gameState.rerollsLeft[gameState.currentPlayer]}
            />
          </div>

          {/* Chess board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="space-y-4">
              <ChessBoard
                board={gameState.board}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                onSquareClick={handleSquareClick}
                lastMove={lastMove}
                currentPlayer={gameState.currentPlayer}
                isInCheck={gameState.isInCheck}
              />

              <div className="flex justify-center">
                <Button onClick={handleNewGame} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Ván mới
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>

        {/* Promotion dialog */}
        {pendingPromotion && <PromotionDialog color={gameState.currentPlayer} onSelect={handlePromotion} />}
      </div>
    </div>
  )
}
