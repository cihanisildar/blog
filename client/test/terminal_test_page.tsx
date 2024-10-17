"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import { CalendarIcon, Clock3Icon, Minus, Send, Square, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LetterSwap from "@/components/letter-swap";

interface CommandItem {
  name: string;
  url: string;
}

interface Commands {
  help: string;
  about: string;
  skills: string;
  projects: CommandItem[];
  contact: CommandItem[];
  clear: string;
  joke: string[];
  quote: string[];
  easterEggs: Record<string, string>;
}
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
}

const commands: Commands = {
  help: "Available commands: about, skills, projects, contact,quote, clear",
  about:
    "I'm Chain, a passionate software developer with a love for clean code and innovative solutions.",
  skills: "JavaScript, TypeScript, React, Node.js, Python, Docker",
  projects: [
    {
      name: "Project1: A React-based task manager",
      url: "https://github.com/chaindev/project1",
    },
    {
      name: "Project2: ML-powered image classifier",
      url: "https://github.com/chaindev/project2",
    },
    {
      name: "Project3: Blockchain voting system",
      url: "https://github.com/chaindev/project3",
    },
  ],
  contact: [
    { name: "Email: chain@example.com", url: "mailto:chain@example.com" },
    { name: "GitHub: github.com/chaindev", url: "https://github.com/chaindev" },
    {
      name: "LinkedIn: linkedin.com/in/chaindev",
      url: "https://linkedin.com/in/chaindev",
    },
  ],
  clear: "Clearing terminal...",
  joke: [
    "Why do programmers prefer dark mode? Because the light attracts bugs!",
    "There are 10 types of people in the world: those who understand binary and those who don't.",
    "Why do Java developers wear glasses? Because they don't see sharp.",
  ],
  quote: [
    "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
    "“First, solve the problem. Then, write the code.” – John Johnson",
    "“Experience is the name everyone gives to their mistakes.” – Oscar Wilde",
  ],
  easterEggs: {
    "42": "The answer to life, the universe, and everything.",
    sudo: "Sorry, you are not authorized to use sudo.",
    rickroll: "Never gonna give you up, never gonna let you down...",
  },
};
const blogPosts: BlogPost[] = [
  {
    title: "Building Scalable React Applications",
    excerpt:
      "Learn the best practices for creating large-scale React apps that perform well and are easy to maintain.",
    date: "2024-03-15",
    readTime: "5 min read",
    slug: "building-scalable-react-applications",
  },
  {
    title: "The Power of TypeScript in Modern Web Development",
    excerpt:
      "Discover how TypeScript can improve your development workflow and catch errors before they happen.",
    date: "2024-03-10",
    readTime: "4 min read",
    slug: "power-of-typescript",
  },
  {
    title: "Exploring Machine Learning with Python",
    excerpt:
      "A beginner-friendly introduction to machine learning concepts using Python and popular libraries.",
    date: "2024-03-05",
    readTime: "6 min read",
    slug: "exploring-machine-learning-python",
  },
];

