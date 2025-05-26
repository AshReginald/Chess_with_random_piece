"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Volume2, Sparkles, Lightbulb, Save, Palette } from "lucide-react"
import type { GameSettings } from "../types/game"

interface SettingsProps {
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
  onBack: () => void
}

export function Settings({ settings, onSettingsChange, onBack }: SettingsProps) {
  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    onSettingsChange(newSettings)
    localStorage.setItem("chess-settings", JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    const defaultSettings: GameSettings = {
      soundEnabled: true,
      animationsEnabled: true,
      hintsEnabled: true,
      autoSave: true,
      theme: "light",
    }
    onSettingsChange(defaultSettings)
    localStorage.setItem("chess-settings", JSON.stringify(defaultSettings))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-amber-900">Cài đặt</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Âm thanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bật âm thanh</p>
                <p className="text-sm text-gray-600">Phát âm thanh cho các hành động trong game</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Hiệu ứng hình ảnh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bật hiệu ứng động</p>
                <p className="text-sm text-gray-600">Hiệu ứng mượt mà khi di chuyển quân cờ</p>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => handleSettingChange("animationsEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gameplay Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Hỗ trợ chơi game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Gợi ý thông minh</p>
                <p className="text-sm text-gray-600">Hiển thị gợi ý nước đi tốt nhất</p>
              </div>
              <Switch
                checked={settings.hintsEnabled}
                onCheckedChange={(checked) => handleSettingChange("hintsEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tự động lưu</p>
                <p className="text-sm text-gray-600">Tự động lưu tiến trình game</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Giao diện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium">Chủ đề</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  onClick={() => handleSettingChange("theme", "light")}
                  className="justify-start"
                >
                  ☀️ Sáng
                </Button>
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  onClick={() => handleSettingChange("theme", "dark")}
                  className="justify-start"
                >
                  🌙 Tối
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Đặt lại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Đặt lại cài đặt</p>
                <p className="text-sm text-gray-600">Khôi phục tất cả cài đặt về mặc định</p>
              </div>
              <Button variant="outline" onClick={resetSettings}>
                Đặt lại
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">💡</div>
              <div>
                <p className="font-medium text-blue-900">Mẹo</p>
                <p className="text-sm text-blue-700">
                  Tất cả cài đặt được lưu tự động và sẽ được khôi phục khi bạn quay lại game. Bạn có thể thay đổi cài
                  đặt bất cứ lúc nào trong game.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
