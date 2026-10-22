import * as React from "react"
import { Calculator as CalcIcon, X, Delete } from "lucide-react"

interface CbtCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CbtCalculatorModal({ isOpen, onClose }: CbtCalculatorModalProps) {
  const [display, setDisplay] = React.useState("0")
  const [prevValue, setPrevValue] = React.useState<number | null>(null)
  const [operation, setOperation] = React.useState<string | null>(null)
  const [clearOnNext, setClearOnNext] = React.useState(false)

  if (!isOpen) return null

  const handleDigit = (digit: string) => {
    if (display === "0" || clearOnNext) {
      setDisplay(digit)
      setClearOnNext(false)
    } else {
      if (display.length < 12) {
        setDisplay(display + digit)
      }
    }
  }

  const handleDecimal = () => {
    if (clearOnNext) {
      setDisplay("0.")
      setClearOnNext(false)
      return
    }
    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPrevValue(null)
    setOperation(null)
    setClearOnNext(false)
  }

  const handleDelete = () => {
    if (display.length <= 1) {
      setDisplay("0")
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const handleToggleSign = () => {
    const val = parseFloat(display)
    if (!isNaN(val)) {
      setDisplay((val * -1).toString())
    }
  }

  const handleSqrt = () => {
    const val = parseFloat(display)
    if (val >= 0) {
      const res = Math.sqrt(val)
      setDisplay(res.toString().slice(0, 12))
      setClearOnNext(true)
    } else {
      setDisplay("Error")
      setClearOnNext(true)
    }
  }

  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    if (prevValue !== null && operation) {
      calculate()
    } else {
      setPrevValue(current)
    }
    setOperation(op)
    setClearOnNext(true)
  }

  const calculate = () => {
    if (prevValue === null || !operation) return

    const current = parseFloat(display)
    let result: number

    switch (operation) {
      case "+":
        result = prevValue + current
        break
      case "-":
        result = prevValue - current
        break
      case "×":
        result = prevValue * current
        break
      case "÷":
        if (current === 0) {
          setDisplay("Error")
          setPrevValue(null)
          setOperation(null)
          setClearOnNext(true)
          return
        }
        result = prevValue / current
        break
      default:
        return
    }

    const resStr = result.toString()
    setDisplay(resStr.length > 12 ? result.toPrecision(8) : resStr)
    setPrevValue(result)
    setOperation(null)
    setClearOnNext(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="w-72 bg-card rounded-3xl border border-border shadow-2xl p-4 space-y-3">
        {/* Calc Header */}
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <CalcIcon className="size-4 text-primary" />
            <span className="text-xs font-bold text-foreground">JAMB Standard Calculator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* LCD Screen */}
        <div className="bg-muted/60 border border-border/80 rounded-2xl p-3 text-right">
          <span className="text-[10px] text-muted-foreground font-mono block h-4">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ""}
          </span>
          <span className="text-2xl font-mono font-extrabold text-foreground tracking-wider truncate block">
            {display}
          </span>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border flex items-center justify-center"
          >
            <Delete className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSqrt}
            className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border font-serif"
          >
            √
          </button>
          <button
            type="button"
            onClick={() => handleOperator("÷")}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            type="button"
            onClick={() => handleDigit("7")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit("8")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit("9")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperator("×")}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            type="button"
            onClick={() => handleDigit("4")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit("5")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit("6")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperator("-")}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            type="button"
            onClick={() => handleDigit("1")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit("2")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit("3")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperator("+")}
            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            type="button"
            onClick={handleToggleSign}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border text-[11px]"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDecimal}
            className="p-2.5 rounded-xl bg-card text-foreground hover:bg-muted border border-border font-mono"
          >
            .
          </button>
          <button
            type="button"
            onClick={calculate}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs font-bold text-sm"
          >
            =
          </button>
        </div>
      </div>
    </div>
  )
}
