import type { Address, ClientConfig } from "../core/types";

const nzmaAddresses: readonly Address[] = [
  { name: "Auckland Symonds Street Campus", address: "100 Symonds Street, Grafton, Auckland 1010" },
  { name: "Auckland Manukau Campus", address: "621 Great South Road, Manukau, Auckland 2104" },
  { name: "Otahuhu Campus", address: "12-16 Gordon Road, Otahuhu, Auckland 1062" },
  { name: "Sylvia Park Campus", address: "56-60 Carbine Road, Mount Wellington, Auckland 1060" },
  { name: "Trades Campus", address: "807 Great South Road, Mount Wellington, Auckland 1060" },
  { name: "Christchurch Campus", address: "365 Madras Street, Christchurch Central City, Christchurch 8013" },
  { name: "Rotorua Campus", address: "1224 Eruera Street, Rotorua 3010" },
  { name: "Waikato Campus", address: "94 Tristram Street, Hamilton 3204" },
  { name: "Wellington Porirua", address: "1 Prosser Street, Elsdon, Porirua 5022" },
  { name: "Wellington Central Campus", address: "2 Bunny Street, Pipitea, Wellington 6011" },
];

export const tccConfig: ClientConfig = {
  id: "tcc",
  title: "UP Education Signature Builder",
  intro: "Create a signature for your school and campus.",
  basePath: "/tcc/signature-builder",
  brandLabel: "School",
  autoGenerateEmail: false,
  phoneRequired: false,
  ddiEnabled: false,
  minimalTemplateBrands: ["1"],
  uppercaseName: () => false,
  brands: [
    {
      id: "1",
      name: "Culinary Collective",
      addresses: [
        { name: "Auckland Central", address: "100 Symonds St, Auckland Central, 1010" },
        { name: "Mt Wellington", address: "56-60 Carbine Road, Mt Wellington, 1060" },
        { name: "Hamilton", address: "94 Tristram Street, Hamilton 3204" },
      ],
    },
    {
      id: "2",
      name: "NZ College of Massage",
      addresses: [
        { name: "Auckland Campus", address: "Building C, 382-384 Manukau Rd, Greenlane, Auckland" },
        { name: "Wellington Campus", address: "2 Bunny St, Pipitea, Wellington 6011" },
        { name: "Christchurch Campus", address: "66b Wharenui Rd, Riccarton, Christchurch" },
      ],
    },
    {
      id: "3",
      name: "NZ Institute of Sport",
      addresses: [
        { name: "Auckland Campus (Head Office)", address: "382 Manukau Rd, Epsom, Auckland 1023" },
        { name: "Wellington Campus", address: "Level 1, 2 Bunny St, Pipitea, Wellington 6011" },
        { name: "Christchurch Campus", address: "66b Wharenui Rd, Riccarton, Christchurch" },
      ],
    },
    { id: "4", name: "NZMA", addresses: nzmaAddresses },
    { id: "5", name: "NZMA Group", addresses: nzmaAddresses },
  ],
};
