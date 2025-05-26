"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Zap, Bot, Trophy, BarChart3, Settings, HelpCircle } from "lucide-react"
import type { GameMode } from "../types/game"

interface GameModeSelectorProps {
  onStartGame: (mode: GameMode) => void
  onShowStats: () => void
  onShowSettings: () => void
  onShowRules: () => void
}

export function GameModeSelector({ onStartGame, onShowStats, onShowSettings, onShowRules }: GameModeSelectorProps) {
  const gameModes = [
    {
      id: "classic" as GameMode,
      title: "Cờ Vua Ngẫu Nhiên",
      description: "Chế độ chơi cơ bản với 3 quân mỗi lượt",
      icon: Crown,
      color: "bg-blue-500",
    },
    {
      id: "blitz" as GameMode,
      title: "Chế độ Chớp Nhoáng",
      description: "30 giây mỗi lượt, tốc độ cao",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      id: "ai" as GameMode,
      title: "Đấu với Máy",
      description: "Thách thức AI với nhiều mức độ khó",
      icon: Bot,
      color: "bg-green-500",
    },
    {
      id: "chaos" as GameMode,
      title: "Chế độ Hỗn Loạn",
      description: "Quay 4 quân, chọn 3 để sử dụng",
      icon: Trophy,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-amber-900 mb-4">Cờ Vua Ngẫu Nhiên</h1>
        <p className="text-xl text-amber-700 mb-6">Trải nghiệm cờ vua hoàn toàn mới với yếu tố ngẫu nhiên</p>

        {/* Header buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={onShowRules} variant="outline" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            Luật chơi
          </Button>
          <Button onClick={onShowStats} variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Thống kê
          </Button>
          <Button onClick={onShowSettings} variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {gameModes.map((mode) => {
          const IconComponent = mode.icon
          return (
            <Card
              key={mode.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => onStartGame(mode.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-4">{mode.description}</p>
                <Button className="w-full" onClick={() => onStartGame(mode.id)}>
                  Bắt đầu
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">🎉 Tính năng mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  ✨
                </div>
                <h4 className="font-medium mb-2">Hiệu ứng âm thanh</h4>
                <p className="text-sm text-gray-600">Âm thanh sống động cho mọi hành động</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎯
                </div>
                <h4 className="font-medium mb-2">Gợi ý thông minh</h4>
                <p className="text-sm text-gray-600">AI gợi ý nước đi tốt nhất</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📊
                </div>
                <h4 className="font-medium mb-2">Thống kê chi tiết</h4>
                <p className="text-sm text-gray-600">Theo dõi tiến bộ của bạn</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  ⚡
                </div>
                <h4 className="font-medium mb-2">Hiệu ứng mượt mà</h4>
                <p className="text-sm text-gray-600">Animation đẹp mắt</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎲
                </div>
                <h4 className="font-medium mb-2">Bonus Triple</h4>
                <p className="text-sm text-gray-600">Quay 3 quân giống nhau = +1 reroll</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🤖
                </div>
                <h4 className="font-medium mb-2">Đấu với AI</h4>
                <p className="text-sm text-gray-600">Thách thức máy tính thông minh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
