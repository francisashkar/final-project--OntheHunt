import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Job } from "@/components/JobCard";

export default function JobMatch() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleFindMatches = () => {
    toast({
      title: "Coming Soon",
      description: "Job matching functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Job Match</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Your Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-md"
                  placeholder="e.g., React, TypeScript, Project Management"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button onClick={handleAddSkill}>Add</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-primary/60 hover:text-primary"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleFindMatches}
              className="w-full"
              disabled={skills.length === 0}
            >
              Find Matching Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}