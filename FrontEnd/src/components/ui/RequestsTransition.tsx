"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface RequestsTransitionProps {
  children: ReactNode;
}

export default function RequestsTransition({
  children,
}: RequestsTransitionProps) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
