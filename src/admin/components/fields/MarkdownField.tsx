import { Bold, Italic, List } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './Field';

type MarkdownFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
};

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
) {
  const selected = value.slice(start, end) || 'текст';
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    next,
    cursorStart: start + before.length,
    cursorEnd: start + before.length + selected.length,
  };
}

export function MarkdownField({
  label,
  value,
  onChange,
  hint = 'Подсказка: *акцент* для выделения',
  rows = 6,
}: MarkdownFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (before: string, after: string) => {
    const el = ref.current;
    if (!el) {
      onChange(`${before}текст${after}`);
      return;
    }
    const { next, cursorStart, cursorEnd } = wrapSelection(
      value,
      el.selectionStart,
      el.selectionEnd,
      before,
      after,
    );
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  return (
    <Field label={label} hint={hint}>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex gap-0.5 border-b border-border bg-muted/40 px-1 py-1">
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label="Жирный"
            onClick={() => apply('**', '**')}
          >
            <Bold />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label="Акцент / курсив"
            onClick={() => apply('*', '*')}
          >
            <Italic />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label="Список"
            onClick={() => {
              const el = ref.current;
              const start = el?.selectionStart ?? value.length;
              const lineStart = value.lastIndexOf('\n', start - 1) + 1;
              const next = value.slice(0, lineStart) + '- ' + value.slice(lineStart);
              onChange(next);
            }}
          >
            <List />
          </Button>
        </div>
        <Textarea
          ref={ref}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] rounded-none border-0 focus-visible:ring-0"
          placeholder="Markdown…"
        />
      </div>
    </Field>
  );
}
