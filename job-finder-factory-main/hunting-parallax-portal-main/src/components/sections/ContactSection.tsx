import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export const ContactSection = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon.",
    });
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              id="subject"
              placeholder="Subject"
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="message"
              placeholder="Your message"
              required
              className="min-h-[150px]"
            />
          </div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
            >
              Send Message
              <Send className="ml-2" />
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
};