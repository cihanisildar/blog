"use client";

import { Post } from "@/models/post.model";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
        if (domNode instanceof Element) {
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
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  display: "inline-block",
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

  if (!post)
    return <div className="text-center text-gray-500 mt-20">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-100 to-white via-gray-50 overflow-hidden pb-20">
      <div className="flex-1 overflow-y-auto">
        <div className="grainy xl:py-12">
          <article className="xl:max-w-4xl mx-auto bg-white xl:rounded-xl shadow-md overflow-hidden">
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

              <p className="text-4xl font-extrabold mb-4">{post.description}</p>

              <div className="prose prose-lg max-w-none">{renderContent()}</div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;