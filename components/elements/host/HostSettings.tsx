"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IoSettingsOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const HostSettings = (props: {
  distance: number;
}) => {
  const [showConfigModal, setConfigModal] = useState(false);

  const openConfigModal = () => {
    setConfigModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeConfigModal = () => {
    setConfigModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      {/* 設定ボタン */}
      <div>
        <motion.button
          whileTap={{ scale: 0.8, rotate: -45 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={openConfigModal}
          className="ml-15 px-3 py-3 rounded-4xl bg-white"
          style={{
            color: "#7d7d7d",
            fontFamily: "NicoMoji",
            boxShadow: "0 6px 3px #dee6ee",
            border: "none",
          }}
        >
          <IoSettingsOutline className="text-3xl text-gray-600" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeConfigModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-8 rounded-lg relative w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={closeConfigModal}
                className="absolute top-3 right-3 text-4xl text-gray-400"
              >
                <RxCross1 className="text-gray-400 " />
              </motion.button>
              <p className="flex items-center justify-center font-semibold text-gray-600 text-2xl">
                設定
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostSettings;