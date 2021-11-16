import { getJSONFromBufferWithError } from '../utils/config'

describe('Config Tests', () => {
  describe('getJSONFromBufferWithError', () => {
    const buffer = { toString: jest.fn() }
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns JSON as object', () => {
      const obj = { foo: 'bar' }
      const randoJSONData = JSON.stringify(obj)
      buffer.toString.mockReturnValue(randoJSONData)
      expect(getJSONFromBufferWithError('foo', buffer)).toEqual(obj)
    })

    it('throws if not valid JSON from buffer', () => {
      buffer.toString.mockReturnValue('hello world')

      expect(() => getJSONFromBufferWithError('foo', buffer)).toThrow()
    })
  })
})