const TerminalPrompt: React.FC = () => {
  const initialOutput: React.ReactNode[] = [
    'Welcome! Type "help" to see available commands.',
  ];

  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<React.ReactNode[]>([
    "Welcome! Type 'help' to see available commands.",
  ]);
  const [cursorBlink, setCursorBlink] = useState<boolean>(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        if (commandHistory.length > 0 && historyIndex !== null) {
          const newIndex = Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else if (commandHistory.length > 0 && historyIndex === null) {
          setHistoryIndex(commandHistory.length - 1);
          setInput(commandHistory[commandHistory.length - 1]);
        }
      } else if (e.key === "ArrowDown" && historyIndex !== null) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || "");
      }
    },
    [commandHistory, historyIndex]
  );

  const getRandomQuote = () => {
    const quotes = commands.quote;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();
    let response: React.ReactNode;

    if (trimmedInput === "clear") {
      setOutput(initialOutput); // Reset to the initial state with the welcome message
      setInput("");
      setCommandHistory([]); // Optionally clear command history
      setHistoryIndex(null);
      return;
    }

    // Add the current input to the history
    setCommandHistory((prevHistory) => [...prevHistory, input]);
    setHistoryIndex(null); // Reset history index

    if (trimmedInput === "projects") {
      response = (
        <div className="pl-4">
          {commands.projects.map((project, index) => (
            <div key={index} className="pl-8">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {project.name}
              </a>
            </div>
          ))}
        </div>
      );
    } else if (trimmedInput === "help") {
      response = (
        <div className="flex flex-col gap-2 pl-8">
          <div className="flex flex-col">
            <strong>about:</strong>{" "}
            <span className="ml-4 text-gray-400">
              - Get information about the developer.
            </span>
          </div>
          <div className="flex flex-col">
            <strong>skills:</strong>
            <span className="ml-4 text-gray-400">
              - List the developer's skills.
            </span>
          </div>
          <div className="flex flex-col">
            <strong>projects:</strong>
            <span className="ml-4 text-gray-400">
              - Show the developer's projects.
            </span>
          </div>
          <div className="flex flex-col">
            <strong>contact:</strong>
            <span className="ml-4 text-gray-400">
              - Provide contact information.
            </span>
          </div>
          <div className="flex flex-col">
            <strong>quote:</strong>
            <span className="ml-4 text-gray-400">
              - Get a random motivational quote.
            </span>
          </div>
          <div className="flex flex-col">
            <strong>clear:</strong>
            <span className="ml-4 text-gray-400">
              - Clear the terminal output.
            </span>
          </div>
        </div>
      );
    } else if (trimmedInput === "contact") {
      response = (
        <div className="pl-8">
          {commands.contact.map((contact, index) => (
            <div key={index}>
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {contact.name}
              </a>
            </div>
          ))}
        </div>
      );
    } else if (trimmedInput === "quote") {
      response = (
        <div>
          <p className="text-green-300">{getRandomQuote()}</p>
        </div>
      );
    } else {
      response = (commands as any)[trimmedInput] || (
        <span className="text-red-400">
          Command not recognized. Type 'help' for available commands.
        </span>
      );
    }

    setOutput((prevOutput) => [
      ...prevOutput,
      <div key={prevOutput.length} className="mt-2">
        <span className="text-white">$ {input}</span>
        <div>{response}</div>
      </div>,
    ]);
    setInput("");
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(null);
  };

  return (
    <div className="bg-black text-green-400 border-[1px] border-slate-400 rounded-lg shadow-lg w-full overflow-hidden font-mono">
      <div className="bg-gray-800 p-2 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-300">chain@terminal:~</div>
        <div className="flex space-x-2">
          <Minus className="w-4 h-4 text-gray-400" />
          <Square className="w-4 h-4 text-gray-400" />
          <X className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div ref={terminalRef} className="p-2 overflow-y-auto h-[400px]">
        {output.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line}
          </motion.div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex px-2 py-1 border-t border-gray-700"
      >
        <span className="mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent focus:outline-none flex-grow"
          placeholder="Type a command..."
          autoFocus
        />
        <span className={`ml-1 ${cursorBlink ? "opacity-100" : "opacity-0"}`}>
          ▋
        </span>
      </form>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br px-8 from-gray-900 to-blue-900 text-white overflow-hidden flex flex-col">
      {/* <BackgroundBeamsWithCollision /> */}
      <div className=" px-4 py-8 flex flex-col">
        <header className="relative mb-6">
          <motion.div
            className="text-5xl w-full flex items-center justify-center font-bold mb-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-fit flex">
              <LetterSwap swappedWord="Cihan" originalWord="Chain" />
              <span>'s Dev Blog</span>
            </div>
          </motion.div>
          <motion.p
            className="text-lg text-gray-300 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to my blog I'm Cihan and here I document my latest
            explorations.
          </motion.p>
        </header>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-4"
        >
          Latest Posts
        </motion.h2>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          <motion.section
            className="lg:w-[60%] h-full grid space-y-2 overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="bg-white bg-opacity-10 rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:bg-opacity-20"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">{post.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <CalendarIcon size={12} className="mr-1" />
                    <time className="mr-2">{post.date}</time>
                    <Clock3Icon size={12} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
            <section className="bg-black bg-opacity-50 rounded-lg p-4 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Newsletter</h3>
              <form onSubmit={() => {}} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Your email"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button type="submit" className="w-full">
                  Subscribe <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </section>
          </motion.section>

          <motion.section
            className="lg:w-[40%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-black bg-opacity-50 rounded-lg p-4 shadow-md h-fit">
              <h3 className="text-xl font-semibold mb-4">
                Interactive Terminal
              </h3>
              <TerminalPrompt />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
