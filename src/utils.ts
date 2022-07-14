import { Tweet } from "./_types";

export const WTW = 'whiteboardtheweb';

export function toWhiteboardTheWebTweets(tweets: Tweet[]) {
  return tweets.filter(tweet => {
    const hasHashtag = tweet.entities?.hashtags?.some(({ tag }) => tag.toLowerCase() === WTW);
    // shhhh this is full-proof
    const isGoingLiveNotif = tweet.text.toLowerCase().startsWith('going live');
    return hasHashtag && !isGoingLiveNotif;
  })
}

const SANCTIONED_COLORS = ['#FF007A', '#6100FF', '#0085FF', '#FF1F00', '#10BB4A']

export function toRandomNotUglyColor() {
  const randomIdx = Math.floor(Math.random() * SANCTIONED_COLORS.length)
  return SANCTIONED_COLORS[randomIdx];
}