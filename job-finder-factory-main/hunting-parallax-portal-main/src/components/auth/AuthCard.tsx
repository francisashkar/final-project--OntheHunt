import { Link } from "react-router-dom";
import { Logo } from "@/components/sections/Logo";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alternativeAction: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function AuthCard({
  title,
  subtitle,
  children,
  alternativeAction,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        {children}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {alternativeAction.text}{" "}
            <Link to={alternativeAction.href} className="text-primary hover:underline">
              {alternativeAction.linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}