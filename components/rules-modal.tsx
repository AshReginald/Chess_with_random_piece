"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Crown, Dice6, RotateCcw, Zap, Bot, Trophy } from "lucide-react"

interface RulesModalProps {
  onClose: () => void
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Luật chơi Cờ Vua Ngẫu Nhiên</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Rules */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Luật cơ bản
            </h3>
            <div className="space-y-2 text-sm">
              <p>• Mỗi lượt, hệ thống sẽ quay ngẫu nhiên 3 loại quân cờ</p>
              <p>• Bạn chỉ có thể di chuyển các loại quân đã được quay</p>
              <p>• Mỗi lượt có thể di chuyển tối đa 3 nước (mỗi loại quân 1 nước)</p>
              <p>• Nếu thực hiện nước chiếu, lượt sẽ chuyển ngay cho đối thủ</p>
              <p>• Các luật cờ vua cơ bản vẫn được áp dụng (nhập thành, phong cấp, bắt tốt qua đường...)</p>
            </div>
          </div>

          {/* Reroll System */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Dice6 className="w-5 h-5" />
              Hệ thống Reroll
            </h3>
            <div className="space-y-2 text-sm">
              <p>• Mỗi người chơi có 2 lượt reroll mỗi ván</p>
              <p>• Chỉ có thể reroll khi chưa di chuyển quân nào trong lượt</p>
              <p>• Khi bị chiếu, có thể dùng reroll để tìm quân phù hợp cản chiếu</p>
              <p>• Reroll sẽ quay lại 3 loại quân hoàn toàn mới</p>
            </div>
          </div>

          {/* Triple Bonus - NEW */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-800">
              🎲 Bonus Triple (MỚI!)
            </h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>
                • <strong>Khi quay được 3 quân cùng loại:</strong> Nhận thêm 1 lượt reroll miễn phí!
              </p>
              <p>• Ví dụ: Quay được 3 Mã → Được thêm 1 reroll</p>
              <p>• Bonus này có thể xảy ra nhiều lần trong một ván</p>
              <p>• Sử dụng thông minh để có lợi thế chiến thuật</p>
            </div>
          </div>

          {/* Win Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Điều kiện thắng
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                • <strong>Chiếu hết:</strong> Vua bị chiếu và không có cách cản + hết reroll
              </p>
              <p>
                • <strong>Hết thời gian:</strong> (Chế độ Blitz) Hết thời gian suy nghĩ
              </p>
              <p>
                • <strong>Đầu hàng:</strong> Người chơi chọn đầu hàng
              </p>
            </div>
          </div>

          {/* Game Modes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Các chế độ chơi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Cờ Vua Ngẫu Nhiên
                </h4>
                <p className="text-sm text-gray-600">Chế độ cơ bản, không giới hạn thời gian</p>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-yellow-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Chế độ Chớp Nhoáng
                </h4>
                <p className="text-sm text-gray-600">30 giây mỗi lượt, tốc độ cao</p>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-green-600 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Đấu với Máy
                </h4>
                <p className="text-sm text-gray-600">Thách thức AI với nhiều mức độ khó</p>
              </div>
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-purple-600 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Chế độ Hỗn Loạn
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>Quay 4 quân, chọn 3 để sử dụng</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Tính năng đặc biệt
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                • <strong>Gợi ý thông minh:</strong> Hệ thống sẽ gợi ý nước đi tốt nhất
              </p>
              <p>
                • <strong>Hoàn tác:</strong> Có thể hoàn tác 1 nước trong mỗi lượt
              </p>
              <p>
                • <strong>Tự động lưu:</strong> Game được lưu tự động
              </p>
              <p>
                • <strong>Thống kê:</strong> Theo dõi tỷ lệ thắng/thua và các chỉ số khác
              </p>
              <p>
                • <strong>Hiệu ứng âm thanh:</strong> Âm thanh cho các hành động trong game
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-amber-800">💡 Mẹo chơi</h3>
            <div className="space-y-1 text-sm text-amber-700">
              <p>• Luôn ưu tiên bảo vệ vua khi bị chiếu</p>
              <p>• Sử dụng reroll một cách thông minh, đặc biệt khi bị chiếu</p>
              <p>• Cố gắng tạo ra các nước chiếu để kết thúc lượt sớm</p>
              <p>• Quan sát kỹ các quân đối thủ có thể di chuyển</p>
              <p>• Sử dụng tính năng gợi ý khi gặp khó khăn</p>
              <p>
                • <strong>Mới:</strong> Cố gắng quay được 3 quân giống nhau để nhận bonus reroll!
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} className="px-8">
              Hiểu rồi, bắt đầu chơi!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
