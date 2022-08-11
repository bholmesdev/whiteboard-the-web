export type TweetResponse = {
  data: Tweet[];
  includes: {
    media: Media[];
  }
  meta: {};
}

export type Tweet = {
  id: string;
  text: string;
  entities?: {
    hashtags?: {
      start: number;
      end: number;
      tag: string;
    }[];
  };
  attachments?: {
    media_keys: string[];
  };
}

export type Variant = {
  content_type: 'video/mp4' | 'application/x-mpegURL';
  bit_rate?: number;
  url: string;
};

export type Media = {
  media_key: string;
} & ({ type: 'photo' } | {
  type: 'video';
  variants: Variant[];
});