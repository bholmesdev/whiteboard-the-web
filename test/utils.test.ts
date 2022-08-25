import { test, expect, describe, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { toWhiteboardTheWebTweets, WTW } from '../src/utils'
import { generateTweets } from './test-utils'

describe('toWhiteboardTheWebTweets', () => {
  it('supports #whiteboardtheweb at start of tweet', () => {
    const tweetsWithHashtag = generateTweets(
      10,
      (tweet) => {
        tweet.text = `#whiteboardtheweb edition ${faker.datatype.number()}\n` + tweet.text
        return tweet
      }
    )
    const tweetsWithoutHashtag = generateTweets()
    expect(toWhiteboardTheWebTweets([
      ...tweetsWithHashtag,
      ...tweetsWithoutHashtag,
    ])).toEqual(tweetsWithHashtag)
  })
  it('supports #whiteboardtheweb at end of tweet', () => {
    const tweetsWithHashtag = generateTweets(
      10,
      (tweet) => {
        tweet.text = tweet.text + `\n#whiteboardtheweb edition ${faker.datatype.number()}`
        return tweet
      }
    )
    const tweetsWithoutHashtag = generateTweets()
    expect(toWhiteboardTheWebTweets([
      ...tweetsWithHashtag,
      ...tweetsWithoutHashtag,
    ])).toEqual(tweetsWithHashtag)
  })
  it('supports #whiteboardtheweb with upper and lowercase mix', () => {
    const tweetsWithHashtag = generateTweets(
      10,
      (tweet) => {
        tweet.text = `#whiteboardtheweb edition ${faker.datatype.number()}\n` + tweet.text
        return tweet
      }
    ).concat(
      generateTweets(
        10,
        (tweet) => {
          tweet.text = tweet.text + `\n#whiteboardtheweb EDITION ${faker.datatype.number()}`
          return tweet
        }
      )
    )
    const tweetsWithoutHashtag = generateTweets()
    expect(toWhiteboardTheWebTweets([
      ...tweetsWithHashtag,
      ...tweetsWithoutHashtag,
    ])).toEqual(tweetsWithHashtag)
  })
})
