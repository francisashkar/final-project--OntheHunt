import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Building2, GraduationCap, LineChart } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-[#00e887]" />,
      title: "Smart Job Matching",
      description: "Find the perfect job match with our AI-powered search algorithm",
    },
    {
      icon: <Building2 className="h-8 w-8 text-[#00e887]" />,
      title: "Company Insights",
      description: "Get detailed insights about potential employers",
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-[#00e887]" />,
      title: "Career Growth",
      description: "Access resources to accelerate your career development",
    },
    {
      icon: <LineChart className="h-8 w-8 text-[#00e887]" />,
      title: "Salary Analytics",
      description: "Compare salaries across industries and locations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white">
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative py-24 text-center space-y-6">
          {/* Background Layers */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=2400&q=80')] opacity-5 bg-cover bg-center pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdf4] via-transparent to-white pointer-events-none" />
          </div>

          {/* Content */}
          <h1 className="text-5xl font-bold tracking-tight max-w-3xl mx-auto animate-fade-up">
            Find Your Dream Career with OnTheHunt
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-up delay-100">
            Intelligent job matching, AI-powered resume building, and personalized career guidance all in one place.
          </p>
          <div className="relative flex justify-center gap-4 pt-4 animate-fade-up delay-200">
            {/* Find Jobs Button */}
            <a href="/find-jobs">
              <Button size="lg" className="bg-[#00e887] text-white hover:bg-[#00e887]/90">
                Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            {/* Learn More Button */}
            <Button size="lg" variant="outline" className="relative z-10">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 animate-fade-up delay-400">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-[#00e887]/20"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
