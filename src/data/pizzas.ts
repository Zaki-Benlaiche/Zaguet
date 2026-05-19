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
    id: 'margherita',
    category: 'classic',
    image: '/pizza-item.png',
    price: 700,
    name: {
      fr: 'Margherita',
      ar: 'مارغريتا',
      en: 'Margherita',
    },
    description: {
      fr: "Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d'olive extra vierge.",
      ar: 'صلصة طماطم سان مارزانو، موزاريلا فيور دي لاتي، ريحان طازج، زيت زيتون بكر ممتاز.',
      en: 'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    },
  },
  {
    id: 'pepperoni',
    category: 'classic',
    image: '/pizza-item.png',
    price: 950,
    name: {
      fr: 'Pepperoni',
      ar: 'بيبروني',
      en: 'Pepperoni',
    },
    description: {
      fr: 'Pepperoni épicé, mozzarella, sauce tomate, flocons de piment rouge.',
      ar: 'بيبروني حار، موزاريلا، صلصة طماطم، فليفلة حمراء.',
      en: 'Spicy pepperoni, mozzarella, tomato sauce, red chili flakes.',
    },
  },
  {
    id: 'quattro-formaggi',
    category: 'classic',
    image: '/pizza-item.png',
    price: 1100,
    name: {
      fr: 'Quattro Formaggi',
      ar: 'الأجبان الأربعة',
      en: 'Quattro Formaggi',
    },
    description: {
      fr: 'Mozzarella, gorgonzola, parmesan affiné, chèvre frais. Pour les amoureux de fromage.',
      ar: 'موزاريلا، غورغونزولا، بارميزان معتق، جبن الماعز الطازج. للي يحب الجبن.',
      en: 'Mozzarella, gorgonzola, aged parmesan, fresh goat cheese. For cheese lovers.',
    },
  },
  {
    id: 'diavola',
    category: 'classic',
    image: '/pizza-item.png',
    price: 1000,
    name: {
      fr: 'Diavola',
      ar: 'ديافولا',
      en: 'Diavola',
    },
    description: {
      fr: 'Salami calabrais épicé, mozzarella, sauce tomate, olives noires, miel pimenté.',
      ar: 'سلامي كالابري حار، موزاريلا، صلصة طماطم، زيتون أسود، عسل حار.',
      en: 'Spicy calabrese salami, mozzarella, tomato sauce, black olives, hot honey.',
    },
  },
  {
    id: 'zaguette-speciale',
    category: 'signature',
    image: '/pizza-item.png',
    price: 1300,
    name: {
      fr: 'Zaguette Spéciale',
      ar: 'Zaguette الخاصة',
      en: 'Zaguette Special',
    },
    description: {
      fr: "La signature de la maison : merguez maison, poivrons grillés, oignons confits, mozzarella, touche d'harissa.",
      ar: 'تخصص البيت: مرقاز بيتي، فلفل مشوي، بصل مكرمل، موزاريلا، لمسة من الهريسة.',
      en: 'The house signature: homemade merguez, grilled peppers, caramelized onions, mozzarella, a touch of harissa.',
    },
  },
  {
    id: 'capricciosa',
    category: 'signature',
    image: '/pizza-item.png',
    price: 1200,
    name: {
      fr: 'Capricciosa',
      ar: 'كابريتشوزا',
      en: 'Capricciosa',
    },
    description: {
      fr: 'Jambon, champignons, artichauts, olives, œuf, mozzarella. La classique italienne par excellence.',
      ar: 'لحم مدخن، فطر، خرشوف، زيتون، بيضة، موزاريلا. الكلاسيكية الإيطالية بامتياز.',
      en: 'Ham, mushrooms, artichokes, olives, egg, mozzarella. The Italian classic at its best.',
    },
  },
  {
    id: 'quattro-stagioni',
    category: 'signature',
    image: '/pizza-item.png',
    price: 1200,
    name: {
      fr: 'Quattro Stagioni',
      ar: 'الفصول الأربعة',
      en: 'Quattro Stagioni',
    },
    description: {
      fr: 'Quatre saisons dans une pizza : jambon, champignons, artichauts, olives — chacun dans son quartier.',
      ar: 'أربع فصول في بيتزا وحدة: لحم مدخن، فطر، خرشوف، زيتون — كل فصل في ركن.',
      en: 'Four seasons in one pizza: ham, mushrooms, artichokes, olives — each in its own quarter.',
    },
  },
  {
    id: 'saumon-fume',
    category: 'signature',
    image: '/pizza-item.png',
    price: 1600,
    name: {
      fr: 'Saumon Fumé',
      ar: 'السلمون المدخن',
      en: 'Smoked Salmon',
    },
    description: {
      fr: 'Base crème fraîche, mozzarella, saumon fumé, roquette, câpres, citron.',
      ar: 'قاعدة كريمة طازجة، موزاريلا، سلمون مدخن، جرجير، كبر، ليمون.',
      en: 'Crème fraîche base, mozzarella, smoked salmon, arugula, capers, lemon.',
    },
  },
  {
    id: 'ortolana',
    category: 'vegetarian',
    image: '/pizza-item.png',
    price: 850,
    name: {
      fr: 'Ortolana',
      ar: 'أورتولانا',
      en: 'Ortolana',
    },
    description: {
      fr: 'Tomates fraîches, courgettes, aubergines grillées, poivrons, oignons rouges, olives noires.',
      ar: 'طماطم طازجة، كوسة، باذنجان مشوي، فلفل، بصل أحمر، زيتون أسود.',
      en: 'Fresh tomatoes, zucchini, grilled eggplant, peppers, red onions, black olives.',
    },
  },
  {
    id: 'funghi-tartufo',
    category: 'vegetarian',
    image: '/pizza-item.png',
    price: 1400,
    name: {
      fr: 'Funghi Tartufo',
      ar: 'فطر الكمأة',
      en: 'Funghi Tartufo',
    },
    description: {
      fr: 'Crème truffée, champignons sauvages, mozzarella, parmesan, persil frais.',
      ar: 'كريمة الكمأة، فطر بري، موزاريلا، بارميزان، معدنوس طازج.',
      en: 'Truffle cream, wild mushrooms, mozzarella, parmesan, fresh parsley.',
    },
  },
];

export function getPizzaName(pizza: PizzaData, locale: Locale): string {
  return pizza.name[locale];
}

export function getPizzaDescription(pizza: PizzaData, locale: Locale): string {
  return pizza.description[locale];
}
