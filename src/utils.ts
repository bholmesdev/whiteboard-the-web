import { Tweet } from "./_types";

export const WTW = 'whiteboardtheweb';

export function toWhiteboardTheWebTweets(tweets: Tweet[]) {
  return tweets.filter(tweet => {
    const isMatchingTitle = /#whiteboardtheweb edition \d+/.test(tweet.text.toLowerCase());
    return isMatchingTitle;
  })
}

const SANCTIONED_COLORS = ['#e30570', '#6100FF', '#de230a', '#12880a']

export function toRandomNotUglyColor() {
  const randomIdx = Math.floor(Math.random() * SANCTIONED_COLORS.length)
  return SANCTIONED_COLORS[randomIdx];
}