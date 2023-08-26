type JsonPrimitive = null | number | string | boolean;
type NestedArray<V> = Array<V | NestedArray<V>>;
type Nested<V> = V | { [s: string]: V | Nested<V> } | Array<V | Nested<V>>;
type Json = Nested<JsonPrimitive>;
type ScalarField<T> = T | ((context: { seed: string, index: number }) => Promise<T> | T);
type MapScalarField<T extends Record<string, any>> = {
  [K in keyof T]: ScalarField<T[K]>;
};
type ModelInputs<
  TFields extends Record<string, any>,
  TParents extends Record<string, any> = {},
  TChildren extends Record<string, any> = {}
> = {
  data?: Partial<MapScalarField<TFields> & TParents & TChildren>;
  count?: number | ((context: { seed: string }) => number);
  connect?: (context: { seed: string; index: number; store: Store }) => TFields | undefined;
};
type OmitDataFields<
  T extends { data?: Record<string, any> },
  TKeys extends keyof NonNullable<T["data"]>
> = Omit<T, "data"> & { data?: Omit<NonNullable<T["data"]>, TKeys> };
export interface IPlan {
  generate: () => Promise<Store>;
}
interface Plan extends IPlan {
  pipe: Pipe;
  merge: Merge;
}
export type Pipe = (plans: IPlan[]) => IPlan;
export type Merge =  (plans: IPlan[]) => IPlan;
type Store = {
  titles: titles[];
  titles_to_users: titles_to_users[];
  users: users[];
};
type genre = "Action" | "Action & Adventure" | "Adventure" | "Animation" | "Comedy" | "Crime" | "Documentary" | "Drama" | "Family" | "Fantasy" | "History" | "Horror" | "Kids" | "Music" | "Mystery" | "News" | "Reality" | "Romance" | "Sci-Fi & Fantasy" | "Science Fiction" | "Soap" | "TV Movie" | "Talk" | "Thriller" | "Unknown" | "War" | "War & Politics" | "Western";
type mediaType = "anime" | "movie" | "tv";
type titles = {
  "dateAdded": string;
  "dateWatched": string | null;
  "genre": genre;
  "id": number;
  "isWatched": boolean;
  "mediaType": mediaType;
  "name": string;
  "tmdbId": string;
  "tmdbOverview": string;
  "tmdbPosterPath": string;
  "userDescription": string | null;
  "userRating": number | null;
}
type titlesParents = {

};
type titlesChildren = {
 titles_to_users: OmitDataFields<titles_to_usersModel, "titles">;
};
type titlesModel = ModelInputs<titles, titlesParents, titlesChildren>;
type titles_to_users = {
  "title_id": number;
  "user_id": number;
}
type titles_to_usersParents = {
 titles: OmitDataFields<titlesModel, "titles_to_users">;
 users: OmitDataFields<usersModel, "titles_to_users">;
};
type titles_to_usersChildren = {

};
type titles_to_usersModel = ModelInputs<titles_to_users, titles_to_usersParents, titles_to_usersChildren>;
type users = {
  "id": number;
  "name": string;
}
type usersParents = {

};
type usersChildren = {
 titles_to_users: OmitDataFields<titles_to_usersModel, "users">;
};
type usersModel = ModelInputs<users, usersParents, usersChildren>;
export type SnapletClient = {
  titles: (inputs: titlesModel) => Plan;
  titles_to_users: (inputs: titles_to_usersModel) => Plan;
  users: (inputs: usersModel) => Plan;
};