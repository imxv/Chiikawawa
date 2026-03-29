import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2.5 text-sm text-white shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
