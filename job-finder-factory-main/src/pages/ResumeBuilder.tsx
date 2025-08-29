import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Download, Edit, FileText, User, GraduationCap, Briefcase, Lightbulb, Sparkles } from "lucide-react";

import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types for resume data
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  achievements: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  achievements: string[];
}

interface Skill {
  id: number;
  name: string;
  level: string;
}

interface ResumeData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumeBuilder() {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [previewMode, setPreviewMode] = useState(false);

  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    education: [
      {
        id: 1,
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        location: "",
        gpa: "",
        achievements: "",
      },
    ],
    experience: [
      {
        id: 1,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        achievements: [],
      },
    ],
    skills: [
      { id: 1, name: "", level: "Intermediate" }
    ],
  });

  // AI improvement state
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Helper functions for updating nested state
  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [field]: value },
    });
  };

  const addEducation = () => {
    const newId = resumeData.education.length > 0 
      ? Math.max(...resumeData.education.map(edu => edu.id)) + 1 
      : 1;
    
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: newId,
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          location: "",
          gpa: "",
          achievements: "",
        },
      ],
    });
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const addExperience = () => {
    const newId = resumeData.experience.length > 0 
      ? Math.max(...resumeData.experience.map(exp => exp.id)) + 1 
      : 1;
    
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          achievements: [],
        },
      ],
    });
  };

  const updateExperience = (id: number, field: keyof Experience, value: string | string[]) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addSkill = () => {
    const newId = resumeData.skills.length > 0 
      ? Math.max(...resumeData.skills.map(skill => skill.id)) + 1 
      : 1;
    
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        { id: newId, name: "", level: "Intermediate" },
      ],
    });
  };

  const updateSkill = (id: number, field: keyof Skill, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  // AI improvement functions
  const improveWithAI = async (field: string, currentText: string, context: string) => {
    if (!currentText.trim()) {
      toast({
        title: "No Text to Improve",
        description: "Please write some content first before improving it with AI.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);

    try {
      const prompt = `Improve this ${field} for a professional resume: "${currentText}". ${context} Make it more compelling, professional, and use action verbs. Keep the same length but enhance the quality.`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          userProfile: "Resume building assistance"
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
             // Clean the AI response by removing quotes and extra formatting
       const cleanContent = data.content.replace(/^["']|["']$/g, '').trim();
       
       // Apply the improved content based on the field
       if (field === 'summary') {
         updatePersonal('summary', cleanContent);
       } else if (field === 'achievements') {
         // Find the first education entry and update achievements
         if (resumeData.education.length > 0) {
           updateEducation(resumeData.education[0].id, 'achievements', cleanContent);
         }
       } else if (field === 'description') {
         // Find the first experience entry and update description
         if (resumeData.experience.length > 0) {
           updateExperience(resumeData.experience[0].id, 'description', cleanContent);
         }
       } else if (field === 'skills') {
        // Clear existing skills and add new ones
        setResumeData({
          ...resumeData,
          skills: []
        });
        
        // Parse skills and add them
        const skillLines = data.content.split('\n').filter(line => line.trim());
        skillLines.forEach((skill, index) => {
          if (index < 5) { // Limit to 5 skills
            const skillName = skill.replace(/^[-•*]\s*/, '').trim();
            if (skillName) {
              addSkill();
              setTimeout(() => {
                const newSkill = resumeData.skills[resumeData.skills.length - 1];
                updateSkill(newSkill.id, 'name', skillName);
              }, 100);
            }
          }
        });
      }
      
      toast({
        title: "Content Improved!",
        description: "AI has enhanced your content.",
      });
    } catch (error) {
      console.error('Error improving content:', error);
      toast({
        title: "Error",
        description: "Failed to improve content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = (format: string) => {
    // Check if essential fields are filled
    if (!resumeData.personal.fullName || !resumeData.personal.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and email before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (previewMode) {
      // Small delay to ensure preview is fully rendered
      setTimeout(() => {
        generateWord();
      }, 100);
    } else {
      generateWord();
    }
  };

    const generateWord = () => {
    if (!resumeRef.current) return;
    
    // Show loading toast
    toast({
      title: "Generating Word Document",
      description: "Please wait while we prepare your resume...",
    });

    try {
      const filename = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.doc`;
      
      // Generate structured HTML content specifically for Word
      const generateWordContent = () => {
        let content = '';
        
        // Header section
        content += `
          <div class="header">
            <h1>${resumeData.personal.fullName || "Your Name"}</h1>
            <div class="contact-info" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8pt;">
        `;
        
        // Contact information - build array first to handle spacing
        const contactItems = [];
        if (resumeData.personal.email) contactItems.push(resumeData.personal.email);
        if (resumeData.personal.phone) contactItems.push(resumeData.personal.phone);
        if (resumeData.personal.address) {
          let address = resumeData.personal.address;
          if (resumeData.personal.city) address += `, ${resumeData.personal.city}`;
          if (resumeData.personal.state) address += `, ${resumeData.personal.state}`;
          if (resumeData.personal.zipCode) address += ` ${resumeData.personal.zipCode}`;
          contactItems.push(address);
        }
        if (resumeData.personal.linkedin) {
          let linkedinUrl = resumeData.personal.linkedin;
          if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
            linkedinUrl = `https://${linkedinUrl}`;
          }
          // Extract just the LinkedIn username/identifier for display
          const linkedinDisplay = resumeData.personal.linkedin.includes('linkedin.com/in/') 
            ? resumeData.personal.linkedin.split('linkedin.com/in/')[1] 
            : resumeData.personal.linkedin.replace(/^https?:\/\//, '');
          contactItems.push(`LinkedIn: <a href="${linkedinUrl}" style="color: #3498db; text-decoration: underline;">${linkedinDisplay}</a>`);
        }
        if (resumeData.personal.website) {
          let websiteUrl = resumeData.personal.website;
          if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            websiteUrl = `https://${websiteUrl}`;
          }
          // Extract just the domain for display
          const websiteDisplay = resumeData.personal.website.replace(/^https?:\/\//, '').replace(/^www\./, '');
          contactItems.push(`Website: <a href="${websiteUrl}" style="color: #3498db; text-decoration: underline;">${websiteDisplay}</a>`);
        }
        
        // Add contact items with proper spacing
        contactItems.forEach((item, index) => {
          if (index > 0) {
            content += `<span style="margin: 0 4pt; color: #bdc3c7;">•</span>`;
          }
          content += `<span>${item}</span>`;
        });
        
        content += '</div></div>';
        
        // Professional Summary
        if (resumeData.personal.summary) {
          content += `
            <div class="section">
              <h2>Professional Summary</h2>
              <p class="summary">${resumeData.personal.summary}</p>
            </div>
          `;
        }
        
        // Experience section
        if (resumeData.experience.length > 0 && resumeData.experience[0].company) {
          content += `
            <div class="section">
              <h2>Professional Experience</h2>
          `;
          
          resumeData.experience.forEach((exp) => {
            if (exp.company) {
              content += `
                <div class="entry">
                  <div class="entry-header">
                    <div class="entry-left">
                      <h3>${exp.position || "Position"}</h3>
                      <h4>${exp.company}</h4>
                    </div>
                    <div class="entry-right">
                      ${exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ""}
                      ${exp.location ? `<br/>${exp.location}` : ""}
                    </div>
                  </div>
                  ${exp.description ? `<p>${exp.description}</p>` : ""}
                </div>
              `;
            }
          });
          
          content += '</div>';
        }
        
        // Education section
        if (resumeData.education.length > 0 && resumeData.education[0].institution) {
          content += `
            <div class="section">
              <h2>Education</h2>
          `;
          
          resumeData.education.forEach((edu) => {
            if (edu.institution) {
              content += `
                <div class="entry">
                  <div class="entry-header">
                    <div class="entry-left">
                      <h3>${edu.institution}</h3>
                      <h4>
                        ${edu.degree || ""}
                        ${edu.degree && edu.fieldOfStudy ? ", " : ""}
                        ${edu.fieldOfStudy || ""}
                      </h4>
                    </div>
                    <div class="entry-right">
                      ${edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ""}
                      ${edu.location ? `<br/>${edu.location}` : ""}
                    </div>
                  </div>
                  ${edu.gpa ? `<div style="font-size: 11pt; margin: 0; color: #7f8c8d;">GPA: ${edu.gpa}</div>` : ""}
                  ${edu.achievements ? `<p>${edu.achievements}</p>` : ""}
                </div>
              `;
            }
          });
          
          content += '</div>';
        }
        
        // Skills section
        if (resumeData.skills.length > 0 && resumeData.skills[0].name) {
          content += `
            <div class="section">
              <h2>Skills</h2>
              <div class="skills">
          `;
          
          resumeData.skills.forEach((skill) => {
            if (skill.name) {
              content += `
                <span class="skill">
                  ${skill.name}${skill.level !== "Intermediate" ? ` (${skill.level})` : ""}
                </span>
              `;
            }
          });
          
          content += '</div></div>';
        }
        
        return content;
      };
      
      // Create HTML content with proper Word styling and Office XML namespaces
      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <meta name="ProgId" content="Word.Document">
          <meta name="Generator" content="Microsoft Word 15">
          <meta name="Originator" content="Microsoft Word 15">
          <title>${resumeData.personal.fullName} Resume</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotHyphenateCaps/>
              <w:PunctuationKerning/>
              <w:DontGrowAutofit/>
              <w:UseFELayout/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            /* Reset and base styles */
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            
            body { 
              font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif; 
              color: #000000; 
              margin: 1cm; 
              line-height: 1.2;
              font-size: 11pt;
              background-color: #ffffff;
            }
            
            /* Typography */
            h1 { 
              font-size: 18pt; 
              text-align: center; 
              margin-bottom: 10pt; 
              font-weight: bold;
              color: #2c3e50;
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            h2 { 
              font-size: 14pt; 
              border-bottom: 1pt solid #34495e; 
              margin-top: 14pt; 
              margin-bottom: 8pt; 
              font-weight: bold;
              color: #34495e;
              font-family: 'Calibri', 'Arial', sans-serif;
              page-break-after: avoid;
            }
            
            h3 { 
              font-size: 12pt; 
              margin-bottom: 0; 
              margin-top: 10pt; 
              font-weight: bold;
              color: #2c3e50;
              font-family: 'Calibri', 'Arial', sans-serif;
              page-break-after: avoid;
            }
            
            h4 { 
              font-size: 11pt; 
              font-weight: normal; 
              margin-top: 0; 
              margin-bottom: 0; 
              color: #7f8c8d;
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            p { 
              font-size: 11pt; 
              margin-top: 4pt; 
              margin-bottom: 4pt; 
              font-family: 'Calibri', 'Arial', sans-serif;
              text-align: justify;
            }
            
            /* Layout */
            .header { 
              margin-bottom: 14pt; 
              page-break-after: avoid;
            }
            
            .contact-info { 
              text-align: center; 
              font-size: 10pt; 
              margin-bottom: 12pt; 
              color: #7f8c8d;
              font-family: 'Calibri', 'Arial', sans-serif;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 8pt;
              align-items: center;
            }
            
            .contact-info span {
              white-space: nowrap;
            }
            
            .section { 
              margin-bottom: 14pt; 
              page-break-inside: avoid;
            }
            
            .entry { 
              margin-bottom: 10pt; 
              page-break-inside: avoid;
            }
            
            .entry-header { 
              display: table; 
              width: 100%; 
              table-layout: fixed;
            }
            
            .entry-left { 
              display: table-cell; 
              width: 70%;
              vertical-align: top;
            }
            
            .entry-right { 
              display: table-cell; 
              width: 30%;
              text-align: right; 
              font-size: 10pt; 
              color: #7f8c8d;
              vertical-align: top;
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            .skills { 
              margin-top: 6pt; 
            }
            
            .skill { 
              display: inline-block; 
              margin-right: 8pt; 
              margin-bottom: 6pt; 
              background-color: #ecf0f1; 
              padding: 2pt 6pt; 
              border-radius: 3pt; 
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            /* Links */
            a { 
              color: #3498db; 
              text-decoration: underline; 
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            /* Dividers */
            .divider {
              border-top: 1px solid #bdc3c7;
              margin: 10pt 0;
            }
            
            /* Summary */
            .summary {
              font-style: italic;
              color: #7f8c8d;
              text-align: justify;
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            
            /* Page breaks */
            .page-break {
              page-break-before: always;
            }
            
            /* Print optimization */
            @media print {
              body { margin: 0.5cm; }
              h2 { page-break-after: avoid; }
              .entry { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${generateWordContent()}
        </body>
        </html>
      `;
      
      // Convert HTML to Blob with proper MIME type for Word documents
      const blob = new Blob([htmlContent], { 
        type: 'application/msword' 
      });
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 100);
      
      toast({
        title: "Resume Downloaded",
        description: "Your resume has been generated and downloaded as Word document.",
      });
    } catch (error) {
      console.error("Word document generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an issue generating your Word document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background shapes */}
      <BackgroundShapes />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
          <div className="flex gap-2">
            <Button
              variant={previewMode ? "outline" : "default"}
              onClick={() => setPreviewMode(false)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(true)}
            >
              <FileText className="mr-2 h-4 w-4" /> Preview
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" /> Download Word
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownload('docx')}>
                  <FileText className="mr-2 h-4 w-4" /> Word Document (.doc)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>



        {previewMode ? (
          <ResumePreview data={resumeData} ref={resumeRef} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 border border-gray-300">
                  <TabsTrigger value="personal">
                    <User className="h-4 w-4 mr-1" /> Personal
                  </TabsTrigger>
                  <TabsTrigger value="education">
                    <GraduationCap className="h-4 w-4 mr-1" /> Education
                  </TabsTrigger>
                  <TabsTrigger value="experience">
                    <Briefcase className="h-4 w-4 mr-1" /> Experience
                  </TabsTrigger>
                  <TabsTrigger value="skills">
                    <Lightbulb className="h-4 w-4 mr-1" /> Skills
                  </TabsTrigger>
                </TabsList>

                <Card className="border-gray-300 shadow-md">
                  <CardContent className="pt-6">
                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
                          <Input
                            placeholder="John Doe"
                            value={resumeData.personal.fullName}
                            onChange={(e) => updatePersonal("fullName", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={resumeData.personal.email}
                            onChange={(e) => updatePersonal("email", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">Phone</label>
                          <Input
                            type="tel"
                            placeholder="(123) 456-7890"
                            value={resumeData.personal.phone}
                            onChange={(e) => updatePersonal("phone", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">Address</label>
                          <Input
                            placeholder="123 Main St"
                            value={resumeData.personal.address}
                            onChange={(e) => updatePersonal("address", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">City</label>
                          <Input
                            placeholder="New York"
                            value={resumeData.personal.city}
                            onChange={(e) => updatePersonal("city", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">State</label>
                          <Input
                            placeholder="NY"
                            value={resumeData.personal.state}
                            onChange={(e) => updatePersonal("state", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">Zip Code</label>
                          <Input
                            placeholder="10001"
                            value={resumeData.personal.zipCode}
                            onChange={(e) => updatePersonal("zipCode", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-foreground">LinkedIn</label>
                          <Input
                            placeholder="linkedin.com/in/johndoe"
                            value={resumeData.personal.linkedin}
                            onChange={(e) => updatePersonal("linkedin", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1 text-foreground">Website</label>
                          <Input
                            placeholder="johndoe.com"
                            value={resumeData.personal.website}
                            onChange={(e) => updatePersonal("website", e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-foreground">Professional Summary</label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => improveWithAI('summary', resumeData.personal.summary, 'Make it compelling and professional for job applications.')}
                              disabled={aiLoading}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-6 px-2 text-xs"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {aiLoading ? 'Improving...' : 'AI Improve'}
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Write a brief summary of your professional experience..."
                            className="h-32 border-gray-300"
                            value={resumeData.personal.summary}
                            onChange={(e) => updatePersonal("summary", e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="space-y-6">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-300 rounded-lg p-4 relative shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border border-gray-200"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Institution</label>
                              <Input
                                placeholder="University of Example"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Degree</label>
                              <Input
                                placeholder="Bachelor of Science"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Field of Study</label>
                              <Input
                                placeholder="Computer Science"
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Location</label>
                              <Input
                                placeholder="New York, NY"
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Start Date</label>
                              <Input
                                placeholder="MM/YYYY"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">End Date</label>
                              <Input
                                placeholder="MM/YYYY or Present"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">GPA</label>
                              <Input
                                placeholder="3.8/4.0"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-foreground">Achievements/Activities</label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => improveWithAI('achievements', edu.achievements, 'Make it compelling and highlight academic achievements.')}
                                  disabled={aiLoading}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-6 px-2 text-xs"
                                >
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  {aiLoading ? 'Improving...' : 'AI Improve'}
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Dean's List, Relevant coursework, etc."
                                value={edu.achievements}
                                onChange={(e) => updateEducation(edu.id, "achievements", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-gray-300"
                        onClick={addEducation}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                      </Button>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-6">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-300 rounded-lg p-4 relative shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border border-gray-200"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Company</label>
                              <Input
                                placeholder="Example Corp"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Position</label>
                              <Input
                                placeholder="Software Engineer"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Start Date</label>
                              <Input
                                placeholder="MM/YYYY"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">End Date</label>
                              <Input
                                placeholder="MM/YYYY or Present"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1 text-foreground">Location</label>
                              <Input
                                placeholder="New York, NY"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                className="border-gray-300"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-foreground">Description</label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => improveWithAI('description', exp.description, 'Make it more professional with action verbs and quantify achievements.')}
                                  disabled={aiLoading}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-6 px-2 text-xs"
                                >
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  {aiLoading ? 'Improving...' : 'AI Improve'}
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Describe your role and responsibilities..."
                                className="h-24 border-gray-300"
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-gray-300"
                        onClick={addExperience}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                      </Button>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-foreground">Skills</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => improveWithAI('skills', resumeData.skills.map(s => s.name).join(', '), 'Suggest relevant skills for a professional role.')}
                          disabled={aiLoading}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {aiLoading ? 'Improving...' : 'AI Improve'}
                        </Button>
                      </div>
                      {resumeData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm">
                          <div className="flex-1">
                            <Input
                              placeholder="Skill (e.g., JavaScript, Project Management)"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              className="border-gray-300"
                            />
                          </div>
                          <div className="w-40">
                            <Select
                              value={skill.level}
                              onValueChange={(value) => updateSkill(skill.id, "level", value)}
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border border-gray-200"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-gray-300"
                        onClick={addSkill}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                      </Button>
                    </TabsContent>
                  </CardContent>
                </Card>
              </Tabs>
            </div>

                         <div className="lg:col-span-2">
               <ResumePreview data={resumeData} ref={resumeRef} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Convert to forwardRef to accept ref from parent
const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    // Function to format links as clickable
    const formatLink = (url: string, text?: string) => {
      if (!url) return null;
      
      // Add https:// if it doesn't have a protocol
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = `https://${url}`;
      }
      
      return (
        <a 
          href={formattedUrl}
          className="text-blue-600 hover:underline" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {text || url}
        </a>
      );
    };

    return (
      <div ref={ref} className="bg-white shadow-lg rounded-lg p-8 min-h-[1056px] w-full max-w-[816px] mx-auto text-black print:shadow-none" style={{ aspectRatio: '1 / 1.414' }}>
                 <div className="pb-4 mb-6">
          <h1 className="text-3xl font-bold text-center text-black">{data.personal.fullName || "Your Name"}</h1>
                     <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-gray-600">
             {data.personal.email && <div className="px-2 py-1 bg-gray-100 rounded-md">{data.personal.email}</div>}
             {data.personal.phone && <div className="px-2 py-1 bg-gray-100 rounded-md">{data.personal.phone}</div>}
             {data.personal.address && (
               <div className="px-2 py-1 bg-gray-100 rounded-md">
                 {data.personal.address}
                 {(data.personal.city || data.personal.state) && ", "}
                 {data.personal.city}
                 {data.personal.city && data.personal.state && ", "}
                 {data.personal.state} {data.personal.zipCode}
               </div>
             )}
                         {data.personal.linkedin && (
               <div>
                 <Button
                   variant="outline"
                   size="sm"
                   className="h-8 px-3 text-xs border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                   onClick={() => {
                     let url = data.personal.linkedin;
                     if (!url.startsWith('http://') && !url.startsWith('https://')) {
                       url = `https://${url}`;
                     }
                     window.open(url, '_blank');
                   }}
                 >
                   LinkedIn
                 </Button>
               </div>
             )}
             {data.personal.website && (
               <div>
                 <Button
                   variant="outline"
                   size="sm"
                   className="h-8 px-3 text-xs border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700"
                   onClick={() => {
                     let url = data.personal.website;
                     if (!url.startsWith('http://') && !url.startsWith('https://')) {
                       url = `https://${url}`;
                     }
                     window.open(url, '_blank');
                   }}
                 >
                   Website
                 </Button>
               </div>
             )}
          </div>
        </div>

        {data.personal.summary && (
          <div className="mb-6">
                         <h2 className="text-xl font-semibold mb-2 text-black">Professional Summary</h2>
            <p className="text-sm text-gray-800">{data.personal.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && data.experience[0].company && (
          <div className="mb-6">
                         <h2 className="text-xl font-semibold mb-2 text-black">Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-black">{exp.position || "Position"}</h3>
                      <h4 className="text-sm text-gray-700">{exp.company || "Company"}</h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ""}
                      {exp.location && <div>{exp.location}</div>}
                    </div>
                  </div>
                  {exp.description && <p className="text-sm mt-2 text-gray-800">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && data.education[0].institution && (
          <div className="mb-6">
                         <h2 className="text-xl font-semibold mb-2 text-black">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-black">{edu.institution || "Institution"}</h3>
                      <h4 className="text-sm text-gray-700">
                        {edu.degree}
                        {edu.degree && edu.fieldOfStudy && ", "}
                        {edu.fieldOfStudy}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ""}
                      {edu.location && <div>{edu.location}</div>}
                    </div>
                  </div>
                  {edu.gpa && <div className="text-sm mt-1 text-gray-800">GPA: {edu.gpa}</div>}
                  {edu.achievements && <p className="text-sm mt-1 text-gray-800">{edu.achievements}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && data.skills[0].name && (
          <div>
                         <h2 className="text-xl font-semibold mb-2 text-black">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800">
                  {skill.name} {skill.level !== "Intermediate" && `(${skill.level})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Add display name for better debugging
ResumePreview.displayName = "ResumePreview";