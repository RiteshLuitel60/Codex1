export type SourceCatalogEntry = {
  countryCode: string;
  label: string;
  url: string;
  type: "official_gov" | "igo" | "newswire";
};

export const sourceCatalog: SourceCatalogEntry[] = [
  {
    countryCode: "fr",
    label: "Élysée",
    url: "https://www.elysee.fr/en/emmanuel-macron",
    type: "official_gov"
  },
  {
    countryCode: "fr",
    label: "Government of France",
    url: "https://www.gouvernement.fr/en/composition-of-the-government",
    type: "official_gov"
  },
  {
    countryCode: "jp",
    label: "Prime Minister's Office of Japan",
    url: "https://japan.kantei.go.jp/",
    type: "official_gov"
  }
];
