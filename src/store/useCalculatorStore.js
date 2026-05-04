import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluateMath, evaluateStrict, isErrorResult } from '../engine/mathEngine';

export const useCalculatorStore = create(
  persist(
    (set, get) => ({
      // State
      expression: '',
      result: '',
      history: [],
      isBasicMode: false,
      angleMode: 'DEG',
      isEvaluated: false,
      theme: 'dark',

      // Actions
      setExpression: (newExpr) => set((state) => ({
        expression: newExpr,
        result: evaluateMath(newExpr, state.angleMode),
        isEvaluated: false,
      })),

      calculate: () => set((state) => {
        if (!state.expression) return state;

        const finalResult = evaluateStrict(state.expression, state.angleMode);
        const isError = isErrorResult(finalResult);

        let newHistory = state.history;
        if (!isError && state.expression.trim() !== finalResult) {
          newHistory = [
            { expr: state.expression, res: finalResult, id: Date.now() },
            ...state.history,
          ].slice(0, 50);
        }

        return {
          result: finalResult,
          isEvaluated: !isError, // Fix 1.4: si hay error, NO marcamos como evaluado
          history: newHistory,
        };
      }),

      // Fix 1.4: si el estado previo es un error, limpiar expression antes de
      // continuar. La UI llama esto cuando el usuario tipea después de un error.
      appendAfterError: (char) => set((state) => {
        const base = OPERATORS.includes(char) && char !== '-' ? '0' : '';
        const newExpr = base + char;
        return {
          expression: newExpr,
          result: evaluateMath(newExpr, state.angleMode),
          isEvaluated: false,
        };
      }),

      clearExpression: () => set({ expression: '', result: '', isEvaluated: false }),

      setAngleMode: (mode) => set((state) => ({
        angleMode: mode,
        result: evaluateMath(state.expression, mode),
      })),

      toggleMode: () => set((state) => ({ isBasicMode: !state.isBasicMode })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      clearHistory: () => set({ history: [] }),
      removeHistoryItem: (id) => set((state) => ({ history: state.history.filter(h => h.id !== id) })),

      loadHistory: (expr) => set((state) => ({
        expression: expr,
        result: evaluateMath(expr, state.angleMode),
        isEvaluated: false,
      })),
    }),
    {
      name: 'calculator-storage',
      partialize: (state) => ({
        history: state.history,
        isBasicMode: state.isBasicMode,
        angleMode: state.angleMode,
        theme: state.theme,
      }),
    }
  )
);

const OPERATORS = ['+', '-', '×', '÷', '*', '/'];
