import {
  BadgeCheck,
  Car,
  Contact,
  ImageIcon,
  LayoutGrid,
  Menu,
  MessageSquareQuote,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAdmin } from '../AdminContext';
import { ActionStatusWidget } from '../publishing/components/ActionStatusWidget';
import { PublishStatusWidget } from '../publishing/components/PublishStatusWidget';

const sections = [
  { to: '/brand', title: 'Бренд и футер', icon: BadgeCheck },
  { to: '/menu', title: 'Меню', icon: Menu },
  { to: '/hero', title: 'Hero', icon: ImageIcon },
  { to: '/services', title: 'Услуги', icon: Car },
  { to: '/plans', title: 'Тарифы', icon: Wallet },
  { to: '/value-props', title: 'Преимущества', icon: Sparkles },
  { to: '/before-after', title: 'До / После', icon: LayoutGrid },
  { to: '/comfort', title: 'Комфорт', icon: Star },
  { to: '/reviews', title: 'Отзывы', icon: MessageSquareQuote },
  { to: '/contacts', title: 'Контакты', icon: Contact },
] as const;

export function HomeScreen() {
  const { loading, dirty } = useAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="AutoLux Admin" />
      <div className="flex-1 p-3">
        <PublishStatusWidget />
        <ActionStatusWidget />
        <p className="mb-3 text-sm text-muted-foreground">
          {loading
            ? 'Загрузка контента с GitHub…'
            : dirty
              ? 'Есть локальные правки — сохраните в draft на Home.'
              : 'Выберите раздел. Формы пишут в локальный стейт; в Git — кнопки выше.'}
        </p>
        <nav className="grid gap-2">
          {sections.map(({ to, title, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3 transition-colors active:bg-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
