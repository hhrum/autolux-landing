import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { ImageField } from '../components/fields/ImageField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ServiceItem } from '../types';

export function ServiceEditScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(() => data.services.find((item) => item.id === id), [data.services, id]);
  const [form, setForm] = useState<ServiceItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/services" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Услуга" backTo="/services" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Название">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Описание">
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <Field label="Цена">
          <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </Field>
        <ImageField
          label="Изображение"
          value={form.image}
          onChange={(image) => setForm({ ...form, image })}
        />
        <Field label="Ссылка «Подробнее»">
          <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
        </Field>
      </div>
      <FormActions
        onCancel={() => navigate('/services')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            services: prev.services.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/services');
        }}
      />
    </div>
  );
}
