"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  originalWord: string;
  swappedWord: string;
}

const LetterSwap = ({ originalWord, swappedWord }: Props) => {
  const letterWidth = 20; // Width of each letter in pixels
  const letterSpacing = 10; // Space between letters in pixels

  const letterVariants = {
    initial: (i: number) => ({
      left: i * (letterWidth + letterSpacing),
      transition: {
        duration: 1,
        delay: i * 0.2,
      },
    }),
    animate: (i: number) => ({
      left:
        swappedWord.indexOf(originalWord[i]) * (letterWidth + letterSpacing),
      transition: {
        duration: 1,
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        repeatDelay: 1.5,
      },
    }),
  };
  return (
    <div
      className=" text-5xl font-bold relative flex items-center justify-center"
      style={{
        width: originalWord.length * (letterWidth + letterSpacing),
        height: 50,
      }}
    >
      {originalWord.split("").map((letter, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={letterVariants}
          initial="initial"
          animate="animate"
          className="absolute inline-block font-bold"
          style={{ width: letterWidth, fontWeight: 700 }}
        >
          <span
            className={`flex font-bold items-center justify-center text-5xl`}
          >
            {letter}
          </span>
        </motion.span>
      ))}
    </div>
  );
};

export default LetterSwap;
