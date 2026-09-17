"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface ParentGateProps {
  children: React.ReactNode;
}

export function ParentGate({ children }: ParentGateProps) {
  const [showGate, setShowGate] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Simple parent gate: requires typing "PARENT" or a custom code
  const GATE_CODE = "PARENT";

  const handleVerify = () => {
    if (code.toUpperCase() === GATE_CODE) {
      setShowGate(false);
      setCode("");
      setError("");
      router.push("/parent/auth");
    } else {
      setError("Incorrect code. Ask a parent for help.");
      setCode("");
    }
  };

  return (
    <>
      {/* The protected content (button/link) */}
      <div onClick={() => setShowGate(true)}>
        {children}
      </div>

      {/* Gate modal */}
      <AnimatePresence>
        {showGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowGate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowGate(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-primary" weight="duotone" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground text-center mb-2">
                Parent Area
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                This area is for parents only. Please ask a parent to enter the access code.
              </p>

              {/* Code input */}
              <div className="space-y-4">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerify();
                  }}
                  placeholder="Enter parent code"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-center text-lg tracking-widest"
                  autoFocus
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  onClick={handleVerify}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 rounded-xl transition-all"
                >
                  Enter
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                💡 Default code: &quot;PARENT&quot;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
