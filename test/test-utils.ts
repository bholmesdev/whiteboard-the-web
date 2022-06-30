import { generateMock } from '@anatine/zod-mock'
import { tweetSchema } from '../src/_types.generated'
import { Tweet } from '../src/_types'

export function generateTweets(
  numTweets: number = 10,
  transformTweet: (tweet: Tweet) => Tweet = (t) => t,
) {
  return [...new Array(numTweets)].map(
    () => transformTweet(generateMock(tweetSchema))
  )
}
