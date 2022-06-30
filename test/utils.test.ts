import { test, expect } from 'vitest'
import { toWhiteboardTheWebTweets, WTW } from '../src/utils'
import { generateTweets } from './test-utils'

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