import { getCorsPolicy } from '../utils/cors'
import { getCors } from '../utils/config'

jest.mock('../utils/config')

describe('Cors Utilities', () => {
  describe('getCorsPolicy', () => {
    it('fetches [] when WEB_URL env var is not available or null', () => {
      const corsUrls = getCorsPolicy(undefined)
      expect(corsUrls).toEqual([])

      const corsUrls2 = getCorsPolicy(null)
      expect(corsUrls2).toEqual([])
    })

    it('fetches the cors WEB_URL env var when available', () => {
      const webUrl = 'https://AlexisAwesome.com'
      const corsUrls = getCorsPolicy(webUrl)
      expect(corsUrls).toEqual(['https://AlexisAwesome.com'])

      const webUrl2 = 'https://BillyisAwesome.com'
      const corsUrls2 = getCorsPolicy(webUrl2)
      expect(corsUrls2).toEqual(['https://BillyisAwesome.com'])
    })

    it('fetches urls from cors.json', () => {
      const corsConfig = [
        'https://PatrickIsAwesome.com',
        'https://JustAskIsAwesome.com',
      ]
      getCors.mockReturnValueOnce(corsConfig)

      const corsUrls = getCorsPolicy()

      expect(corsUrls).toEqual(corsConfig)
    })
    it('combines results if cors.json returns and there is a webUrl', () => {
      const corsConfig = [
        'https://PatrickIsAwesome.com',
        'https://JustAskIsAwesome.com',
      ]
      const webUrl = 'https://foo.com'
      getCors.mockReturnValueOnce(corsConfig)

      const corsUrls = getCorsPolicy(webUrl)

      expect(corsUrls).toEqual([webUrl, ...corsConfig])
    })

    it('returns [] when fetching cors.json throws (when it does not exist) and webUrl is not defined', () => {
      getCors.mockImplementation(() => {
        throw new Error('JSON FILE NOT FOUND')
      })
      const corsUrls = getCorsPolicy()
      expect(corsUrls).toEqual([])
    })

    it('returns [https://foo.com] when fetching cors.json throws (when it does not exist) and webUrl is https://foo.com', () => {
      getCors.mockImplementation(() => {
        throw new Error('JSON FILE NOT FOUND')
      })
      const corsUrls = getCorsPolicy('https://foo.com')
      expect(corsUrls).toEqual(['https://foo.com'])
    })
  })
})
