import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { EntityList } from '../components/EntityList';
import { FormActions } from '../components/FormActions';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeaderFields } from '../components/fields/SectionHeaderFields';
import { newId, reorderByIndex } from '../mock-data';
import type { SectionMeta } from '../types';
import { Separator } from '@/components/ui/separator';

export function ReviewsScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.reviews);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Отзывы" backTo="/" />
      <div className="space-y-4 p-3">
        <SectionHeaderFields value={header} onChange={setHeader} showReviewsExtras />
        <FormActions
          className="static border-0 p-0"
          onCancel={() => setHeader(data.sections.reviews)}
          onSave={() => {
            setData((prev) => ({
              ...prev,
              sections: { ...prev.sections, reviews: header },
            }));
            saveMock();
          }}
          saveLabel="Сохранить шапку"
        />
      </div>
      <Separator />
      <EntityList
        items={data.reviews}
        getTitle={(item) => item.name}
        getSubtitle={(item) => `${item.car} · ${item.ratingShort}`}
        editPath={(id) => `/reviews/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            reviews: reorderByIndex(
              [...prev.reviews].sort((a, b) => a.order - b.order),
              from,
              to,
            ),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            reviews: prev.reviews
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('review');
          setData((prev) => ({
            ...prev,
            reviews: [
              ...prev.reviews,
              {
                id,
                name: 'Новый отзыв',
                car: '',
                rating: '5.0 ★★★★★',
                ratingShort: '5.0 ★',
                text: '',
                order: prev.reviews.length + 1,
              },
            ],
          }));
          navigate(`/reviews/${id}`);
        }}
        addLabel="Добавить отзыв"
      />
    </div>
  );
}
