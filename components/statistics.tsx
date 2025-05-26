"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Clock, Target, TrendingUp } from "lucide-react"
import type { GameStats } from "../types/game"

interface StatisticsProps {
  onBack: () => void
}

export function Statistics({ onBack }: StatisticsProps) {
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    totalPlayTime: 0,
    averageGameTime: 0,
    longestWinStreak: 0,
    currentWinStreak: 0,
    pieceUsageStats: {
      king: 0,
      queen: 0,
      rook: 0,
      bishop: 0,
      knight: 0,
      pawn: 0,
    },
    gameModeStats: {
      classic: { played: 0, won: 0 },
      blitz: { played: 0, won: 0 },
      puzzle: { played: 0, won: 0 },
      chaos: { played: 0, won: 0 },
    },
  })

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("chess-stats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getMostUsedPiece = () => {
    const entries = Object.entries(stats.pieceUsageStats)
    const sorted = entries.sort(([, a], [, b]) => b - a)
    return sorted[0]?.[0] || "pawn"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-amber-900">Thống kê</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Games Played */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số ván đã chơi</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            <p className="text-xs text-muted-foreground">
              Thắng: {stats.gamesWon} | Thua: {stats.gamesLost}
            </p>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thắng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Chuỗi thắng hiện tại: {stats.currentWinStreak}</p>
          </CardContent>
        </Card>

        {/* Total Play Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thời gian</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalPlayTime)}</div>
            <p className="text-xs text-muted-foreground">Trung bình: {formatTime(stats.averageGameTime)}</p>
          </CardContent>
        </Card>

        {/* Longest Win Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chuỗi thắng dài nhất</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestWinStreak}</div>
            <p className="text-xs text-muted-foreground">Quân hay dùng nhất: {getMostUsedPiece()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Mode Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo chế độ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.gameModeStats).map(([mode, modeStats]) => {
                const modeWinRate = modeStats.played > 0 ? (modeStats.won / modeStats.played) * 100 : 0
                const modeNames = {
                  classic: "Cờ Vua Ngẫu Nhiên",
                  blitz: "Chế độ Chớp Nhoáng",
                  puzzle: "Chế độ Giải Đố",
                  chaos: "Chế độ Hỗn Loạn",
                }

                return (
                  <div key={mode} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{modeNames[mode as keyof typeof modeNames]}</p>
                      <p className="text-sm text-gray-600">
                        {modeStats.played} ván | {modeStats.won} thắng
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{modeWinRate.toFixed(1)}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Piece Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê sử dụng quân cờ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.pieceUsageStats)
                .sort(([, a], [, b]) => b - a)
                .map(([piece, count]) => {
                  const pieceNames = {
                    king: "Vua",
                    queen: "Hậu",
                    rook: "Xe",
                    bishop: "Tượng",
                    knight: "Mã",
                    pawn: "Tốt",
                  }
                  const maxCount = Math.max(...Object.values(stats.pieceUsageStats))
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

                  return (
                    <div key={piece} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{pieceNames[piece as keyof typeof pieceNames]}</span>
                        <span>{count} lần</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.gamesPlayed === 0 && (
        <div className="text-center mt-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có dữ liệu</h3>
              <p className="text-gray-600 mb-4">Hãy chơi một vài ván để xem thống kê của bạn!</p>
              <Button onClick={onBack}>Bắt đầu chơi</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
