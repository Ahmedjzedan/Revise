"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-thin tracking-widest">AHMED JZEDAN</h1>
          <h2 className="text-xl text-[var(--text-secondary)] font-light tracking-wide">Web Developer</h2>
        </div>

        <div className="space-y-6 text-lg font-light text-[var(--text-secondary)] leading-relaxed">
          <p>
            I am a passionate Web Developer dedicated to crafting seamless, high-performance, 
            and aesthetically pleasing digital experiences. With a keen eye for design and 
            a robust technical skillset, I build applications that not only work perfectly 
            but also leave a lasting impression.
          </p>
          <p>
            &quot;Revise&quot; is a testament to my belief in minimalist, functional design—where 
            every element serves a purpose, and the user experience is paramount.
          </p>
        </div>

        <div className="flex gap-6 mt-4">
          <a 
            href="https://github.com/Ahmedjzedan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-[var(--border-color)] px-6 py-3 rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/ahmedjzedan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-[var(--border-color)] px-6 py-3 rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300"
          >
            LinkedIn
          </a>
        </div>

        <div className="pt-10">
          <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm tracking-widest uppercase">
            ← Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
