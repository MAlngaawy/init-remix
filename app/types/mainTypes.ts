export type ContactType = {
  id: string;
  first: string;
  last: string;
  twitter?: string;
  avatar?: string;
  notes?: string;
  favorite?: boolean;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};
