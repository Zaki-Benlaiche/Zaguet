import type { Locale } from '@/i18n/config';

// Note: the file is named "pizzas" for legacy reasons but contains the full
// menu (pizza, pasta, antipasti, desserts, drinks).

export type MenuCategory =
  | 'classic'
  | 'signature'
  | 'vegetarian'
  | 'pasta'
  | 'antipasti'
  | 'dessert'
  | 'drink';

export type PizzaCategory = MenuCategory; // alias for backward compat

export interface LocalizedText {
  fr: string;
  ar: string;
  en: string;
}

export interface PizzaData {
  id: string;
  category: MenuCategory;
  image: string;
  price: number;
  name: LocalizedText;
  description: LocalizedText;
}

export const pizzas: PizzaData[] = [
  // ============= PIZZA — CLASSIQUE =============
  {
    id: 'margherita',
    category: 'classic',
    image: '/pizza-duo.png',
    price: 700,
    name: { fr: 'Margherita', ar: 'مارغريتا', en: 'Margherita' },
    description: {
      fr: "Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d'olive extra vierge.",
      ar: 'صلصة طماطم سان مارزانو، موزاريلا فيور دي لاتي، ريحان طازج، زيت زيتون بكر ممتاز.',
      en: 'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    },
  },
  {
    id: 'pepperoni',
    category: 'classic',
    image: '/pizzas-table.png',
    price: 950,
    name: { fr: 'Pepperoni', ar: 'بيبروني', en: 'Pepperoni' },
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
    name: { fr: 'Quattro Formaggi', ar: 'الأجبان الأربعة', en: 'Quattro Formaggi' },
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
    name: { fr: 'Diavola', ar: 'ديافولا', en: 'Diavola' },
    description: {
      fr: 'Salami calabrais épicé, mozzarella, sauce tomate, olives noires, miel pimenté.',
      ar: 'سلامي كالابري حار، موزاريلا، صلصة طماطم، زيتون أسود، عسل حار.',
      en: 'Spicy calabrese salami, mozzarella, tomato sauce, black olives, hot honey.',
    },
  },

  // ============= PIZZA — SIGNATURE ZAGUETTE =============
  {
    id: 'zaguette-speciale',
    category: 'signature',
    image: '/pizza-duo.png',
    price: 1300,
    name: { fr: 'Zaguette Spéciale', ar: 'Zaguette الخاصة', en: 'Zaguette Special' },
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
    name: { fr: 'Capricciosa', ar: 'كابريتشوزا', en: 'Capricciosa' },
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
    name: { fr: 'Quattro Stagioni', ar: 'الفصول الأربعة', en: 'Quattro Stagioni' },
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
    name: { fr: 'Saumon Fumé', ar: 'السلمون المدخن', en: 'Smoked Salmon' },
    description: {
      fr: 'Base crème fraîche, mozzarella, saumon fumé, roquette, câpres, citron.',
      ar: 'قاعدة كريمة طازجة، موزاريلا، سلمون مدخن، جرجير، كبر، ليمون.',
      en: 'Crème fraîche base, mozzarella, smoked salmon, arugula, capers, lemon.',
    },
  },

  // ============= PIZZA — VÉGÉTARIENNE =============
  {
    id: 'ortolana',
    category: 'vegetarian',
    image: '/pizza-item.png',
    price: 850,
    name: { fr: 'Ortolana', ar: 'أورتولانا', en: 'Ortolana' },
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
    name: { fr: 'Funghi Tartufo', ar: 'فطر الكمأة', en: 'Funghi Tartufo' },
    description: {
      fr: 'Crème truffée, champignons sauvages, mozzarella, parmesan, persil frais.',
      ar: 'كريمة الكمأة، فطر بري، موزاريلا، بارميزان، معدنوس طازج.',
      en: 'Truffle cream, wild mushrooms, mozzarella, parmesan, fresh parsley.',
    },
  },

  // ============= PASTA =============
  {
    id: 'spaghetti-bolognese',
    category: 'pasta',
    image: '/pizza-item.png',
    price: 1000,
    name: { fr: 'Spaghetti Bolognese', ar: 'سباغيتي بولونيز', en: 'Spaghetti Bolognese' },
    description: {
      fr: 'Spaghetti al dente, sauce bolognaise mijotée, parmesan râpé, basilic frais.',
      ar: 'سباغيتي مطبوخة، صلصة بولونيز مطهية، بارميزان مبشور، ريحان طازج.',
      en: 'Spaghetti al dente, slow-cooked bolognese sauce, grated parmesan, fresh basil.',
    },
  },
  {
    id: 'penne-arrabbiata',
    category: 'pasta',
    image: '/pizza-item.png',
    price: 900,
    name: { fr: 'Penne Arrabbiata', ar: 'بيني أرابياتا', en: 'Penne Arrabbiata' },
    description: {
      fr: "Penne, sauce tomate épicée à l'ail et au piment, persil, huile d'olive.",
      ar: 'بيني، صلصة طماطم حارة بالثوم والفلفل، معدنوس، زيت زيتون.',
      en: 'Penne, spicy garlic-and-chili tomato sauce, parsley, olive oil.',
    },
  },
  {
    id: 'lasagne-al-forno',
    category: 'pasta',
    image: '/pizza-item.png',
    price: 1200,
    name: { fr: 'Lasagne al Forno', ar: 'لازانيا الفرن', en: 'Lasagne al Forno' },
    description: {
      fr: 'Lasagne traditionnelle au ragù de bœuf, béchamel, mozzarella, parmesan, cuite au four.',
      ar: 'لازانيا تقليدية بصلصة لحم البقر، بشاميل، موزاريلا، بارميزان، مطبوخة في الفرن.',
      en: 'Traditional beef ragù lasagne, béchamel, mozzarella, parmesan, oven-baked.',
    },
  },
  {
    id: 'tagliatelle-pesto',
    category: 'pasta',
    image: '/pizza-item.png',
    price: 1100,
    name: { fr: 'Tagliatelle al Pesto', ar: 'تالياتيلي بالبيستو', en: 'Tagliatelle al Pesto' },
    description: {
      fr: 'Tagliatelle fraîches, pesto au basilic, pignons de pin, parmesan affiné, huile d\'olive.',
      ar: 'تالياتيلي طازجة، بيستو الريحان، بذور الصنوبر، بارميزان معتق، زيت زيتون.',
      en: 'Fresh tagliatelle, basil pesto, pine nuts, aged parmesan, olive oil.',
    },
  },

  // ============= ANTIPASTI =============
  {
    id: 'bruschetta',
    category: 'antipasti',
    image: '/pizza-item.png',
    price: 450,
    name: { fr: 'Bruschetta al Pomodoro', ar: 'بروسكيتا بالطماطم', en: 'Bruschetta al Pomodoro' },
    description: {
      fr: "Pain grillé sur braise, tomates fraîches concassées, ail, basilic, huile d'olive.",
      ar: 'خبز مشوي على الجمر، طماطم طازجة مفرومة، ثوم، ريحان، زيت زيتون.',
      en: 'Wood-fire-toasted bread, fresh diced tomatoes, garlic, basil, olive oil.',
    },
  },
  {
    id: 'caprese',
    category: 'antipasti',
    image: '/pizza-item.png',
    price: 700,
    name: { fr: 'Insalata Caprese', ar: 'سلطة كابريزي', en: 'Insalata Caprese' },
    description: {
      fr: 'Mozzarella di bufala, tomates mûres, basilic frais, huile d\'olive extra vierge.',
      ar: 'موزاريلا الجاموس، طماطم ناضجة، ريحان طازج، زيت زيتون بكر ممتاز.',
      en: 'Buffalo mozzarella, ripe tomatoes, fresh basil, extra virgin olive oil.',
    },
  },
  {
    id: 'carpaccio-boeuf',
    category: 'antipasti',
    image: '/pizza-item.png',
    price: 1100,
    name: { fr: 'Carpaccio de Bœuf', ar: 'كارباتشيو لحم البقر', en: 'Beef Carpaccio' },
    description: {
      fr: 'Fines tranches de bœuf cru, roquette, copeaux de parmesan, citron, huile d\'olive.',
      ar: 'شرائح رفيعة من لحم البقر النيء، جرجير، رقائق بارميزان، ليمون، زيت زيتون.',
      en: 'Thin slices of raw beef, arugula, parmesan shavings, lemon, olive oil.',
    },
  },

  // ============= DESSERTS =============
  {
    id: 'tiramisu',
    category: 'dessert',
    image: '/pizza-item.png',
    price: 500,
    name: { fr: 'Tiramisu', ar: 'تيراميسو', en: 'Tiramisu' },
    description: {
      fr: 'Le classique italien : mascarpone, café espresso, biscuits, cacao en poudre.',
      ar: 'الكلاسيكية الإيطالية: ماسكاربوني، قهوة إسبريسو، بسكويت، كاكاو بودرة.',
      en: 'The Italian classic: mascarpone, espresso coffee, ladyfingers, cocoa powder.',
    },
  },
  {
    id: 'panna-cotta',
    category: 'dessert',
    image: '/pizza-item.png',
    price: 450,
    name: { fr: 'Panna Cotta', ar: 'بانا كوتا', en: 'Panna Cotta' },
    description: {
      fr: 'Crème onctueuse à la vanille, coulis de fruits rouges maison.',
      ar: 'كريمة فانيلا ناعمة، صلصة الفواكه الحمراء البيتية.',
      en: 'Silky vanilla cream, homemade red-berry coulis.',
    },
  },
  {
    id: 'cheesecake',
    category: 'dessert',
    image: '/pizza-item.png',
    price: 500,
    name: { fr: 'Cheesecake', ar: 'تشيز كيك', en: 'Cheesecake' },
    description: {
      fr: 'Base biscuit, crème au fromage, coulis de fraises fraîches.',
      ar: 'قاعدة بسكويت، كريمة الجبن، صلصة الفراولة الطازجة.',
      en: 'Biscuit base, cream cheese filling, fresh strawberry coulis.',
    },
  },

  // ============= BOISSONS =============
  {
    id: 'coca-cola',
    category: 'drink',
    image: '/pizza-item.png',
    price: 150,
    name: { fr: 'Coca-Cola 33cl', ar: 'كوكا كولا 33سل', en: 'Coca-Cola 33cl' },
    description: {
      fr: 'Canette 33cl bien fraîche.',
      ar: 'علبة 33سل باردة.',
      en: 'Ice-cold 33cl can.',
    },
  },
  {
    id: 'eau-minerale',
    category: 'drink',
    image: '/pizza-item.png',
    price: 80,
    name: { fr: 'Eau minérale 50cl', ar: 'ماء معدني 50سل', en: 'Mineral water 50cl' },
    description: {
      fr: 'Eau minérale plate ou gazeuse.',
      ar: 'ماء معدني عادي أو غازي.',
      en: 'Still or sparkling mineral water.',
    },
  },
  {
    id: 'jus-orange',
    category: 'drink',
    image: '/pizza-item.png',
    price: 250,
    name: { fr: "Jus d'orange frais", ar: 'عصير برتقال طازج', en: 'Fresh orange juice' },
    description: {
      fr: 'Pressé minute, 100% oranges fraîches.',
      ar: 'معصور للحظة، 100% برتقال طازج.',
      en: 'Freshly squeezed, 100% real oranges.',
    },
  },
  {
    id: 'espresso',
    category: 'drink',
    image: '/pizza-item.png',
    price: 120,
    name: { fr: 'Espresso italien', ar: 'إسبريسو إيطالي', en: 'Italian espresso' },
    description: {
      fr: 'Café italien authentique, mouture fine, crème dorée.',
      ar: 'قهوة إيطالية أصيلة، طحن ناعم، كريمة ذهبية.',
      en: 'Authentic Italian coffee, fine grind, golden crema.',
    },
  },
];

export function getPizzaName(pizza: PizzaData, locale: Locale): string {
  return pizza.name[locale];
}

export function getPizzaDescription(pizza: PizzaData, locale: Locale): string {
  return pizza.description[locale];
}
