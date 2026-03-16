import { Query } from "@tanstack/react-query";
import axios from "axios";

const base_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

export interface Autocomplete {
  type: string;
  features: Feature[];
  query: Query;
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
  bbox: number[];
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  datasource: Datasource;
  other_names?: { [key: string]: string };
  country: string;
  country_code: string;
  region?: string;
  state: string;
  city: string;
  iso3166_2: string;
  lon: number;
  lat: number;
  result_type: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: Timezone;
  plus_code: string;
  plus_code_short?: string;
  rank: Rank;
  place_id: string;
  county?: string;
  town?: string;
  state_code?: string;
  postcode?: string;
  county_code?: string;
}

export interface Datasource {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
}

export interface Rank {
  importance: number;
  confidence: number;
  confidence_city_level: number;
  match_type: string;
}

export interface Timezone {
  name: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
  abbreviation_STD: string;
  abbreviation_DST: string;
}

export interface Query {
  text: string;
  parsed: Parsed;

  categories: any[];
}

export interface Parsed {
  city: string;
  expected_type: string;
}

export const perfilServiceAuto = {
  getAutocompleteAdress: async (address: string): Promise<Autocomplete> => {
    const apiKey = import.meta.env.VITE_API_KEY_AUTOCOMPLETE;

    if (!apiKey) {
      throw new Error("API_KEY is not configured");
    }

    const response = await axios.get<Autocomplete>(base_URL, {
      params: {
        text: address,
        apiKey: apiKey,
        limit: 2,
      },
    });

    return response.data;
  },
};
