"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from "react"

export interface CompareItem {
  id: string
  name: string
  provider: string
  price: number
  originalPrice?: number | null
  dataAmount?: number | null
  dataUnit?: string | null
  validityDays?: number | null
  isUnlimited?: boolean
  supportsHotspot?: boolean
  supportsCalls?: boolean
  supportsSms?: boolean
  countries?: string[]
  networkType?: string | null
  slug: string
}

interface CompareState {
  items: CompareItem[]
  isOpen: boolean
}

type CompareAction =
  | { type: "ADD_ITEM"; payload: CompareItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "LOAD"; payload: CompareItem[] }

const MAX_COMPARE = 4

function compareReducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.items.length >= MAX_COMPARE) return state
      if (state.items.some((i) => i.id === action.payload.id)) return state
      return { ...state, items: [...state.items, action.payload] }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      }
    case "CLEAR":
      return { ...state, items: [], isOpen: false }
    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen }
    case "SET_OPEN":
      return { ...state, isOpen: action.payload }
    case "LOAD":
      return { ...state, items: action.payload }
    default:
      return state
  }
}

interface CompareContextValue {
  items: CompareItem[]
  isOpen: boolean
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  isInCompare: (id: string) => boolean
  toggleItem: (item: CompareItem) => void
  clear: () => void
  toggleDrawer: () => void
  setOpen: (open: boolean) => void
  isFull: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(compareReducer, {
    items: [],
    isOpen: false,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mobial_compare")
      if (saved) {
        const items = JSON.parse(saved) as CompareItem[]
        dispatch({ type: "LOAD", payload: items.slice(0, MAX_COMPARE) })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("mobial_compare", JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = useCallback((item: CompareItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }, [])

  const isInCompare = useCallback(
    (id: string) => state.items.some((i) => i.id === id),
    [state.items]
  )

  const toggleItem = useCallback(
    (item: CompareItem) => {
      if (state.items.some((i) => i.id === item.id)) {
        dispatch({ type: "REMOVE_ITEM", payload: item.id })
      } else {
        dispatch({ type: "ADD_ITEM", payload: item })
      }
    },
    [state.items]
  )

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [])
  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), [])
  const setOpen = useCallback((open: boolean) => dispatch({ type: "SET_OPEN", payload: open }), [])

  return (
    <CompareContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        isInCompare,
        toggleItem,
        clear,
        toggleDrawer,
        setOpen,
        isFull: state.items.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
