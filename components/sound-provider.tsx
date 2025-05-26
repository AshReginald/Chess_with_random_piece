"use client"

import type React from "react"

import { createContext, useContext, useCallback } from "react"

interface SoundContextType {
  playSound: (soundType: "move" | "capture" | "check" | "checkmate" | "click" | "reroll") => void
}

const SoundContext = createContext<SoundContextType>({
  playSound: () => {},
})

export function useSounds() {
  return useContext(SoundContext)
}

interface SoundProviderProps {
  children: React.ReactNode
  enabled: boolean
}

export function SoundProvider({ children, enabled }: SoundProviderProps) {
  const playSound = useCallback(
    (soundType: "move" | "capture" | "check" | "checkmate" | "click" | "reroll") => {
      if (!enabled) return

      // Create audio context and generate sounds programmatically
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different sounds for different actions
      switch (soundType) {
        case "move":
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(330, audioContext.currentTime + 0.1)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          break
        case "capture":
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.15)
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          break
        case "check":
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
          break
        case "checkmate":
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2)
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.4)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
          break
        case "click":
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          break
        case "reroll":
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(550, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          break
      }

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    },
    [enabled],
  )

  return <SoundContext.Provider value={{ playSound }}>{children}</SoundContext.Provider>
}
