export type NavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
};

export type BrandData = {
  name: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  logo: string;
  copyright: string;
};

export type HeroData = {
  image: string;
  badge: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: { label: string; value: string }[];
};

export type SectionMeta = {
  badge: string;
  title: string;
  titleShort?: string;
  rating?: string;
  ratingShort?: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  href: string;
  order: number;
};

export type PlanItem = {
  id: string;
  name: string;
  from: string;
  featured: boolean;
  order: number;
  rows: { label: string; price: string }[];
  note: string;
};

export type ValuePropItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
};

export type BeforeAfterItem = {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  order: number;
};

export type ComfortData = {
  image: string;
  body: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  car: string;
  rating: string;
  ratingShort: string;
  text: string;
  order: number;
};

export type ContactItem = {
  icon: 'map' | 'phone' | 'clock';
  label: string;
  value: string;
  valueShort?: string;
  href?: string;
};

export type SocialItem = {
  label: string;
  href: string;
  variant: 'vk' | 'tg';
};

export type ContactsData = {
  map: string;
  items: ContactItem[];
  socials: SocialItem[];
};

export type AdminData = {
  brand: BrandData;
  navigation: NavItem[];
  hero: HeroData;
  sections: {
    services: SectionMeta;
    pricelist: SectionMeta;
    valueProps: SectionMeta;
    beforeAfter: SectionMeta;
    comfort: SectionMeta;
    reviews: SectionMeta;
    contacts: SectionMeta;
  };
  services: ServiceItem[];
  plans: PlanItem[];
  valueProps: ValuePropItem[];
  beforeAfter: BeforeAfterItem[];
  comfort: ComfortData;
  reviews: ReviewItem[];
  contacts: ContactsData;
};
