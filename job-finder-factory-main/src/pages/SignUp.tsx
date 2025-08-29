import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AuthCard } from "@/components/auth/AuthCard";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const passwordStrengthMap = [
  { label: "Very Weak", value: 20, color: "bg-destructive" },
  { label: "Weak", value: 40, color: "bg-orange-500" },
  { label: "Medium", value: 60, color: "bg-yellow-500" },
  { label: "Strong", value: 80, color: "bg-lime-500" },
  { label: "Very Strong", value: 100, color: "bg-green-500" },
];

const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = form.watch("password");
  
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^A-Za-z0-9]/)) strength += 20;
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthLabel = () => {
    const strength = passwordStrengthMap.find(
      (s) => s.value === passwordStrength
    );
    return strength ? strength.label : "";
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrengthMap.find(
      (s) => s.value === passwordStrength
    );
    return strength ? strength.color : "bg-destructive";
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password, values.name);
      
      // Redirect to welcome page
      navigate("/welcome");
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: string) => {
    try {
      setIsLoading(true);
      if (provider === "Google") {
        await signInWithGoogle();
      }
      
      // Redirect to welcome page
      navigate("/welcome");
    } catch (error) {
      console.error("Social signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-0 bg-background relative overflow-hidden">
      {/* Jerry leaning on the form */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute left-[-10%] md:left-[2%] lg:left-[19%] xl:left-[22%] bottom-[11%] z-10 pointer-events-none"
        style={{ 
          height: '100%', 
          maxHeight: '600px', 
          display: 'flex', 
          alignItems: 'flex-end', 
          transform: 'translateY(-40px)'
        }}
      >
        <img 
          src="/images/Jerry_Smith_(Rick_and_Morty).png" 
          alt="Jerry Smith" 
          className="h-[90%] max-h-[600px] object-contain" 
          style={{ transformOrigin: 'bottom left' }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-20"
      >
        <AuthCard
          title="Create an Account"
          subtitle="Start your job hunting journey today"
          alternativeAction={{
            text: "Already have an account?",
            linkText: "Sign in",
            href: "/signin",
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={passwordStrength}
                            className={`h-2 ${getPasswordStrengthColor()}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {getPasswordStrengthLabel()}
                          </span>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I accept the{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/terms");
                          }}
                        >
                          terms and conditions
                        </Button>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSocialSignUp("Google")}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isLoading ? 'Signing Up...' : 'Google'}
              </Button>
            </div>
          </div>
        </AuthCard>
      </motion.div>
      
      {/* Jerry's speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute top-[22%] left-[15%] md:left-[30%] lg:left-[22%] z-30 bg-white dark:bg-slate-800 p-4 rounded-xl max-w-[320px] shadow-lg pointer-events-none"
        style={{ 
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 50% 75%, 30% 100%, 15% 75%, 0% 75%)'
        }}
      >
        <p className="text-sm font-medium text-foreground">Unemployment? Heh! That's my expertise! Sign up and I can help you avoid my fate!</p>
      </motion.div>
    </div>
  );
} 