"use client";

import * as React from "react";
import { Delete, X } from "lucide-react";
import { cn } from "@/lib/utils";

function evaluateSafeArithmetic(expr: string): string {
  const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, "").trim();
  if (!sanitized) return "0";
  // Simple shunting-yard parser for + - * / % and parentheses
  const tokens = sanitized.match(/(\d+\.?\d*|\.\d+|[+\-*/()%])/g);
  if (!tokens) return "Error";

  const output: (number | string)[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!Number.isNaN(Number(t))) {
      output.push(Number(t));
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        output.push(ops.pop()!);
      }
      if (!ops.length) return "Error";
      ops.pop();
    } else if (t in prec) {
      // Handle unary minus at start or after '(' or operator
      const prev = tokens[i - 1];
      if (
        t === "-" &&
        (i === 0 || prev === "(" || (prev && prev in prec)) &&
        tokens[i + 1] &&
        !Number.isNaN(Number(tokens[i + 1]))
      ) {
        output.push(-Number(tokens[i + 1]));
        i++;
        continue;
      }
      while (
        ops.length &&
        ops[ops.length - 1] !== "(" &&
        prec[ops[ops.length - 1]] >= prec[t]
      ) {
        output.push(ops.pop()!);
      }
      ops.push(t);
    }
  }
  while (ops.length) {
    const op = ops.pop()!;
    if (op === "(") return "Error";
    output.push(op);
  }

  const stack: number[] = [];
  for (const item of output) {
    if (typeof item === "number") {
      stack.push(item);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return "Error";
      if (item === "+") stack.push(a + b);
      else if (item === "-") stack.push(a - b);
      else if (item === "*") stack.push(a * b);
      else if (item === "/") stack.push(b === 0 ? NaN : a / b);
      else if (item === "%") stack.push(b === 0 ? NaN : a % b);
    }
  }
  const result = stack[0];
  if (result === undefined || !Number.isFinite(result)) return "Error";
  return Number.isInteger(result)
    ? String(result)
    : String(Number(result.toFixed(6)));
}

const KEYS = [
  ["C", "(", ")", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "DEL", "="],
];

export function ExamCalculator({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expr, setExpr] = React.useState("");
  const [display, setDisplay] = React.useState("0");

  if (!open) return null;

  const handlePress = (key: string) => {
    if (key === "C") {
      setExpr("");
      setDisplay("0");
      return;
    }
    if (key === "DEL") {
      const next = expr.slice(0, -1);
      setExpr(next);
      setDisplay(next || "0");
      return;
    }
    if (key === "=") {
      const res = evaluateSafeArithmetic(expr);
      setDisplay(res);
      setExpr(res === "Error" ? "" : res);
      return;
    }
    const next = expr + key;
    setExpr(next);
    setDisplay(next);
  };

  return (
    <div
      role="dialog"
      aria-label="Exam Calculator"
      className="fixed bottom-4 right-4 z-50 w-72 rounded-3xl border-2 border-brand-200 bg-surface-porcelain p-4 shadow-gloss-float"
    >
      <div className="flex items-center justify-between pb-2 border-b border-brand-100">
        <span className="font-display text-xs font-extrabold text-brand-950">
          CBT Calculator
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close calculator"
          className="grid h-7 w-7 place-items-center rounded-pill bg-surface-pearl text-brand-700 hover:bg-brand-100 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="my-3 rounded-2xl border-2 border-brand-100 bg-brand-950 px-3.5 py-2.5 text-right text-ink-on-blue">
        <p className="truncate font-mono text-[11px] text-accent-sky">
          {expr || "0"}
        </p>
        <p className="truncate font-mono text-xl font-extrabold">{display}</p>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {KEYS.flat().map((key) => {
          const isEquals = key === "=";
          const isOp = ["/", "*", "-", "+"].includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => handlePress(key)}
              className={cn(
                "flex h-10 items-center justify-center rounded-xl font-display text-xs font-extrabold transition-all cursor-pointer",
                isEquals
                  ? "cta-surface-primary text-ink-on-blue"
                  : isOp
                    ? "bg-brand-100 text-brand-800 hover:bg-brand-200"
                    : key === "C"
                      ? "bg-surface-mist text-accent-warm-deep hover:bg-brand-100"
                      : "border border-brand-100 bg-surface-pearl text-brand-950 hover:bg-brand-50"
              )}
            >
              {key === "DEL" ? <Delete className="h-4 w-4" /> : key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

