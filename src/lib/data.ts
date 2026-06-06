export type Item = {
  id: string;
  title: string;
  author: string;
  type: "Book" | "Movie";
  genre: string;
  rating: number;
  ratings: string;
  description: string;
  about: string;
  pages?: number;
  language: string;
  year: number;
  coverUrl?: string;
};

const ol = (title: string) =>
  `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`;

export const items: Item[] = [
  {
    id: "paper-palace",
    title: "The Paper Palace",
    author: "Miranda Cowley Heller",
    type: "Book",
    genre: "Fiction",
    rating: 4.3,
    ratings: "12.4k",
    description:
      "A beautiful, unforgettable novel about a love affair, a summer, and a life that unravels.",
    about:
      "Over the course of a single day, Elle must decide between her loyal husband of decades and her childhood love. A sweeping, sensual story of family, secrets, and the choices that shape a life.",
    pages: 400,
    language: "English",
    year: 2021,
    coverUrl: ol("The Paper Palace"),
  },
  {
    id: "the-kite-runner",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    type: "Book",
    genre: "Literary Fiction",
    rating: 4.5,
    ratings: "98k",
    description: "A haunting tale of friendship and redemption set against Afghanistan's turbulent history.",
    about: "Amir and Hassan grow up like brothers in Kabul, until a single act of betrayal changes everything.",
    pages: 372,
    language: "English",
    year: 2003,
    coverUrl: ol("The Kite Runner"),
  },
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    type: "Book",
    genre: "Science Fiction",
    rating: 4.6,
    ratings: "210k",
    description: "Epic saga of politics, prophecy and the desert planet Arrakis.",
    about: "Paul Atreides and his family accept stewardship of Arrakis — the only source of the most valuable substance in the universe.",
    pages: 688,
    language: "English",
    year: 1965,
    coverUrl: ol("Dune"),
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    author: "Hayao Miyazaki",
    type: "Movie",
    genre: "Anime / Fantasy",
    rating: 4.8,
    ratings: "640k",
    description: "A young girl wanders into a world of spirits and must find her way home.",
    about: "Studio Ghibli's Oscar-winning fable about courage, growing up, and the quiet magic of work.",
    language: "Japanese",
    year: 2001,
    coverUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    author: "Christopher Nolan",
    type: "Movie",
    genre: "Sci-Fi Drama",
    rating: 4.7,
    ratings: "1.2M",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    about: "Nolan's meditation on love, time, and the price of survival.",
    language: "English",
    year: 2014,
    coverUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: "circe",
    title: "Circe",
    author: "Madeline Miller",
    type: "Book",
    genre: "Mythic Fiction",
    rating: 4.4,
    ratings: "180k",
    description: "The witch-goddess of Greek myth, reimagined in luminous prose.",
    about: "Banished to a deserted island, Circe hones her occult craft and crosses paths with the most famous figures of myth.",
    pages: 393,
    language: "English",
    year: 2018,
    coverUrl: ol("Circe"),
  },
];

export const getItem = (id: string) => items.find((i) => i.id === id) ?? items[0];

export type Community = {
  id: string;
  name: string;
  description: string;
  members: string;
  posts: string;
  category: "Books" | "Movies" | "Series" | "Anime";
};

export const communities: Community[] = [
  { id: "paper-palace", name: "The Paper Palace Book Club", description: "Slow reads, deep talks.", members: "2.3k", posts: "412", category: "Books" },
  { id: "dune", name: "Dune Universe Fans", description: "Bless the maker and his water.", members: "5.1k", posts: "1.2k", category: "Books" },
  { id: "ghibli", name: "Studio Ghibli Lovers", description: "A little magic, every day.", members: "8.9k", posts: "3.4k", category: "Anime" },
  { id: "nolan", name: "Nolan Films Discussion", description: "Time loops welcome.", members: "3.7k", posts: "980", category: "Movies" },
  { id: "cozy-mysteries", name: "Cozy Mysteries", description: "Tea, cats, and a body in the library.", members: "1.4k", posts: "220", category: "Books" },
  { id: "anime-classics", name: "Anime Classics", description: "From Akira to Evangelion.", members: "6.2k", posts: "2.1k", category: "Anime" },
];
