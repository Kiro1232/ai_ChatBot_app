import { answerQuestion } from './matcher.js'

describe('restaurant FAQ model', () => {
  test.each([
    ['restaurant address', 'What is the restaurant address?', 'location'],
    ['city', 'Which city are you in?', 'location'],
    ['owner', 'Who owns the restaurant?', 'team'],
    ['chef', 'What is the chef name?', 'team'],
    ['popular dishes', 'What are your popular dishes?', 'popular'],
    ['house dish', 'What is the house dish?', 'popular'],
    ['today menu', "What is today's menu?", 'menu'],
    ['offer days', 'What days have offers?', 'offers'],
    ['quiet days', 'Which days are less crowded?', 'quiet'],
    ['available tables', 'Do you have available table slots?', 'availability'],
    ['booking details', 'Can I get booking details?', 'reservation'],
    ['contact number', 'What is the contact number?', 'contact'],
  ])('matches %s questions', (_label, question, expectedIntent) => {
    expect(answerQuestion(question)).toEqual(expect.objectContaining({ intent: expectedIntent, answer: expect.any(String) }))
  })

  test('returns a helpful fallback for unknown questions', () => {
    expect(answerQuestion('Do you sell concert tickets?')).toEqual(expect.objectContaining({ intent: 'fallback', confidence: 0.18 }))
  })

  test.each([null, '', '   '])('rejects invalid question: %p', (question) => {
    expect(() => answerQuestion(question)).toThrow('A non-empty question is required.')
  })
})