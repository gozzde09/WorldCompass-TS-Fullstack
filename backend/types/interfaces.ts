export interface Country {
  country_id: number; // Primärnyckel
  country_name: string; // Landets namn
  country_description?: string; // Beskrivning (valfritt)
  country_capital?: string; // Huvudstad (valfritt)
  country_population?: number; // Befolkning (valfritt)
  country_continent?: string; // Kontinent (valfritt)
  country_language?: string; // Språk (valfritt)
  country_currency?: string; // Valuta (valfritt)
}

export interface User {
  user_id: number; // Primärnyckel
  first_name: string; // Förnamn
  last_name: string; // Efternamn
  email: string; // E-postadress
  password: string; // Hashat lösenord
}

export interface Status {
  status_id: number; // Primärnyckel
  status_name: string; // Statusnamn (t.ex. 'Visited', 'Want to visit')
}
export interface BucketList {
  bucket_list_id: number; // Primärnyckel
  user_id: number; // Referens till User-tabellen
  country_id: number; // Referens till Country-tabellen
  status_id: number; // Referens till Status-tabellen
  notes?: string; // Anteckningar (valfritt)
}
