import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  FileText, 
  Bell, 
  Settings, 
  User, 
  BarChart, 
  Calendar,
  MessageSquare 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundShapes from "@/components/hunting-parallax/BackgroundShapes";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      // If no token, redirect to landing page
      navigate("/");
      return;
    }
  }, [navigate]);

  // Mock data for the dashboard
  const recentJobs = [
    { id: 1, title: "Software Engineer", company: "Tech Innovations Inc.", status: "Applied", date: "2023-03-24" },
    { id: 2, title: "Data Scientist", company: "Data Analytics Pro", status: "Interviewing", date: "2023-03-20" },
    { id: 3, title: "UX/UI Designer", company: "Creative Digital Agency", status: "Saved", date: "2023-03-18" },
  ];

  const notifications = [
    { id: 1, message: "New interview invitation from Tech Innovations Inc.", date: "2 hours ago" },
    { id: 2, message: "Your resume has been viewed by 5 employers", date: "Yesterday" },
    { id: 3, message: "Application status updated for Data Scientist position", date: "2 days ago" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Interview: Software Engineer", date: "March 28, 2023", time: "10:00 AM" },
    { id: 2, title: "Tech Career Fair", date: "April 2, 2023", time: "09:00 AM - 04:00 PM" },
  ];

  return (
    <div className="container mx-auto py-10 relative">
      <BackgroundShapes />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applied Jobs</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold text-foreground">85</p>
              </div>
              <BarChart className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <Calendar className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="resume">My Resume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Job Applications</CardTitle>
                <CardDescription>Your recent job application activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded ${
                          job.status === "Applied" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200" : 
                          job.status === "Interviewing" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : 
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200"
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">{job.date}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View All Applications</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Notifications</CardTitle>
                <CardDescription>Latest updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <Bell className="h-5 w-5 text-primary dark:text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">View All Notifications</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Events</CardTitle>
              <CardDescription>Scheduled interviews and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Your Job Applications</CardTitle>
              <CardDescription>Track all your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">Job applications content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">All Notifications</CardTitle>
              <CardDescription>Stay updated with your job search activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">Notifications content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resume">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Your Resume</CardTitle>
              <CardDescription>Manage and update your resume</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2 text-foreground">Your Professional Resume</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Keep your resume updated to increase your chances of getting hired. A well-crafted resume can make all the difference.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Edit Resume</Button>
                <Button variant="outline">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 