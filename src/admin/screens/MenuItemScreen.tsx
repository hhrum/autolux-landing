import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { Input } from '@/components/ui/input';
import type { NavItem } from '../types';

export function MenuItemScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(
    () => data.navigation.find((item) => item.id === id),
    [data.navigation, id],
  );
  const [form, setForm] = useState<NavItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/menu" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Пункт меню" backTo="/menu" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Подпись">
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </Field>
        <Field label="Ссылка" hint="Якорь или URL: #contacts, https://…">
          <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
        </Field>
      </div>
      <FormActions
        onCancel={() => navigate('/menu')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            navigation: prev.navigation.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/menu');
        }}
      />
    </div>
  );
}
