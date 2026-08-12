import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ScreenHeaderProps = {
  title: string;
  backTo?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
};

export function ScreenHeader({
  title,
  backTo,
  onBack,
  actions,
  className,
}: ScreenHeaderProps) {
  const navigate = useNavigate();
  const showBack = Boolean(backTo || onBack);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur',
        className,
      )}
    >
      {showBack ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Назад"
          onClick={() => (onBack ? onBack() : backTo && navigate(backTo))}
        >
          <ArrowLeft />
        </Button>
      ) : (
        <span className="size-7" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-center text-sm font-semibold tracking-tight">
        {title}
      </h1>
      <div className="flex min-w-7 items-center justify-end gap-1">{actions}</div>
    </header>
  );
}
