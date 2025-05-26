"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Gift } from "lucide-react"

interface BonusNotificationProps {
  show: boolean
  onClose: () => void
  pieceType: string
}

export function BonusNotification({ show, onClose, pieceType }: BonusNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation
  }

  if (!show) return null

  const pieceNames: Record<string, string> = {
    king: "Vua",
    queen: "Hậu",
    rook: "Xe",
    bishop: "Tượng",
    knight: "Mã",
    pawn: "Tốt",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card
        className={`w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h3 className="text-2xl font-bold text-yellow-600">TRIPLE BONUS!</h3>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium mb-2">🎉 Chúc mừng! 🎉</p>
            <p className="text-gray-700 mb-2">
              Bạn đã quay được <span className="font-bold text-blue-600">3 {pieceNames[pieceType]}</span> giống nhau!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-800 font-medium">
                🎁 Phần thưởng: <span className="text-green-600">+1 lượt Reroll</span>
              </p>
            </div>
            <p className="text-sm text-gray-600">Sử dụng cơ hội này để có lợi thế trong game!</p>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            Tuyệt vời! Tiếp tục chơi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
