import { Tweet } from "./_types";

const WTW = 'whiteboardtheweb';

export function toWhiteboardTheWebTweets(tweets: Tweet[]) {
  return tweets.filter(tweet => {
    const hasHashtag = tweet.entities?.hashtags?.some(({ tag }) => tag.toLowerCase() === WTW);
    // shhhh this is full-proof
    const isGoingLiveNotif = tweet.text.toLowerCase().startsWith('going live');
    return hasHashtag && !isGoingLiveNotif;
  })
}