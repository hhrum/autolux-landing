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

export function PlansScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.pricelist);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Тарифы" backTo="/" />
      <div className="space-y-4 p-3">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <FormActions
          className="static border-0 p-0"
          onCancel={() => setHeader(data.sections.pricelist)}
          onSave={() => {
            setData((prev) => ({
              ...prev,
              sections: { ...prev.sections, pricelist: header },
            }));
            saveMock();
          }}
          saveLabel="Сохранить шапку"
        />
      </div>
      <Separator />
      <EntityList
        items={data.plans}
        getTitle={(item) => item.name}
        getSubtitle={(item) => `${item.from}${item.featured ? ' · featured' : ''}`}
        editPath={(id) => `/plans/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            plans: reorderByIndex([...prev.plans].sort((a, b) => a.order - b.order), from, to),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            plans: prev.plans
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('plan');
          setData((prev) => ({
            ...prev,
            plans: [
              ...prev.plans,
              {
                id,
                name: 'Новый тариф',
                from: 'от 0 ₽',
                featured: false,
                order: prev.plans.length + 1,
                rows: [{ label: 'Седан', price: '0 ₽' }],
                note: '',
              },
            ],
          }));
          navigate(`/plans/${id}`);
        }}
        addLabel="Добавить тариф"
      />
    </div>
  );
}
