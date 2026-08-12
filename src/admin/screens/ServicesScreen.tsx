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

export function ServicesScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();
  const [header, setHeader] = useState<SectionMeta>(data.sections.services);

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Услуги" backTo="/" />
      <div className="space-y-4 p-3">
        <SectionHeaderFields value={header} onChange={setHeader} />
        <FormActions
          className="static border-0 p-0"
          onCancel={() => setHeader(data.sections.services)}
          onSave={() => {
            setData((prev) => ({
              ...prev,
              sections: { ...prev.sections, services: header },
            }));
            saveMock();
          }}
          saveLabel="Сохранить шапку"
        />
      </div>
      <Separator />
      <EntityList
        items={data.services}
        getTitle={(item) => item.title}
        getSubtitle={(item) => item.price}
        editPath={(id) => `/services/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            services: reorderByIndex(
              [...prev.services].sort((a, b) => a.order - b.order),
              from,
              to,
            ),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            services: prev.services
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('service');
          setData((prev) => ({
            ...prev,
            services: [
              ...prev.services,
              {
                id,
                title: 'Новая услуга',
                description: '',
                price: 'от 0 ₽',
                image: '',
                href: '#pricelist',
                order: prev.services.length + 1,
              },
            ],
          }));
          navigate(`/services/${id}`);
        }}
        addLabel="Добавить услугу"
      />
    </div>
  );
}
