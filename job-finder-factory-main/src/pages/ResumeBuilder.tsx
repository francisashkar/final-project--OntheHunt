import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
  });

  const handleDownload = () => {
    toast({
      title: "Coming Soon",
      description: "Resume builder functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Resume Builder</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="John Doe"
                value={resumeData.fullName}
                onChange={(e) =>
                  setResumeData({ ...resumeData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="john@example.com"
                value={resumeData.email}
                onChange={(e) =>
                  setResumeData({ ...resumeData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                placeholder="(123) 456-7890"
                value={resumeData.phone}
                onChange={(e) =>
                  setResumeData({ ...resumeData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary
              </label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                placeholder="Write a brief summary of your professional experience..."
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData({ ...resumeData, summary: e.target.value })
                }
              />
            </div>
            <Button onClick={handleDownload} className="w-full">
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}