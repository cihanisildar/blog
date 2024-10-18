import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
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

interface PostContentRendererProps {
  content: string;
}

const PostContentRenderer: React.FC<PostContentRendererProps> = ({
  content,
}) => {
  const renderContent = () => {
    return parse(content || "", {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element) {
          if (domNode instanceof Element) {
            if (
              domNode.name === "pre" ||
              domNode.attribs.class === "ql-syntax"
            ) {
              // Your existing code for handling <pre> elements
            } else if (domNode.name === "span" && domNode.attribs.style) {
              // Handle inline styles for background color
              const styleString = domNode.attribs.style as string;
              const bgColorMatch = styleString.match(
                /background-color:\s*([^;]+)/
              );
              const backgroundColor = bgColorMatch ? bgColorMatch[1] : "";

              return (
                <span
                  style={{
                    backgroundColor,
                    padding: "0.25rem 0.5rem", // Adjusted padding for better appearance
                    borderRadius: "0.25rem", // Adjusted border-radius for better appearance
                    display: "inline-block", // Ensures padding and border-radius are effective
                  }}
                >
                  {domToReact(domNode.children as DOMNode[])}
                </span>
              );
            }
          }
          if (domNode.name === "pre" || domNode.attribs.class === "ql-syntax") {
            let code: string;
            let language = "javascript"; // default language

            if (
              domNode.name === "pre" &&
              domNode.children[0] instanceof Element &&
              domNode.children[0].name === "code"
            ) {
              // Handle <pre><code> structure
              const codeElement = domNode.children[0];
              const className = codeElement.attribs.class || "";
              language = className.replace(/language-/, "") || language;
              code = domToReact(codeElement.children as DOMNode[]) as string;
            } else {
              // Handle <pre class="ql-syntax"> structure
              code = domToReact(domNode.children as DOMNode[]) as string;
            }

            return (
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                PreTag="div"
                customStyle={{
                  margin: "1.5em 0",
                  padding: "1em",
                  borderRadius: "0.375rem",
                }}
              >
                {String(code).trim()}
              </SyntaxHighlighter>
            );
          } else if (domNode.name === "span" && domNode.attribs.style) {
            // Handle inline styles for background color
            const styleString = domNode.attribs.style as string;
            const bgColorMatch = styleString.match(
              /background-color:\s*([^;]+)/
            );
            const backgroundColor = bgColorMatch ? bgColorMatch[1] : "";

            return (
              <span
                style={{
                  backgroundColor,
                  padding: "1px 4px",
                  borderRadius: "4px",
                }}
              >
                {domToReact(domNode.children as DOMNode[])}
              </span>
            );
          }
        }
      },
    });
  };

  return <div className="prose prose-lg max-w-none">{renderContent()}</div>;
};

export default PostContentRenderer;
