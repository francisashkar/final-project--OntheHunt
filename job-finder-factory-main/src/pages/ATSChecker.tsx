import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ATSChecker() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCheck = () => {
    toast({
      title: "Coming Soon",
      description: "ATS checker functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">ATS Compatibility Checker</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                >
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload your resume (PDF, DOC, DOCX)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            {file && (
              <div className="text-center text-sm text-gray-500">
                Selected file: {file.name}
              </div>
            )}
            <Button
              onClick={handleCheck}
              className="w-full"
              disabled={!file}
            >
              Check ATS Compatibility
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}