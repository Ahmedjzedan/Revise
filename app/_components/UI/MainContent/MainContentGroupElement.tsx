"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import chevron from "@/public/svgs/chevron.svg";
import { Node } from "@/app/_db/schema";
import MainContentElement from "@/app/_components/UI/MainContent/MainContentElement";

interface BaseElementProps {
  id: string;
  active?: boolean;
  title?: string;
}

interface MainContentGroupElementProps extends BaseElementProps {
  initialChildren?: Node[];
}

const MainContentGroupElement: React.FC<MainContentGroupElementProps> = ({
  active = false,
  title,
  initialChildren = [],
}) => {
  const [isactive, setIsactive] = useState(active);
  const [childrenProgress, setChildrenProgress] = useState<
    Record<string, { fill: number; maxFill: number }>
  >(() => {
    const initialProgress: Record<string, { fill: number; maxFill: number }> =
      {};
    initialChildren.forEach((child) => {
      initialProgress[child.id.toString()] = {
        fill: child.fullness,
        maxFill: child.maximum,
      };
    });
    return initialProgress;
  });

  // EXPERIMENTAL CHANGE 1: Initialize fill and maxFill state by summing up the children's initial values.
  const [fill, setFill] = useState(() => {
    return initialChildren.reduce((acc, child) => acc + child.fullness, 0);
  });
  const [maxFill, setMaxFill] = useState(() => {
    return initialChildren.reduce((acc, child) => acc + child.maximum, 0);
  });

  // EXPERIMENTAL CHANGE 2: The useEffect now calculates the total progress instead of counting completed children.
  useEffect(() => {
    const progressValues = Object.values(childrenProgress);

    // Use reduce to sum the fill and maxFill from all children
    const totals = progressValues.reduce(
      (acc, current) => {
        acc.totalFill += current.fill;
        acc.totalMaxFill += current.maxFill;
        return acc;
      },
      { totalFill: 0, totalMaxFill: 0 },
    );

    setFill(totals.totalFill);
    setMaxFill(totals.totalMaxFill);
  }, [childrenProgress]); // This dependency is still correct.

  // The handleChildUpdate function doesn't need to change at all. It already
  // provides the necessary data to trigger the useEffect above.
  const handleChildUpdate = useCallback((id: string, newFill: number) => {
    setChildrenProgress((prevProgress) => {
      if (!prevProgress[id]) {
        return prevProgress;
      }
      const newProgress = {
        ...prevProgress,
        [id]: {
          fill: newFill,
          maxFill: prevProgress[id].maxFill,
        },
      };
      console.log("updated children: ", newProgress);
      return newProgress;
    });
  }, []);

  // This calculation also works perfectly with the new decimal/aggregate values. No change needed.
  var widthFill = maxFill > 0 ? (fill / maxFill) * 100 : 0;

  return (
    <>
      <button
        className={
          `group relative flex items-center justify-between h-20 rounded-xl border-white hover:bg-neutral-400
           mt-5 mx-10 text-2xl pl-10 cursor-pointer bg-[#2C2C2C] z-0 transition-all duration-500 hover:scale-101
           shadow-[inset_0_0_0_2px_white] ` +
          (isactive ? "scale-105 hover:scale-104" : "")
        }
        onClick={() => {
          setIsactive(!isactive);
        }}
      >
        <motion.div
          className={
            `absolute inset-0 group-hover:bg-neutral-400 bg-black z-1 ` +
            (fill === maxFill && maxFill > 0
              ? "rounded-xl"
              : "rounded-l-xl rounded-r-[0px]")
          }
          initial={{ width: 0 }}
          animate={{ width: `${widthFill}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        ></motion.div>

        <motion.div
          className={
            `absolute inset-0 backdrop-invert-100 z-10 ` +
            (fill === maxFill && maxFill > 0
              ? "rounded-l-[12px] rounded-r-[12px]"
              : "rounded-l-[12px] rounded-r-[0px]")
          }
          initial={{ width: 0 }}
          animate={{ width: `${widthFill}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        ></motion.div>

        <span className="z-2 transition-colors duration-300 text-white group-hover:text-black">
          {title}
        </span>

        <div className="flex gap-4 items-center h-full">
          <span
            className="text-md px-4 py-2 flex items-center justify-center rounded-md bg-white text-neutral-900 z-2 whitespace-nowrap
               group-hover:bg-black group-hover:text-white transition-all duration-500"
          >
            {/* This will now display the aggregate progress, e.g., "15.5 / 30" */}
            {Number(fill.toFixed(2))} / {maxFill}
          </span>
          <div
            className={
              "h-full w-1/2 flex items-center justify-center rounded-r-[12px] bg-white text-black z-5 transition-all duration-1000 " +
              (fill === maxFill && maxFill > 0
                ? "shadow-[inset_0_0_0_3px_black]"
                : "")
            }
          >
            <Image
              className={
                "-rotate-0 px-2 box-border transition-transform duration-500 " +
                (isactive ? "rotate-180" : "")
              }
              src={chevron}
              width={40}
              height={20}
              alt="chevron"
            ></Image>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isactive && (
          <motion.div
            className="flex flex-col scale-90"
            key="animated-children-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {initialChildren.map((childNode) => (
              <MainContentElement
                key={childNode.id}
                id={childNode.id.toString()}
                title={childNode.name}
                fillProp={childNode.fullness}
                maxFillProp={childNode.maximum}
                isChild={true}
                onUpdate={handleChildUpdate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainContentGroupElement;
