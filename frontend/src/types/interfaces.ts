export interface Country {
  country_id?: number;
  country_name: string;
  country_description?: string;
  country_capital?: string;
  country_population?: number;
  country_continent?: string;
  country_language?: string;
  country_currency?: string;
  country_flag?: string;
}

export interface User {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface TravelList {
  travel_list_id?: number;
  user_id: number;
  country_id: number;
  status_id: number;
}
