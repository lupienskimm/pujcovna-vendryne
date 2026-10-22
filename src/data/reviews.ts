export type Review = {
  author: string;
  text: string;
  rating: number;
  date?: string;
  avatar?: string | null;
};

/** Good Google / site reviews only (4–5★). */
export const reviews: Review[] = [
  {
    author: "Tereza Odehnalova",
    text: "Perfektní přístup. Velmi vstřícní a ochotní. Velice doporučuji.",
    rating: 5,
    avatar: null,
  },
  {
    author: "Miroslav Noga",
    text: "Zatím jsem byl s mechanizací vždy spokojen. Vánoční stromky jsou kvalitní 😅",
    rating: 4,
    avatar: null,
  },
  {
    author: "DISK DISK",
    date: "2023-09-01",
    text: "Doporučuji, velice ochotný personál , poradí se strojem a používáním.. Skvěla domluva :) určitě se znovu stavím. Děkuji",
    rating: 5,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocJfbVv0bP_iZ8SFepX0GWiXA0jGZsRTNRmFTw94OlEfxa7a5g=s120-c-rp-mo-br100",
  },
  {
    author: "Michal Kopťár",
    date: "2023-08-12",
    text: "Navštíveno několikrát a vždy spokojenost. Když nevím, poradí. Rád se vracím.",
    rating: 5,
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjUwn7LuswLHoWHw6JhWg2DmtoAXiBMojxqSpPtbbXMYMq53WxNP=s120-c-rp-mo-ba3-br100",
  },
  {
    author: "Martin Gryga",
    date: "2023-08-10",
    text: "Doporučuji",
    rating: 5,
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjU-NEnD17Fucn3WPtKLH_kAwrD_YZVcbTJQ59_mcbxLRDJEMxw=s120-c-rp-mo-br100",
  },
  {
    author: "Radim Górecki",
    date: "2022-12-29",
    text: "Vřele mohu doporučit. Půjčovnu jsem využil už několikrát. Jak s rezačkou na venkovní dlažbu, vibrační desku, tak teď i v zimě elektrické ohřívače. Mají zde opravdu velký výběr všeho co člověk nejvíc používá. Mají zde i velké stroje jako nakladače, plošiny apod. Ale s tím zatím zkušenost nemám. Závěrem velkým plusem je jejich pozitivní přístup , ten je opravdu z 1*",
    rating: 5,
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocL-s8-zxb7-htkJioOyzk2wunOsE4R33j6mxr3mnhapytHeLg=s120-c-rp-mo-ba5-br100",
  },
];
