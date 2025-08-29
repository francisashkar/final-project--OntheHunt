import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Briefcase, MapPin, Clock, ExternalLink, User, X, Info } from "lucide-react";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";
import { CHAT_REFERENCES_UPDATED_EVENT } from "@/components/Navigation";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface JobReference {
  link: string;
  Title: string;
  company: string;
  location: string;
  uploaded: string;
  matchScore?: number;
  addedAt: string;
  type: string;
}

// Backend API configuration
const BACKEND_URL = 'http://localhost:3001';

export default function CareerAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [jobReferences, setJobReferences] = useState<JobReference[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(true);
  const [apiStatus, setApiStatus] = useState<'testing' | 'working' | 'fallback'>('testing');

  // Load job references from localStorage on component mount
  useEffect(() => {
    const loadJobReferences = () => {
      const savedReferences = localStorage.getItem('chatReferences');
      if (savedReferences) {
        const references = JSON.parse(savedReferences);
        // Filter to only job references and sort by most recent
        const jobRefs = references
          .filter((ref: any) => ref.type === 'job_reference')
          .sort((a: JobReference, b: JobReference) => 
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
        setJobReferences(jobRefs);
      }
    };

    // Load initial references
    loadJobReferences();

    // Set up event listener for updates to references
    const handleReferencesUpdated = () => {
      loadJobReferences();
    };

    window.addEventListener(CHAT_REFERENCES_UPDATED_EVENT, handleReferencesUpdated);
    window.addEventListener('storage', handleReferencesUpdated);

    // Test backend connection
    testBackendConnection();
    
    // Initial welcome message
    setMessages([
      {
        id: '1',
        content: "Hello! I'm CareerHunt AI, your advanced AI-powered career advisor. I can help you with job search advice, resume tips, interview preparation, and more. What would you like to discuss today?",
        sender: 'assistant',
        timestamp: new Date()
      }
    ]);

    return () => {
      window.removeEventListener(CHAT_REFERENCES_UPDATED_EVENT, handleReferencesUpdated);
      window.removeEventListener('storage', handleReferencesUpdated);
    };
  }, []);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      if (response.ok) {
        setApiStatus('working');
        console.log('✅ Backend connection successful');
      } else {
        setApiStatus('fallback');
        console.log('❌ Backend connection failed');
      }
    } catch (error) {
      setApiStatus('fallback');
      console.log('❌ Backend connection error:', error);
    }
  };

  // Get AI response from backend
  const getAIResponse = async (userMessage: string, references: JobReference[]): Promise<string> => {
    try {
      // Create context about job references if any are mentioned
      let jobContext = "";
      const mentionedJob = references.find(job => 
        userMessage.toLowerCase().includes(job.Title?.toLowerCase() || "") || 
        userMessage.toLowerCase().includes(job.company?.toLowerCase() || "")
      );
      
      if (mentionedJob) {
        jobContext = `Context: I'm asking about this job:\nTitle: ${mentionedJob.Title}\nCompany: ${mentionedJob.company}\nLocation: ${mentionedJob.location}\nPosted: ${mentionedJob.uploaded}`;
      }

      // Prepare conversation history for context
      const conversationHistory = messages.slice(-5).map(msg => ({
        sender: msg.sender,
        content: msg.content
      }));

      console.log("Calling backend API...");
      
      // Call backend API
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          jobContext: jobContext,
          conversationHistory: conversationHistory,
          userProfile: "Career-focused professional seeking guidance"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API error:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error calling backend API:', error);
      return "I apologize, but I'm having trouble connecting to the AI service. Please make sure the backend server is running on port 3001.";
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setLoading(true);

    try {
      // Get response from AI via backend
      const aiResponse = await getAIResponse(currentMessage, jobReferences);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat flow:', error);
      
      // Fallback message if something goes wrong
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if a job posting is recent (within last 7 days)
  const isRecent = (uploadedText: string): boolean => {
    if (uploadedText.includes('hour') || uploadedText.includes('today') || uploadedText.includes('yesterday')) {
      return true;
    }
    if (uploadedText.includes('day')) {
      const days = parseInt(uploadedText.split(' ')[0]);
      return days <= 7;
    }
    return false;
  };

  // Helper function to generate a relevant skill based on job title
  const getRelevantSkill = (jobTitle: string): string => {
    const title = jobTitle.toLowerCase();
    if (title.includes('developer') || title.includes('engineer') || title.includes('programming')) {
      return 'technical skills and coding practices';
    }
    if (title.includes('manager') || title.includes('lead') || title.includes('director')) {
      return 'leadership and team management';
    }
    if (title.includes('design') || title.includes('ux') || title.includes('ui')) {
      return 'user experience and visual design principles';
    }
    if (title.includes('market') || title.includes('sales') || title.includes('growth')) {
      return 'customer acquisition and relationship building';
    }
    if (title.includes('data') || title.includes('analyst') || title.includes('science')) {
      return 'data analysis and insights generation';
    }
    return 'communication and problem-solving abilities';
  };

  // Remove a job reference
  const handleRemoveReference = (jobLink: string) => {
    const updatedReferences = jobReferences.filter(job => job.link !== jobLink);

    // Update state
    setJobReferences(updatedReferences);

    // Update localStorage - need to get all references first
    const allReferences = JSON.parse(localStorage.getItem('chatReferences') || '[]');
    const filteredReferences = allReferences.filter((ref: JobReference) => ref.link !== jobLink);
    localStorage.setItem('chatReferences', JSON.stringify(filteredReferences));

    // Notify components of change
    window.dispatchEvent(new Event(CHAT_REFERENCES_UPDATED_EVENT));
  };

  return (
    <div className="container mx-auto py-10 relative">
      <BackgroundShapes />
      <div className="flex flex-col max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Career Assistant</h1>
        
        {/* Job References Section */}
        {jobReferences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-3 text-foreground">Referenced Jobs</h2>
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2">
              {jobReferences.map((job, index) => (
                <Card key={index} className="min-w-[280px] max-w-[320px] bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{job.Title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveReference(job.link)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-4">
                    <div className="space-y-2">
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          {job.uploaded}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setCurrentMessage(`Can you give me advice about the ${job.Title} position at ${job.company}?`);
                          }}
                        >
                          Ask About This Job
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => window.open(job.link, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat Interface */}
        <Card className="border-border h-[600px] flex flex-col shadow-md border-2">
          <CardHeader className="border-b py-4 bg-muted/30">
            <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-lg font-medium">Career Chat</CardTitle>
              <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'working' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                apiStatus === 'fallback' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {apiStatus === 'working' ? 'AI Connected' : 
                 apiStatus === 'fallback' ? 'Backend Offline' : 'Testing...'}
              </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="h-8 w-8 rounded-full"
                title={showSystemPrompt ? "Hide system info" : "Show system info"}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow relative">
            {showSystemPrompt && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800 p-3 text-sm">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                                          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">About CareerHunt Assistant</p>
                      <p className="text-blue-600 dark:text-blue-400">
                        Powered by OpenAI GPT-4, this advanced assistant provides expert career guidance, job analysis, 
                        resume optimization, interview preparation, and personalized advice. The system connects to a backend server 
                        to provide real-time AI responses.
                      </p>
                  </div>
                </div>
              </div>
            )}
            <ScrollArea className={`${showSystemPrompt ? 'h-[430px]' : 'h-[480px]'} p-4`}>
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                        {message.sender === 'assistant' ? (
                          <AvatarImage src="/assets/bot-avatar.png" />
                        ) : null}
                        <AvatarFallback className={message.sender === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-secondary'}>
                          {message.sender === 'assistant' ? 'AI' : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'assistant' 
                          ? 'bg-card border-2 border-border shadow-sm' 
                          : 'bg-primary text-primary-foreground shadow-sm'
                      }`}>
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-[80%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-card border-2 border-border shadow-sm">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t absolute bottom-0 left-0 right-0 bg-background">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-grow border-2 focus-visible:ring-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!currentMessage.trim() || loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}