import type { Locale } from '@/i18n/config';

export type PizzaCategory = 'classic' | 'signature' | 'vegetarian';

export interface LocalizedText {
  fr: string;
  ar: string;
  en: string;
}

export interface PizzaData {
  id: string;
  category: PizzaCategory;
  image: string;
  price: number;
  name: LocalizedText;
  description: LocalizedText;
}

export const pizzas: PizzaData[] = [
  {
    id: 'margherita-royale',
    category: 'classic',
    image: '/pizza-item.png',
    price: 65,
    name: {
      fr: 'Margherita Royale',
      ar: 'مارغريتا رويال',
      en: 'Royal Margherita',
    },
    description: {
      fr: 'Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d\'olive extra vierge.',
      ar: 'صلصة طماطم سان مارزانو، موزاريلا فيور دي لاتي، ريحان طازج، زيت زيتون بكر ممتاز.',
      en: 'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    },
  },
  {
    id: 'pepperoni-feu',
    category: 'classic',
    image: '/pizza-item.png',
    price: 85,
    name: {
      fr: 'Pepperoni Feu',
      ar: 'بيبروني الجمر',
      en: 'Fire Pepperoni',
    },
    description: {
      fr: 'Double pepperoni, mozzarella, miel pimenté, flocons de piment rouge.',
      ar: 'بيبروني مضاعف، موزاريلا، عسل حار، فليفلة حمراء.',
      en: 'Double pepperoni, mozzarella, spicy honey drizzle, red chili flakes.',
    },
  },
  {
    id: 'quatre-fromages',
    category: 'classic',
    image: '/pizza-item.png',
    price: 90,
    name: {
      fr: 'Quatre Fromages',
      ar: 'الأجبان الأربعة',
      en: 'Four Cheese',
    },
    description: {
      fr: 'Mozzarella, gorgonzola doux, parmesan affiné, chèvre frais.',
      ar: 'موزاريلا، غورغونزولا، بارميزان معتق، جبن الماعز الطازج.',
      en: 'Mozzarella, mild gorgonzola, aged parmesan, fresh goat cheese.',
    },
  },
  {
    id: 'zaguet-speciale',
    category: 'signature',
    image: '/pizza-item.png',
    price: 95,
    name: {
      fr: 'Zaguet Spéciale',
      ar: 'زاكيت الخاصة',
      en: 'Zaguet Special',
    },
    description: {
      fr: 'Merguez maison, poivrons grillés, oignons confits, harissa douce.',
      ar: 'مرقاز بيتي، فلفل مشوي، بصل مكرمل، هريسة خفيفة.',
      en: 'Homemade merguez sausage, grilled peppers, caramelized onions, mild harissa.',
    },
  },
  {
    id: 'tajine-berbere',
    category: 'signature',
    image: '/pizza-item.png',
    price: 100,
    name: {
      fr: 'Tajine Berbère',
      ar: 'الطاجين الأمازيغي',
      en: 'Berber Tagine',
    },
    description: {
      fr: 'Poulet mariné aux épices, olives violettes, citron confit, oignons, persil frais.',
      ar: 'دجاج متبل بالتوابل، زيتون أرجواني، ليمون مصبر، بصل، معدنوس طازج.',
      en: 'Spice-marinated chicken, purple olives, preserved lemon, onions, fresh parsley.',
    },
  },
  {
    id: 'kefta-marocaine',
    category: 'signature',
    image: '/pizza-item.png',
    price: 95,
    name: {
      fr: 'Kefta Marocaine',
      ar: 'الكفتة المغربية',
      en: 'Moroccan Kefta',
    },
    description: {
      fr: 'Bœuf haché épicé, œuf, oignons doux, cumin, coriandre fraîche.',
      ar: 'لحم بقري مفروم متبل، بيضة، بصل، كمون، قزبر طازج.',
      en: 'Spiced minced beef, egg, sweet onions, cumin, fresh coriander.',
    },
  },
  {
    id: 'saumon-fume',
    category: 'signature',
    image: '/pizza-item.png',
    price: 120,
    name: {
      fr: 'Saumon Fumé',
      ar: 'السلمون المدخن',
      en: 'Smoked Salmon',
    },
    description: {
      fr: 'Saumon fumé, mozzarella, roquette, citron, câpres, crème fraîche.',
      ar: 'سلمون مدخن، موزاريلا، جرجير، ليمون، كبر، كريمة طازجة.',
      en: 'Smoked salmon, mozzarella, arugula, lemon, capers, crème fraîche.',
    },
  },
  {
    id: 'jardin-du-souss',
    category: 'vegetarian',
    image: '/pizza-item.png',
    price: 70,
    name: {
      fr: 'Jardin du Souss',
      ar: 'حديقة سوس',
      en: 'Souss Garden',
    },
    description: {
      fr: 'Tomates fraîches, courgettes, aubergines grillées, poivrons, olives noires.',
      ar: 'طماطم طازجة، كوسة، باذنجان مشوي، فلفل، زيتون أسود.',
      en: 'Fresh tomatoes, zucchini, grilled eggplant, peppers, black olives.',
    },
  },
  {
    id: 'champignons-truffe',
    category: 'vegetarian',
    image: '/pizza-item.png',
    price: 110,
    name: {
      fr: 'Champignons Truffe',
      ar: 'فطر الكمأة',
      en: 'Truffle Mushroom',
    },
    description: {
      fr: 'Champignons sauvages, crème truffée, oignons caramélisés, thym frais.',
      ar: 'فطر بري، كريمة الكمأة، بصل مكرمل، زعتر طازج.',
      en: 'Wild mushrooms, truffle cream, caramelized onions, fresh thyme.',
    },
  },
];

export function getPizzaName(pizza: PizzaData, locale: Locale): string {
  return pizza.name[locale];
}

export function getPizzaDescription(pizza: PizzaData, locale: Locale): string {
  return pizza.description[locale];
}
