import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LearnModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const LearnModeToggle = ({ enabled, onToggle }: LearnModeToggleProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      <Switch
        id="learn-mode"
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="learn-mode">Learn Mode</Label>
    </div>
  );
};