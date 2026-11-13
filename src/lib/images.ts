/**
 * IMAGE REGISTRY
 * ------------------------------------------------------------------
 * All photography used on the site, in one place.
 *
 * These are PLACEHOLDER photographs (Unsplash, free licence) standing in
 * until Dhara Kitchen's own food photography is supplied. Every image is
 * vegetarian. The dish photos are REPRESENTATIVE — they illustrate the kind
 * of dish, not Dhara Kitchen's actual plate — and the site says so.
 *
 * To replace one, put the file in /public/images and change `src` to
 * "/images/your-file.jpg".
 */

const unsplash = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export interface SiteImage {
  src: string;
  alt: string;
}

export const images = {
  /* Tiffin packages */
  chapatiMeal: {
    src: unsplash("1567337710282-00832b415979"),
    alt: "Chapatis served in a steel tray with bowls of vegetarian curry",
  },
  riceMeal: {
    src: unsplash("1743674453123-93356ade2891"),
    alt: "A plate of rice with dal and vegetable sides",
  },
  completeThali: {
    src: unsplash("1680993032090-1ef7ea9b51e5"),
    alt: "Steel thali with rice, chapati, dal and vegetable dishes",
  },

  /* Editorial */
  vegetables: {
    src: unsplash("1720798706592-c516eceaade1"),
    alt: "Fresh tomatoes, chillies and green vegetables",
  },
  spices: {
    src: unsplash("1596040033229-a9821ebd058d"),
    alt: "Whole Indian spices laid out on a white surface",
  },
  cooking: {
    src: unsplash("1528712306091-ed0763094c98"),
    alt: "Vegetables being stirred in a pan on the stove",
  },
  rotiOnTawa: {
    src: unsplash("1601387434127-20979856e76e"),
    alt: "A fresh chapati being cooked on a tawa",
  },
  containers: {
    src: unsplash("1633504785850-018cae02cb47"),
    alt: "Stainless steel food containers in a kitchen",
  },

  /* 15-day menu — representative dish photography */
  dalTadka: {
    src: unsplash("1755090154817-58d9d36ec988"),
    alt: "A bowl of yellow dal with a tempering of spices",
  },
  alooGobhi: {
    src: unsplash("1642821372787-a18060c5a982"),
    alt: "Spiced potato and cauliflower sabzi in a bowl",
  },
  potatoCurry: {
    src: unsplash("1708782343809-0050c38b3a1a"),
    alt: "A bowl of potato curry in a spiced gravy",
  },
  dalBowl: {
    src: unsplash("1736680056444-02b10f16a245"),
    alt: "Dal served in a brass bowl, garnished with herbs",
  },
  blackChanna: {
    src: unsplash("1591940597372-bd266c6eb29e"),
    alt: "Black chana served on a plate",
  },
  mixVeg: {
    src: unsplash("1695720247911-817755ad7d02"),
    alt: "Potato and mixed vegetable sabzi served with rice",
  },
  greenDal: {
    src: unsplash("1626500154744-e4b394ffea16"),
    alt: "A bowl of green dal with fresh chillies",
  },
  vegStew: {
    src: unsplash("1612700722193-f0410adb8949"),
    alt: "A bowl of vegetarian curry garnished with coriander",
  },
  chanaDalGrains: {
    src: unsplash("1612869538502-b5baa439abd7"),
    alt: "Split chana dal lentils",
  },
  spicedPotatoes: {
    src: unsplash("1596560981701-bfadc91c47ce"),
    alt: "Spiced potatoes in a bowl with green chillies and herbs",
  },
  beans: {
    src: unsplash("1733562256707-c13261bfd0a9"),
    alt: "Dried rajma beans",
  },
  dalPot: {
    src: unsplash("1697155406121-85aac6236000"),
    alt: "Dal simmering in a pot",
  },
  mixedPulses: {
    src: unsplash("1786994060314-eccbdd13066d"),
    alt: "Assorted lentils and pulses arranged in a flower pattern",
  },
  rajmaRice: {
    src: unsplash("1668236534990-73c4ed23043c"),
    alt: "Rajma curry served with rice",
  },
  pumpkinCurry: {
    src: unsplash("1588166524941-3bf61a9c41db"),
    alt: "Pumpkin curry served with rice",
  },
} satisfies Record<string, SiteImage>;

/** Small illustrated ingredients used by the cursor image trail. */
export const trailImages: string[] = [
  "/images/trail/tulsi.svg",
  "/images/trail/roti.svg",
  "/images/trail/coriander.svg",
  "/images/trail/tomato.svg",
  "/images/trail/chili.svg",
  "/images/trail/vegetables.svg",
  "/images/trail/thali.svg",
  "/images/trail/spices.svg",
];
