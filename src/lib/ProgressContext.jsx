import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as P from './progress.js'

const Ctx = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => P.loadState())
  useEffect(() => {
    P.saveState(state)
  }, [state])

  const answer = useCallback((qid, ok) => setState((s) => P.recordAnswer(s, qid, ok)), [])
  const answerMany = useCallback((results) => setState((s) => P.recordAnswers(s, results)), [])
  const toggleHard = useCallback((qid) => setState((s) => P.toggleHard(s, qid)), [])
  const setFlash = useCallback((qid, v) => setState((s) => P.setFlash(s, qid, v)), [])
  const addHistory = useCallback((e) => setState((s) => P.addHistory(s, e)), [])
  const reset = useCallback(() => setState(P.emptyState()), [])

  const value = useMemo(
    () => ({ state, answer, answerMany, toggleHard, setFlash, addHistory, reset }),
    [state, answer, answerMany, toggleHard, setFlash, addHistory, reset],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useProgress() {
  return useContext(Ctx)
}
