export type TweetResponse = {
  data: Tweet[];
  includes: {
    media: Media[];
  }
  meta: any;
}

export type Tweet = {
  text: string;
  id: string;
  attachments: {
    media_keys: string[];
  }
}

export type Media = {
  media_key: string;
  type: 'video';
  variants: {
    content_type: 'video/mp4' | 'application/x-mpegURL';
    bit_rate: number;
    url: string;
  }[]
}