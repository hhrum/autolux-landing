import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/fields/Field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ReviewItem } from '../types';

export function ReviewEditScreen() {
  const { id } = useParams();
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const existing = useMemo(() => data.reviews.find((item) => item.id === id), [data.reviews, id]);
  const [form, setForm] = useState<ReviewItem | null>(existing ?? null);

  if (!existing || !form) return <Navigate to="/reviews" replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Отзыв" backTo="/reviews" />
      <div className="flex-1 space-y-4 p-3 pb-24">
        <Field label="Имя">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Авто">
          <Input value={form.car} onChange={(e) => setForm({ ...form, car: e.target.value })} />
        </Field>
        <Field label="Рейтинг">
          <Input
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
        </Field>
        <Field label="Рейтинг короткий">
          <Input
            value={form.ratingShort}
            onChange={(e) => setForm({ ...form, ratingShort: e.target.value })}
          />
        </Field>
        <Field label="Текст отзыва">
          <Textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </Field>
      </div>
      <FormActions
        onCancel={() => navigate('/reviews')}
        onSave={() => {
          setData((prev) => ({
            ...prev,
            reviews: prev.reviews.map((item) => (item.id === form.id ? form : item)),
          }));
          saveMock();
          navigate('/reviews');
        }}
      />
    </div>
  );
}
