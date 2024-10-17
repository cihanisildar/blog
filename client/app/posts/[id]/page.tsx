"use client";

import React, { useEffect, useState } from "react";
import { Post } from "@/models/post.model";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarIcon,
  Clock,
  Edit2Icon,
  Trash2Icon,
  Copy,
  Check,
} from "lucide-react";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  code: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`code-block relative my-8 rounded-lg font-mono overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-white shadow-md text-[#23272F] border-[1px] border-gray-200">
        <span className="text-sm font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-sm hover:text-white"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={prism}
        customStyle={{
          margin: 0,
          padding: "1.5em",
          fontSize: "14px",
          lineHeight: "1.5",
          backgroundColor: "white", // Tailwind's gray-800
          border: "1px solid 	#e5e7eb",
          borderTop: "0px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          borderTopRightRadius: "0px",
          borderTopLeftRadius: "0px",
        }}
        codeTagProps={{
          className: "syntax-highlighter-code font-mono",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

const SinglePostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [modifiedContent, setModifiedContent] = useState<string>("");

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/post/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === "success") {
          setPost(data.post);
          const updatedContent = data.post.content.replace(
            /<img src="([^"]+)"[^>]*>/g,
            `<img src="$1" class="w-full h-auto max-w-2xl mx-auto my-8 rounded-lg shadow-lg" />`
          );
          setModifiedContent(updatedContent);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const renderContent = () => {
    return parse(modifiedContent || "", {
      replace: (domNode: DOMNode) => {
        if (
          domNode instanceof Element &&
          (domNode.name === "pre" || domNode.attribs.class === "ql-syntax")
        ) {
          let code: string;
          let language = "typescript"; // default language
          let className = "text-lg"; // custom className for the code block

          if (
            domNode.name === "pre" &&
            domNode.children[0] instanceof Element &&
            domNode.children[0].name === "code"
          ) {
            // Handle <pre><code> structure
            const codeElement = domNode.children[0];
            const classNames = codeElement.attribs.class?.split(" ") || [];
            language =
              classNames
                .find((cls) => cls.startsWith("language-"))
                ?.replace("language-", "") || language;
            className = classNames
              .filter((cls) => !cls.startsWith("language-"))
              .join(" ");
            code = domToReact(codeElement.children as DOMNode[]) as string;
          } else {
            // Handle <pre class="ql-syntax"> structure
            code = domToReact(domNode.children as DOMNode[]) as string;
            className = domNode.attribs.class || "";
          }

          return (
            <CodeBlock
              language={language}
              code={String(code)}
              className={className}
            />
          );
        }
      },
    });
  };

  if (!post)
    return <div className="text-center text-gray-500 mt-20">Loading...</div>;

  return (
    <div className="grainy xl:py-12">
      <article className="xl:max-w-4xl mx-auto bg-white h-full xl:h-auto xl:rounded-xl shadow-md overflow-hidden">
        <div className="px-8 pt-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {post.updatedAt && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 ml-4 mr-2" />
                <span className="capitalize">{post.length.toLowerCase()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="px-8">
          <div className="relative w-full flex justify-center">
            {post.mainImageName && post.mainImageUrl && (
              <Image
                src={post.mainImageUrl}
                alt={post.mainImageName}
                width={1200}
                height={800}
                style={{ width: "100%", height: "auto" }}
                className="max-w-full h-auto"
                priority
              />
            )}
          </div>
        </div>
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium"
              >
                {tag.tag.name}
              </span>
            ))}
          </div>
          <div className="prose prose-lg max-w-none">{renderContent()}</div>
        </div>
      </article>
    </div>
  );
};

export default SinglePostPage;
