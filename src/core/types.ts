export interface Address {
  name: string;
  address: string;
}

export interface Brand {
  id: string;
  name: string;
  domain?: string;
  addresses?: readonly Address[];
}

export interface ClientConfig {
  id: "3group" | "tcc";
  title: string;
  basePath: string;
  brandLabel: string;
  brands: readonly Brand[];
  autoGenerateEmail: boolean;
  phoneRequired: boolean;
  ddiEnabled: boolean;
  minimalTemplateBrands: readonly string[];
  uppercaseName: (brandId: string) => boolean;
}

export interface SignatureValues {
  template: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  ddi?: string;
  address?: string;
  imageUrl: string;
}
