import { test, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { toWhiteboardTheWebTweets, WTW } from '../src/utils'
import { generateTweets } from './test-utils'

test('toWhiteboardTheWebTweets', () => {
  const tweetsWithHashtag = generateTweets(
    10,
    (tweet) => {
      tweet.text = `#whiteboardtheweb EDITION ${faker.datatype.number()}\n` + tweet.text
      return tweet
    }
  )
  const tweetsWithoutHashtag = generateTweets()
  expect(toWhiteboardTheWebTweets([
    ...tweetsWithHashtag,
    ...tweetsWithoutHashtag,
  ])).toEqual(tweetsWithHashtag)
})