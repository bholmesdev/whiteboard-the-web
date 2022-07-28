import { Tweet } from "./_types";

export const WTW = 'whiteboardtheweb';

export function toWhiteboardTheWebTweets(tweets: Tweet[]) {
  return tweets.filter(tweet => {
    const isMatchingTitle = /^#whiteboardtheweb EDITION \d+/.test(tweet.text);
    return isMatchingTitle;
  })
}

const SANCTIONED_COLORS = ['#FF007A', '#6100FF', '#0085FF', '#FF1F00', '#10BB4A']

export function toRandomNotUglyColor() {
  const randomIdx = Math.floor(Math.random() * SANCTIONED_COLORS.length)
  return SANCTIONED_COLORS[randomIdx];
}