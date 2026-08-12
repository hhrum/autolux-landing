import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext';
import { EntityList } from '../components/EntityList';
import { ScreenHeader } from '../components/ScreenHeader';
import { newId, reorderByIndex } from '../mock-data';

export function MenuScreen() {
  const { data, setData, saveMock } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Меню" backTo="/" />
      <EntityList
        items={data.navigation}
        getTitle={(item) => item.label}
        getSubtitle={(item) => item.href}
        editPath={(id) => `/menu/${id}`}
        onReorder={(from, to) => {
          setData((prev) => ({
            ...prev,
            navigation: reorderByIndex(
              [...prev.navigation].sort((a, b) => a.order - b.order),
              from,
              to,
            ),
          }));
          saveMock('Порядок обновлён (мок)');
        }}
        onDelete={(id) => {
          setData((prev) => ({
            ...prev,
            navigation: prev.navigation
              .filter((item) => item.id !== id)
              .map((item, i) => ({ ...item, order: i + 1 })),
          }));
          saveMock('Удалено (мок)');
        }}
        onAdd={() => {
          const id = newId('nav');
          setData((prev) => ({
            ...prev,
            navigation: [
              ...prev.navigation,
              {
                id,
                label: 'Новый пункт',
                href: '#',
                order: prev.navigation.length + 1,
              },
            ],
          }));
          navigate(`/menu/${id}`);
        }}
        addLabel="Добавить пункт"
      />
    </div>
  );
}
