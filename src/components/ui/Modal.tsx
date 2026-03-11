"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  dark?: boolean;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  dark = false,
  children,
  maxWidth = "560px",
}: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const borderColor = dark
    ? "rgba(226,232,240,0.1)"
    : "rgba(26,26,46,0.1)";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 60,
            }}
          />

          {/* Dialog */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 61,
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="modal-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth,
                maxHeight: "90vh",
                background: dark ? "#0f172a" : "#faf8f5",
                border: `1px solid ${borderColor}`,
                borderRadius: "16px",
                boxShadow: dark
                  ? "0 24px 60px rgba(0,0,0,0.6)"
                  : "0 24px 60px rgba(26,26,46,0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                pointerEvents: "auto",
              }}
            >
              {/* Header */}
              {title && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.125rem 1.375rem",
                    borderBottom: `1px solid ${borderColor}`,
                    flexShrink: 0,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.0625rem",
                      color: dark ? "#e2e8f0" : "#1a1a2e",
                      margin: 0,
                    }}
                  >
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      border: `1px solid ${borderColor}`,
                      background: "transparent",
                      color: dark
                        ? "rgba(226,232,240,0.5)"
                        : "rgba(26,26,46,0.5)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Body */}
              <div
                style={{
                  padding: "1.375rem",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
