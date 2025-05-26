"use client"

import { useState } from "react"
import { GameModeSelector } from "./game-mode-selector"
import { RandomChessGame } from "./random-chess-game"
import { Statistics } from "./statistics"
import { Settings } from "./settings"
import { RulesModal } from "./rules-modal"
import { SoundProvider } from "./sound-provider"
import type { GameMode, GameSettings } from "../types/game"

export default function RandomChessApp() {
  const [currentView, setCurrentView] = useState<"menu" | "game" | "stats" | "settings">("menu")
  const [selectedMode, setSelectedMode] = useState<GameMode>("classic")
  const [showRules, setShowRules] = useState(false)
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    soundEnabled: true,
    animationsEnabled: true,
    hintsEnabled: true,
    autoSave: true,
    theme: "light",
  })

  const handleStartGame = (mode: GameMode) => {
    setSelectedMode(mode)
    setCurrentView("game")
  }

  const handleBackToMenu = () => {
    setCurrentView("menu")
  }

  return (
    <SoundProvider enabled={gameSettings.soundEnabled}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        {currentView === "menu" && (
          <GameModeSelector
            onStartGame={handleStartGame}
            onShowStats={() => setCurrentView("stats")}
            onShowSettings={() => setCurrentView("settings")}
            onShowRules={() => setShowRules(true)}
          />
        )}

        {currentView === "game" && (
          <RandomChessGame mode={selectedMode} settings={gameSettings} onBackToMenu={handleBackToMenu} />
        )}

        {currentView === "stats" && <Statistics onBack={handleBackToMenu} />}

        {currentView === "settings" && (
          <Settings settings={gameSettings} onSettingsChange={setGameSettings} onBack={handleBackToMenu} />
        )}

        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </div>
    </SoundProvider>
  )
}
