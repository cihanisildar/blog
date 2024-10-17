import React from "react";
import { Code, Github, Linkedin, Mail } from "lucide-react";

const AboutPage = () => {
  const skills = [
    "JavaScript", "React", "Node.js", "Python", "SQL", "Git"
  ];

  const projects = [
    { name: "Project A", description: "A web application for task management" },
    { name: "Project B", description: "An AI-powered chatbot for customer service" },
    { name: "Project C", description: "A mobile app for fitness tracking" }
  ];

  return (
    <div className="bg-white py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4 lg:border-r lg:border-green-200 lg:pr-8">
            <h2 className="text-3xl font-bold text-black sm:text-4xl">
              John Doe
            </h2>
            <p className="mt-4 text-xl text-black">Software Engineer</p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-green-500 hover:text-green-600">
                <Github size={24} />
              </a>
              <a href="#" className="text-green-500 hover:text-green-600">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-green-500 hover:text-green-600">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <div className="mt-8 lg:col-span-8 lg:mt-0">
            <div className="prose prose-lg text-black">
              <p>
                Passionate software engineer with 5+ years of experience in building scalable web applications.
                Specializing in full-stack development with a focus on React and Node.js.
                Always eager to learn new technologies and tackle challenging problems.
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-black">Skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                    <Code size={16} className="mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-black">Featured Projects</h3>
              <div className="mt-4 space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="rounded-lg border border-green-200 p-4 hover:shadow-md transition-shadow bg-white">
                    <h4 className="text-lg font-medium text-green-800">{project.name}</h4>
                    <p className="mt-1 text-sm text-green-600">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;