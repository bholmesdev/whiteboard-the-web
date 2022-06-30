import { test, expect } from 'vitest'
import { generateMock } from '@anatine/zod-mock'
import { toWhiteboardTheWebTweets, WTW } from './utils'
import { tweetSchema } from './_types.generated'
import { Tweet } from './_types'

function generateTweets(
  numTweets: number = 10,
  transformTweet: (tweet: Tweet) => Tweet = (t) => t,
) {
  return [...new Array(numTweets)].map(
    () => transformTweet(generateMock(tweetSchema))
  )
}

test('toWhiteboardTheWebTweets', () => {
  const tweetsWithHashtag = generateTweets(
    10,
    (tweet) => {
      tweet.entities!.hashtags!.push({ start: 0, end: 10, tag: WTW })
      return tweet
    }
  )
  const tweetsWithoutHashtag = generateTweets()
  expect(toWhiteboardTheWebTweets([
    ...tweetsWithHashtag,
    ...tweetsWithoutHashtag,
  ])).toEqual(tweetsWithHashtag)
})