export type GameMode = "classic" | "blitz" | "ai" | "chaos"

export interface GameSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
  hintsEnabled: boolean
  autoSave: boolean
  theme: "light" | "dark"
}

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  totalPlayTime: number
  averageGameTime: number
  longestWinStreak: number
  currentWinStreak: number
  pieceUsageStats: Record<string, number>
  gameModeStats: Record<GameMode, { played: number; won: number }>
}

export interface GameModeConfig {
  timeLimit?: number // seconds per turn
  rerollsPerPlayer: number
  movesPerTurn: number
  piecesToSelect: number // how many pieces to roll
  piecesToUse: number // how many pieces can be used
  specialRules?: string[]
}
