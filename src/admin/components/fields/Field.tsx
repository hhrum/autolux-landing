import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
