import type { AdminData } from './types';

import logo from '@/assets/images/logo.png';
import heroImg from '@/assets/images/hero.png';
import mapImg from '@/assets/images/map.png';
import comfortImg from '@/assets/images/comfort.png';
import serviceExpress from '@/assets/images/service-express.png';
import serviceComplex from '@/assets/images/service-complex.png';
import serviceDetailing from '@/assets/images/service-detailing.png';
import serviceInterior from '@/assets/images/service-interior.png';
import serviceProtection from '@/assets/images/service-protection.png';
import beforeSeats from '@/assets/images/before-seats.png';
import afterSeats from '@/assets/images/after-seats.png';
import beforePolish from '@/assets/images/before-polish.png';
import afterPolish from '@/assets/images/after-polish.png';
import iconShield from '@/assets/icons/shield-check.svg';
import iconSparkles from '@/assets/icons/sparkles.svg';
import iconWind from '@/assets/icons/wind.svg';
import iconClock from '@/assets/icons/clock.svg';

export const initialAdminData: AdminData = {
  brand: {
    name: 'AUTOLUX',
    tagline: 'DETAILING & WASH',
    phone: '8 (912) 394-04-85',
    phoneHref: 'tel:+79123940485',
    logo,
    copyright: '© 2026 AutoLux Yalutorovsk. Все права защищены.',
  },
  navigation: [
    { id: 'services', label: 'Услуги', href: '#services', order: 1 },
    { id: 'pricelist', label: 'Цены', href: '#pricelist', order: 2 },
    { id: 'value-props', label: 'Преимущества', href: '#value-props', order: 3 },
    { id: 'before-after', label: 'До / После', href: '#before-after', order: 4 },
    { id: 'contacts', label: 'Контакты', href: '#contacts', order: 5 },
  ],
  hero: {
    image: heroImg,
    badge: 'Премиальный уход в Ялуторовске',
    title: 'Мы знаем, где у машины кнопка *«Блеск»*!',
    description:
      'Профессиональный детейлинг, бережная двухфазная мойка премиальной химией и надежная защита кузова в Ялуторовске. Вернем вашему автомобилю первозданный вид за 1 визит.',
    primaryCta: {
      label: 'Рассчитать стоимость и записаться',
      href: '#contacts',
    },
    secondaryCta: {
      label: 'Наши услуги',
      href: '#services',
    },
    stats: [
      { label: 'Режим работы', value: 'Ежедневно 24/7' },
      { label: 'Только премиум', value: 'Koch, Leraton & Detail' },
      { label: 'Для вашего комфорта', value: 'Уютная зона с PS5 и кофе' },
      { label: 'Рейтинг Яндекс', value: '4.9 ★★★★★' },
    ],
  },
  sections: {
    services: {
      badge: 'Каталог услуг',
      title: 'Профессиональный уход для вашего авто',
    },
    pricelist: {
      badge: 'Прозрачные цены',
      title: 'Тарифы по классам авто',
    },
    valueProps: {
      badge: 'Почему мы',
      title: 'Детейлинг-стандарты в каждой детали',
    },
    beforeAfter: {
      badge: 'Результаты работы',
      title: 'Реальные примеры «До / После»',
    },
    comfort: {
      badge: 'Комфорт для вас',
      title: 'Уютная зона ожидания премиум класса',
    },
    reviews: {
      badge: 'Отзывы клиентов',
      title: 'Нам доверяют лучшие авто',
      titleShort: 'Нам доверяют',
      rating: 'Яндекс.Карты 4.9',
      ratingShort: 'Яндекс 4.9',
    },
    contacts: {
      badge: 'Контакты и локация',
      title: 'Ждем вас в AutoLux',
    },
  },
  services: [
    {
      id: 'express',
      title: 'Экспресс-мойка',
      description: 'Быстрый уход: сбив грязи, активная пена, сушка кузова и протирка порогов.',
      price: 'от 600 ₽',
      image: serviceExpress,
      href: '#pricelist',
      order: 1,
    },
    {
      id: 'complex',
      title: 'Комплексная мойка',
      description: 'Двухфазная безопасная мойка кузова, уборка салона пылесосом, очистка стекол.',
      price: 'от 1 200 ₽',
      image: serviceComplex,
      href: '#pricelist',
      order: 2,
    },
    {
      id: 'detailing',
      title: 'Детейлинг-мойка',
      description:
        'Детальная очистка труднодоступных мест кистями, очистка дисков и насадок выхлопа.',
      price: 'от 2 500 ₽',
      image: serviceDetailing,
      href: '#pricelist',
      order: 3,
    },
    {
      id: 'interior',
      title: 'Химчистка салона',
      description:
        'Глубокая очистка кожи и текстиля с разбором салона. Удаление любых пятен и запахов.',
      price: 'от 6 000 ₽',
      image: serviceInterior,
      href: '#pricelist',
      order: 4,
    },
    {
      id: 'protection',
      title: 'Защита кузова',
      description: 'Полировка, нанесение керамики, жидкого стекла, гидрофобных покрытий.',
      price: 'от 8 000 ₽',
      image: serviceProtection,
      href: '#pricelist',
      order: 5,
    },
  ],
  plans: [
    {
      id: 'body-wash',
      name: 'Кузовная мойка',
      from: 'от 950 ₽',
      featured: false,
      order: 1,
      rows: [
        { label: 'Седан', price: '950 ₽' },
        { label: 'Бизнес', price: '1 050 ₽' },
        { label: 'Кроссовер', price: '1 150 ₽' },
        { label: 'Кроссовер+', price: '1 200 ₽' },
        { label: 'Внедорожник', price: '1 300 ₽' },
      ],
      note: 'Коврики: +50 ₽\nВорсовые: +150 ₽',
    },
    {
      id: 'complex-lux',
      name: 'Комплекс LUX',
      from: 'от 1 500 ₽',
      featured: true,
      order: 2,
      rows: [
        { label: 'Седан', price: '1 500 ₽' },
        { label: 'Бизнес', price: '1 700 ₽' },
        { label: 'Кроссовер', price: '1 900 ₽' },
        { label: 'Кроссовер+', price: '2 000 ₽' },
        { label: 'Внедорожник', price: '2 200 ₽' },
      ],
      note: 'Воск в подарок! 🟢',
    },
    {
      id: 'complex-detailing',
      name: 'Комплекс Detailing',
      from: 'от 2 000 ₽',
      featured: false,
      order: 3,
      rows: [
        { label: 'Седан', price: '2 000 ₽' },
        { label: 'Бизнес', price: '2 200 ₽' },
        { label: 'Кроссовер', price: '2 400 ₽' },
        { label: 'Кроссовер+', price: '2 500 ₽' },
        { label: 'Внедорожник', price: '2 700 ₽' },
      ],
      note: 'Двухфазная мойка кузова премиум составами, чистка труднодоступных мест',
    },
  ],
  valueProps: [
    {
      id: 'chemistry',
      icon: iconShield,
      title: 'Премиальная химия',
      description:
        'Используем только проверенные европейские составы Koch Chemie, Leraton и линейку Detail\'er.',
      order: 1,
    },
    {
      id: 'gentle',
      icon: iconSparkles,
      title: 'Бережный подход',
      description:
        'Исключительно двухфазная бесконтактная мойка без повреждения ЛКП и хрома вашего авто.',
      order: 2,
    },
    {
      id: 'dry',
      icon: iconWind,
      title: 'Сухо на 100%',
      description:
        'Профессиональные экстракторы и сушильные пушки — вы получаете абсолютно сухой и свежий салон.',
      order: 3,
    },
    {
      id: 'hours',
      icon: iconClock,
      title: 'Режим 24/7',
      description:
        'Работаем круглосуточно, чтобы вы могли привести машину в порядок в любое удобное время.',
      order: 4,
    },
  ],
  beforeAfter: [
    {
      id: 'seats',
      title: 'Химчистка кожаных сидений',
      description: 'Удалили застарелые пятна, вернули коже матовую заводскую текстуру',
      before: beforeSeats,
      after: afterSeats,
      order: 1,
    },
    {
      id: 'polish',
      title: 'Полировка и жидкое стекло',
      description: 'Убрали паутину царапин, придали кузову глубокий зеркальный блеск',
      before: beforePolish,
      after: afterPolish,
      order: 2,
    },
  ],
  comfort: {
    image: comfortImg,
    body: `Пока ваша машина преображается в руках мастеров, вы можете провести время с максимальной пользой или комфортом в нашей клиентской зоне.

- Зерновой бодрящий кофе и чай бесплатно
- Большой Smart TV с трансляцией из боксов мойки
- Игровая приставка PlayStation 5 с топовыми играми
- Высокоскоростной бесплатный Wi-Fi для работы`,
  },
  reviews: [
    {
      id: 'alexander',
      name: 'Александр Г.',
      car: 'Porsche Cayenne',
      rating: '5.0 ★★★★★',
      ratingShort: '5.0 ★',
      text: 'Лучший детейлинг в городе. Кожа в салоне после химчистки пахнет как новая, стала матовой, ушли все старые затертости. Рекомендую однозначно комплекс LUX.',
      order: 1,
    },
    {
      id: 'ekaterina',
      name: 'Екатерина М.',
      car: 'BMW 5-серии',
      rating: '5.0 ★★★★★',
      ratingShort: '5.0 ★',
      text: 'Приезжаю сюда на мойку стабильно раз в неделю. Всегда бережный подход, химия супер пахнет. В зоне ожидания можно поиграть в плойку и выпить отличный кофе.',
      order: 2,
    },
    {
      id: 'dmitry',
      name: 'Дмитрий К.',
      car: 'Toyota Land Cruiser',
      rating: '5.0 ★★★★★',
      ratingShort: '5.0 ★',
      text: 'Сдавал машину на полировку и нанесение керамики в 2 слоя. Результат превзошел все ожидания — блеск нереальный, вода скатывается сама. Спасибо парням!',
      order: 3,
    },
  ],
  contacts: {
    map: mapImg,
    items: [
      {
        icon: 'map',
        label: 'Адрес студии',
        value: 'г. Ялуторовск, ул. Сибирская 1, корпус 1',
        valueShort: 'г. Ялуторовск, ул. Сибирская 1, к. 1',
      },
      {
        icon: 'phone',
        label: 'Телефон для связи',
        value: '8 (912) 394-04-85',
        href: 'tel:+79123940485',
      },
      {
        icon: 'clock',
        label: 'Режим работы',
        value: 'Круглосуточно 24/7, без выходных',
      },
    ],
    socials: [
      { label: 'ВКонтакте', href: '#', variant: 'vk' },
      { label: 'Telegram', href: '#', variant: 'tg' },
    ],
  },
};

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function reorderByIndex<T extends { order: number }>(
  items: T[],
  from: number,
  to: number,
): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((item, i) => ({ ...item, order: i + 1 }));
}
