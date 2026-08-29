import type { ClientConfig } from "../core/types";

export const threeGroupConfig: ClientConfig = {
  id: "3group",
  title: "3Group Signature Builder",
  intro: "Create a consistent signature for your 3Group brand.",
  basePath: "/3group",
  brandLabel: "Brand",
  autoGenerateEmail: true,
  phoneRequired: true,
  ddiEnabled: true,
  minimalTemplateBrands: [],
  uppercaseName: (brandId) => brandId !== "3",
  brands: [
    { id: "1", name: "3Group", domain: "3group.co.nz" },
    { id: "6", name: "3Capital", domain: "3capital.co.nz" },
    { id: "2", name: "A3", domain: "a3assetmanagement.co.nz" },
    { id: "3", name: "B3", domain: "b3interiors.co.nz" },
    { id: "4", name: "C3", domain: "c3construction.co.nz" },
    { id: "5", name: "D3", domain: "d3development.co.nz" },
  ],
};
