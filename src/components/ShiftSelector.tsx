'use client'

import { motion } from 'framer-motion'

interface ShiftSelectorProps {
  onShiftSelect: (shift: 'A' | 'B') => void
}

export default function ShiftSelector({ onShiftSelect }: ShiftSelectorProps) {
  return (
    <div className="text-center my-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          اختر الوجبة الدراسية
        </h2>
      </motion.div>

      <div className="space-y-8">
        {/* الوجبة الأولى */}
        <motion.button
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onShiftSelect('A')}
          className="w-full relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            borderRadius: '0 25px 25px 0',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
          }}
        >
          <div className="flex items-center p-8 relative z-10">
            {/* الكرة على اليسار مع تأثير النبضة */}
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center pulse-circle mr-4">
              <span className="text-white font-black text-2xl">A</span>
            </div>

            {/* النص في الوسط */}
            <div className="flex-1 text-center">
              <h3 className="text-2xl font-black text-white">الوجبة الأولى</h3>
            </div>
          </div>

          {/* تأثير الإضاءة */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
        </motion.button>

        {/* الوجبة الثانية */}
        <motion.button
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onShiftSelect('B')}
          className="w-full relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #0891b2, #0e7490)',
            borderRadius: '0 25px 25px 0',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 25px rgba(8, 145, 178, 0.4)',
          }}
        >
          <div className="flex items-center p-8 relative z-10">
            {/* الكرة على اليسار مع تأثير النبضة */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center pulse-circle mr-4">
              <span className="text-white font-black text-2xl">B</span>
            </div>

            {/* النص في الوسط */}
            <div className="flex-1 text-center">
              <h3 className="text-2xl font-black text-white">الوجبة الثانية</h3>
            </div>
          </div>

          {/* تأثير الإضاءة */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
        </motion.button>
      </div>


    </div>
  )
}
