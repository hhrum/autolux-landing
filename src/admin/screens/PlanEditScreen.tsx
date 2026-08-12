import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { RepeaterField } from '../components/fields/RepeaterField';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { PlanItem } from '../types';

export function PlanEditScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(() => data.plans.find((item) => item.id === id), [data.plans, id]);
  const [form, setForm] = useState<PlanItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/plans" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Тариф" backTo="/plans" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Название">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Цена «от»">
          <Input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
        </Field>
        <Field label="Выделенный">
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <span className="text-sm">Featured-тариф</span>
            <Switch
              checked={form.featured}
              onCheckedChange={(featured) => setForm({ ...form, featured })}
            />
          </div>
        </Field>
        <RepeaterField
          label="Строки прайса"
          items={form.rows}
          onChange={(rows) => setForm({ ...form, rows })}
          createItem={() => ({ label: '', price: '' })}
          addLabel="Добавить строку"
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Класс авто"
                value={item.label}
                onChange={(e) => update({ label: e.target.value })}
              />
              <Input
                placeholder="Цена"
                value={item.price}
                onChange={(e) => update({ price: e.target.value })}
              />
            </div>
          )}
        />
        <Field label="Примечание / акция">
          <Textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </Field>
      </div>
      <FormActions
        onCancel={() => navigate('/plans')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            plans: prev.plans.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/plans');
        }}
      />
    </div>
  );
}
