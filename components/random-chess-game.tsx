"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { GameState, Position, Move, PieceColor } from "../types/chess"
import {
  createInitialBoard,
  getRandomPieces,
  getChaosModePieces,
  isValidMove,
  isInCheck,
  canMakeValidMove,
  makeMove,
  getMoveNotation,
  getEnPassantTarget,
} from "../utils/chess-logic"
import { ChessBoard } from "./chess-board"
import { PieceSelector } from "./piece-selector"
import { GameTimer, type GameTimerRef } from "./game-timer"
import { MoveHistory } from "./move-history"
import { GameStatus } from "./game-status"
import { PromotionDialog } from "./promotion-dialog"
import { BonusNotification } from "./bonus-notification"
import { Button } from "@/components/ui/button"
import { RotateCcw, SkipForward, ArrowLeft } from "lucide-react"
import type { GameSettings, GameMode } from "../types/game"
import { useSounds } from "./sound-provider"
import { getBestHints, type Hint } from "../utils/hint-system"

interface RandomChessGameProps {
  mode: GameMode
  settings: GameSettings
  onBackToMenu: () => void
}

export function RandomChessGame({ mode, settings, onBackToMenu }: RandomChessGameProps) {
  const timerRef = useRef<GameTimerRef>(null)
  const { playSound } = useSounds()

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = createInitialBoard()

    if (mode === "chaos") {
      const initialPieces = getChaosModePieces(initialBoard, "white")
      return {
        board: initialBoard,
        currentPlayer: "white",
        selectedPieces: initialPieces, // Use all 4 pieces directly
        movesRemaining: 3,
        rerollsLeft: { white: 2, black: 2 },
        isInCheck: false,
        gameOver: false,
        moveHistory: [],
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
      }
    } else {
      const initialResult = getRandomPieces(initialBoard, "white")
      return {
        board: initialBoard,
        currentPlayer: "white",
        selectedPieces: initialResult.pieces.length === 3 ? initialResult.pieces : ["pawn", "knight", "rook"],
        movesRemaining: 3,
        rerollsLeft: { white: 2, black: 2 },
        isInCheck: false,
        gameOver: false,
        moveHistory: [],
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
      }
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
  const [hints, setHints] = useState<Hint[]>([])

  // Bonus notification
  const [showBonusNotification, setShowBonusNotification] = useState(false)
  const [bonusPieceType, setBonusPieceType] = useState<string>("")

  // Chaos mode pieces (for display)
  const [chaosPieces, setChaosPieces] = useState<any[]>([])

  // Initialize chaos mode
  useEffect(() => {
    if (mode === "chaos") {
      setChaosPieces(gameState.selectedPieces)
    }
  }, [mode, gameState.selectedPieces])

  // Handle time up
  const handleTimeUp = useCallback(
    (player: PieceColor) => {
      console.log(`${player} ran out of time!`)
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        winner: player === "white" ? "black" : "white",
      }))
      playSound("checkmate")
    },
    [playSound],
  )

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

      if (inCheck) {
        playSound("check")
      }
    }
  }, [gameState.board, gameState.currentPlayer, gameState.isInCheck, gameState.gameOver, playSound])

  // Kiểm tra checkmate
  const checkForCheckmate = useCallback(() => {
    if (!gameState.isInCheck || gameState.gameOver) return

    const canMove = canMakeValidMove(
      gameState.board,
      gameState.currentPlayer,
      gameState.selectedPieces,
      gameState.usedPiecesCount,
      gameState.enPassantTarget,
    )

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
      playSound("checkmate")
      return true
    }

    return false
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
    playSound,
  ])

  // Calculate hints
  useEffect(() => {
    if (settings.hintsEnabled && !gameState.gameOver && gameState.selectedPieces.length > 0) {
      const calculatedHints = getBestHints(
        gameState.board,
        gameState.currentPlayer,
        gameState.selectedPieces,
        gameState.usedPiecesCount,
        gameState.enPassantTarget,
      )
      setHints(calculatedHints)
    } else {
      setHints([])
    }
  }, [
    gameState.board,
    gameState.currentPlayer,
    gameState.selectedPieces,
    gameState.usedPiecesCount,
    gameState.enPassantTarget,
    settings.hintsEnabled,
    gameState.gameOver,
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
    if (checkForCheckmate()) return

    const newPlayer = gameState.currentPlayer === "white" ? "black" : "white"

    if (mode === "chaos") {
      // Chaos mode: get 4 pieces for new player
      const newPieces = getChaosModePieces(gameState.board, newPlayer)
      setChaosPieces(newPieces)

      setGameState((prev) => ({
        ...prev,
        currentPlayer: newPlayer,
        selectedPieces: newPieces, // Use all 4 pieces directly
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        movesRemaining: 3,
        enPassantTarget: undefined,
      }))

      // Check for triple bonus in chaos mode
      const pieceCounts: Record<string, number> = {}
      newPieces.forEach((piece) => {
        pieceCounts[piece] = (pieceCounts[piece] || 0) + 1
      })

      const tripleType = Object.entries(pieceCounts).find(([, count]) => count >= 3)?.[0]
      if (tripleType) {
        setBonusPieceType(tripleType)
        setShowBonusNotification(true)

        setGameState((prev) => ({
          ...prev,
          rerollsLeft: {
            ...prev.rerollsLeft,
            [newPlayer]: prev.rerollsLeft[newPlayer] + 1,
          },
        }))
      }
    } else {
      // Normal modes: get 3 pieces
      const result = getRandomPieces(gameState.board, newPlayer)

      setGameState((prev) => ({
        ...prev,
        currentPlayer: newPlayer,
        selectedPieces: result.pieces,
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        movesRemaining: 3,
        enPassantTarget: undefined,
      }))

      // Check for triple bonus
      if (result.hasTriple && result.tripleType) {
        setBonusPieceType(result.tripleType)
        setShowBonusNotification(true)

        setGameState((prev) => ({
          ...prev,
          rerollsLeft: {
            ...prev.rerollsLeft,
            [newPlayer]: prev.rerollsLeft[newPlayer] + 1,
          },
        }))
      }
    }

    // Reset turn timer for blitz mode
    if (mode === "blitz" && timerRef.current) {
      timerRef.current.resetTurn()
    }

    setSelectedSquare(null)
    setValidMoves([])
  }, [gameState.currentPlayer, gameState.board, checkForCheckmate, mode])

  const calculateValidMoves = useCallback(
    (position: Position): Position[] => {
      try {
        const piece = gameState.board[position.row][position.col]
        if (!piece || piece.color !== gameState.currentPlayer) return []

        // For chaos mode, count how many of this piece type we have from the 4 rolled pieces
        let availableCount: number
        if (mode === "chaos") {
          availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        } else {
          availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        }

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
      mode,
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

      const opponentColor = gameState.currentPlayer === "white" ? "black" : "white"
      const causesCheck = isInCheck(newBoard, opponentColor)

      console.log(`Move from ${from.row},${from.col} to ${to.row},${to.col} causes check: ${causesCheck}`)

      const shouldChangeTurn = causesCheck || newMovesRemaining === 0

      const move: Move = {
        from,
        to,
        piece,
        capturedPiece,
        notation: getMoveNotation(gameState.board, from, to, piece, capturedPiece),
        promotionPiece,
        isCheck: causesCheck,
        turnChange: shouldChangeTurn,
      }

      setLastMove({ from, to })

      if (shouldChangeTurn) {
        console.log(`Changing turn to ${opponentColor}`)

        if (mode === "chaos") {
          // Chaos mode: get 4 pieces for opponent
          const newPieces = getChaosModePieces(newBoard, opponentColor)
          setChaosPieces(newPieces)

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            currentPlayer: opponentColor,
            selectedPieces: newPieces, // Use all 4 pieces directly
            usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
            movesRemaining: 3,
            moveHistory: [...prev.moveHistory, move],
            lastMove: move,
            enPassantTarget: undefined,
          }))

          // Check for triple bonus in chaos mode
          const pieceCounts: Record<string, number> = {}
          newPieces.forEach((p) => {
            pieceCounts[p] = (pieceCounts[p] || 0) + 1
          })

          const tripleType = Object.entries(pieceCounts).find(([, count]) => count >= 3)?.[0]
          if (tripleType) {
            setBonusPieceType(tripleType)
            setShowBonusNotification(true)

            setGameState((prev) => ({
              ...prev,
              rerollsLeft: {
                ...prev.rerollsLeft,
                [opponentColor]: prev.rerollsLeft[opponentColor] + 1,
              },
            }))
          }
        } else {
          // Normal modes
          const result = getRandomPieces(newBoard, opponentColor)

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            currentPlayer: opponentColor,
            selectedPieces: result.pieces,
            usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
            movesRemaining: 3,
            moveHistory: [...prev.moveHistory, move],
            lastMove: move,
            enPassantTarget: undefined,
          }))

          // Check for triple bonus
          if (result.hasTriple && result.tripleType) {
            setBonusPieceType(result.tripleType)
            setShowBonusNotification(true)

            setGameState((prev) => ({
              ...prev,
              rerollsLeft: {
                ...prev.rerollsLeft,
                [opponentColor]: prev.rerollsLeft[opponentColor] + 1,
              },
            }))
          }
        }

        // Reset turn timer for blitz mode
        if (mode === "blitz" && timerRef.current) {
          timerRef.current.resetTurn()
        }
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

      if (capturedPiece) {
        playSound("capture")
      } else {
        playSound("move")
      }
    },
    [gameState, playSound, mode],
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

      playSound("click")
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
        // For chaos mode, count how many of this piece type we have from the 4 rolled pieces
        let availableCount: number
        if (mode === "chaos") {
          availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        } else {
          availableCount = gameState.selectedPieces.filter((p) => p === piece.type).length
        }

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
    [
      gameState,
      selectedSquare,
      validMoves,
      calculateValidMoves,
      pendingPromotion,
      executeMoveAndCheckForCheck,
      playSound,
      mode,
    ],
  )

  const handleReroll = useCallback(() => {
    if (gameState.rerollsLeft[gameState.currentPlayer] > 0) {
      if (mode === "chaos") {
        // Chaos mode: get 4 new pieces
        const newPieces = getChaosModePieces(gameState.board, gameState.currentPlayer)
        setChaosPieces(newPieces)

        setGameState((prev) => ({
          ...prev,
          selectedPieces: newPieces, // Use all 4 pieces directly
          usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
          rerollsLeft: {
            ...prev.rerollsLeft,
            [prev.currentPlayer]: prev.rerollsLeft[prev.currentPlayer] - 1,
          },
        }))

        // Check for triple bonus in chaos mode
        const pieceCounts: Record<string, number> = {}
        newPieces.forEach((piece) => {
          pieceCounts[piece] = (pieceCounts[piece] || 0) + 1
        })

        const tripleType = Object.entries(pieceCounts).find(([, count]) => count >= 3)?.[0]
        if (tripleType) {
          setBonusPieceType(tripleType)
          setShowBonusNotification(true)

          setGameState((prev) => ({
            ...prev,
            rerollsLeft: {
              ...prev.rerollsLeft,
              [prev.currentPlayer]: prev.rerollsLeft[prev.currentPlayer] + 1,
            },
          }))
        }
      } else {
        // Normal modes
        const result = getRandomPieces(gameState.board, gameState.currentPlayer)

        console.log(`${gameState.currentPlayer} used reroll. New pieces:`, result.pieces)

        setGameState((prev) => ({
          ...prev,
          selectedPieces: result.pieces,
          usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
          rerollsLeft: {
            ...prev.rerollsLeft,
            [prev.currentPlayer]: prev.rerollsLeft[prev.currentPlayer] - 1,
          },
        }))

        // Check for triple bonus
        if (result.hasTriple && result.tripleType) {
          setBonusPieceType(result.tripleType)
          setShowBonusNotification(true)

          setGameState((prev) => ({
            ...prev,
            rerollsLeft: {
              ...prev.rerollsLeft,
              [prev.currentPlayer]: prev.rerollsLeft[prev.currentPlayer] + 1,
            },
          }))
        }
      }

      setSelectedSquare(null)
      setValidMoves([])
      playSound("reroll")
    }
  }, [gameState.currentPlayer, gameState.rerollsLeft, gameState.board, playSound, mode])

  const handleNewGame = useCallback(() => {
    const initialBoard = createInitialBoard()

    if (mode === "chaos") {
      const initialPieces = getChaosModePieces(initialBoard, "white")
      setChaosPieces(initialPieces)

      setGameState({
        board: initialBoard,
        currentPlayer: "white",
        selectedPieces: initialPieces, // Use all 4 pieces directly
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        movesRemaining: 3,
        rerollsLeft: { white: 2, black: 2 },
        isInCheck: false,
        gameOver: false,
        moveHistory: [],
      })
    } else {
      const initialResult = getRandomPieces(initialBoard, "white")
      setGameState({
        board: initialBoard,
        currentPlayer: "white",
        selectedPieces: initialResult.pieces,
        usedPiecesCount: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        movesRemaining: 3,
        rerollsLeft: { white: 2, black: 2 },
        isInCheck: false,
        gameOver: false,
        moveHistory: [],
      })
    }

    setSelectedSquare(null)
    setValidMoves([])
    setLastMove(null)
    setPendingPromotion(null)
    setShowBonusNotification(false)

    if (timerRef.current) {
      timerRef.current.reset()
    }
  }, [mode])

  const canReroll =
    !gameState.gameOver &&
    gameState.movesRemaining === 3 &&
    Object.values(gameState.usedPiecesCount).every((count) => count === 0)
  const canMove = canCurrentPlayerMove()

  const getModeTitle = () => {
    switch (mode) {
      case "blitz":
        return "Chế độ Chớp Nhoáng"
      case "ai":
        return "Đấu với Máy"
      case "chaos":
        return "Chế độ Hỗn Loạn"
      default:
        return "Cờ Vua Ngẫu Nhiên"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBackToMenu} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu chính
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">{getModeTitle()}</h1>
            <p className="text-amber-700">
              {mode === "chaos"
                ? "Quay 4 quân, sử dụng theo số lượng"
                : mode === "blitz"
                  ? "30 giây mỗi lượt - Tốc độ cao!"
                  : "Mỗi lượt quay 3 loại quân cờ để di chuyển"}
            </p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            <GameTimer
              ref={timerRef}
              currentPlayer={gameState.currentPlayer}
              gameOver={gameState.gameOver}
              mode={mode}
              onTimeUp={handleTimeUp}
            />

            <PieceSelector
              selectedPieces={gameState.selectedPieces}
              usedPiecesCount={gameState.usedPiecesCount}
              movesRemaining={gameState.movesRemaining}
              rerollsLeft={gameState.rerollsLeft[gameState.currentPlayer]}
              onReroll={handleReroll}
              canReroll={canReroll}
              isChaosModeActive={mode === "chaos"}
              chaosPieces={chaosPieces}
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

            {/* Hints */}
            {hints.length > 0 && settings.hintsEnabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-2">💡 Gợi ý</h4>
                <div className="space-y-1">
                  {hints.slice(0, 2).map((hint, index) => (
                    <p key={index} className="text-sm text-blue-700">
                      {hint.reason}: {String.fromCharCode(97 + hint.from.col)}
                      {8 - hint.from.row} → {String.fromCharCode(97 + hint.to.col)}
                      {8 - hint.to.row}
                    </p>
                  ))}
                </div>
              </div>
            )}
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

        {/* Modals and Dialogs */}
        {pendingPromotion && <PromotionDialog color={gameState.currentPlayer} onSelect={handlePromotion} />}

        {showBonusNotification && (
          <BonusNotification
            show={showBonusNotification}
            onClose={() => setShowBonusNotification(false)}
            pieceType={bonusPieceType}
          />
        )}
      </div>
    </div>
  )
}
