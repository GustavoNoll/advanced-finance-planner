import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  position?: { top: number; left: number };
}

export const SuccessAnimation = ({ show, onComplete, position }: SuccessAnimationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50"
          style={position ? {
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -50%)'
          } : {
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="bg-white rounded-full p-4 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="text-green-500"
            >
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 