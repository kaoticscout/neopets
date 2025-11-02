'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface RosterPet {
  petSlug: string
  petName: string
  colorSlug: string
  colorName: string
  gender: 'male' | 'female'
  imagePath: string
}

const STORAGE_KEY = 'neopets-roster'
const MAX_ROSTER_SIZE = 3

interface RosterContextType {
  roster: RosterPet[]
  addToRoster: (pet: RosterPet) => void
  removeFromRoster: (index: number) => void
  updateRosterItem: (index: number, pet: RosterPet) => void
  clearRoster: () => void
  isInRoster: (petSlug: string, colorSlug: string, gender: 'male' | 'female') => boolean
  isFull: boolean
}

const RosterContext = createContext<RosterContextType | undefined>(undefined)

export function RosterProvider({ children }: { children: ReactNode }) {
  const [roster, setRoster] = useState<RosterPet[]>([])

  // Load roster from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRoster(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load roster from localStorage:', error)
    }
  }, [])

  // Save roster to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (roster.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(roster))
      } else {
        // Clear if empty
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to save roster to localStorage:', error)
    }
  }, [roster])

  const addToRoster = useCallback((pet: RosterPet) => {
    setRoster((current) => {
      // Check if already in roster
      const exists = current.some(
        (r) => r.petSlug === pet.petSlug && r.colorSlug === pet.colorSlug && r.gender === pet.gender
      )

      if (exists) {
        return current // Already in roster
      }

      // If roster is full, replace the first one
      if (current.length >= MAX_ROSTER_SIZE) {
        return [pet, ...current.slice(0, MAX_ROSTER_SIZE - 1)]
      }

      return [pet, ...current]
    })
  }, [])

  const removeFromRoster = useCallback((index: number) => {
    setRoster((current) => current.filter((_, i) => i !== index))
  }, [])

  const updateRosterItem = useCallback((index: number, pet: RosterPet) => {
    setRoster((current) => {
      const updated = [...current]
      updated[index] = pet
      return updated
    })
  }, [])

  const clearRoster = useCallback(() => {
    setRoster([])
  }, [])

  const isInRoster = useCallback(
    (petSlug: string, colorSlug: string, gender: 'male' | 'female') => {
      return roster.some(
        (r) => r.petSlug === petSlug && r.colorSlug === colorSlug && r.gender === gender
      )
    },
    [roster]
  )

  return (
    <RosterContext.Provider
      value={{
        roster,
        addToRoster,
        removeFromRoster,
        updateRosterItem,
        clearRoster,
        isInRoster,
        isFull: roster.length >= MAX_ROSTER_SIZE,
      }}
    >
      {children}
    </RosterContext.Provider>
  )
}

export function useRosterContext() {
  const context = useContext(RosterContext)
  if (context === undefined) {
    throw new Error('useRosterContext must be used within a RosterProvider')
  }
  return context
}
