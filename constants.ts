
import { ICulture, IScenarioTemplate, IUserCulturalProfile } from './types';

export const CULTURAL_PROFILES: ICulture[] = [
  {
    id: 'GERMANY',
    name: 'Germany',
    continent: 'Europe',
    language: 'German',
    helloPhrase: 'Guten Tag',
    goodbyePhrase: 'Auf Wiedersehen',
    culturalDimensions: { power_distance: 35, individualism: 67, uncertainty_avoidance: 65 },
    communicationStyle: { directness: 85, contextSensitivity: 20, formalityLevel: 70, emotionalExpression: 30 },
    values: ['Order', 'Punctuality', 'Efficiency', 'Precision'],
    etiquetteRules: [
      { id: 'GE001', category: 'Greeting', rule: 'Shake hands firmly', description: 'A firm handshake with eye contact is expected.', consequences: 'Negative' },
      { id: 'GE002', category: 'Business', rule: 'Be punctual', description: 'Arriving late is considered highly disrespectful.', consequences: 'Critical' }
    ]
  },
  {
    id: 'JAPAN',
    name: 'Japan',
    continent: 'Asia',
    language: 'Japanese',
    helloPhrase: 'Konnichiwa',
    goodbyePhrase: 'Sayonara',
    culturalDimensions: { power_distance: 54, individualism: 46, uncertainty_avoidance: 92 },
    communicationStyle: { directness: 10, contextSensitivity: 90, formalityLevel: 95, emotionalExpression: 10 },
    values: ['Harmony (Wa)', 'Respect', 'Humility', 'Cleanliness'],
    etiquetteRules: [
      { id: 'JP001', category: 'Business', rule: 'Exchange business cards', description: 'Use both hands when giving and receiving business cards.', consequences: 'Critical' },
      { id: 'JP002', category: 'Dining', rule: 'Chopstick etiquette', description: 'Never stick chopsticks upright in rice.', consequences: 'Critical' }
    ]
  },
  {
    id: 'USA',
    name: 'United States',
    continent: 'North America',
    language: 'English',
    helloPhrase: 'Hello',
    goodbyePhrase: 'Goodbye',
    culturalDimensions: { power_distance: 40, individualism: 91, uncertainty_avoidance: 46 },
    communicationStyle: { directness: 70, contextSensitivity: 15, formalityLevel: 40, emotionalExpression: 60 },
    values: ['Individualism', 'Freedom', 'Equality', 'Innovation'],
    etiquetteRules: [
      { id: 'US001', category: 'Dining', rule: 'Tipping', description: 'Tipping 15-20% is expected in restaurants.', consequences: 'Critical' }
    ]
  },
  {
    id: 'INDIA',
    name: 'India',
    continent: 'Asia',
    language: 'Hindi',
    helloPhrase: 'Namaste',
    goodbyePhrase: 'Namaste',
    culturalDimensions: { power_distance: 77, individualism: 48, uncertainty_avoidance: 40 },
    communicationStyle: { directness: 30, contextSensitivity: 80, formalityLevel: 60, emotionalExpression: 70 },
    values: ['Family', 'Hierarchy', 'Spirituality', 'Hospitality'],
    etiquetteRules: [
      { id: 'IN001', category: 'Dining', rule: 'Right hand only', description: 'Eat only with your right hand.', consequences: 'Critical' }
    ]
  },
  {
    id: 'BRAZIL',
    name: 'Brazil',
    continent: 'South America',
    language: 'Portuguese',
    helloPhrase: 'Olá',
    goodbyePhrase: 'Tchau',
    culturalDimensions: { power_distance: 69, individualism: 38, uncertainty_avoidance: 76 },
    communicationStyle: { directness: 40, contextSensitivity: 70, formalityLevel: 50, emotionalExpression: 80 },
    values: ['Family', 'Passion', 'Friendship', 'Creativity'],
    etiquetteRules: [
      { id: 'BR001', category: 'Social', rule: 'Physical touch', description: 'Frequent physical touch is a sign of warmth.', consequences: 'Positive' }
    ]
  }
];

export const SCENARIO_TEMPLATES: IScenarioTemplate[] = [
  {
    id: 'S1',
    title: 'Initial Business Meeting',
    description: 'First meeting with potential partners to discuss software collaboration.',
    category: 'Business',
    difficulty: 'Beginner',
    objectives: ['Establish rapport', 'Respect formalities', 'State intentions clearly'],
    initialSituation: 'You arrive at the conference room. Your counterparts are already seated and looking at you. How do you enter and greet them?'
  },
  {
    id: 'S2',
    title: 'Social Dinner Invitation',
    description: 'You are invited to a colleague\'s home for a traditional meal.',
    category: 'Social',
    difficulty: 'Intermediate',
    objectives: ['Follow dining etiquette', 'Bring appropriate gift', 'Build personal bond'],
    initialSituation: 'You stand at the front door of your colleague\'s residence. You have a small gift in your hand. What happens next?'
  },
  {
    id: 'S3',
    title: 'High-Stakes Negotiation',
    description: 'Finalizing a major contract involving multiple complex terms.',
    category: 'Business',
    difficulty: 'Advanced',
    objectives: ['Maintain harmony', 'Negotiate firmly but respectfully', 'Understand decision-making hierarchy'],
    initialSituation: 'The CEO of the partner company asks for a significant concession that wasn\'t in the draft. How do you respond?'
  }
];

export const MOCK_USERS: IUserCulturalProfile[] = [
  {
    userId: 'u1',
    username: 'Alice Explorer',
    originCultureId: 'USA',
    culturalCompetenceScore: { 'GERMANY': 45, 'JAPAN': 30 },
    overallCompetence: 38
  },
  {
    userId: 'u2',
    username: 'Bob Voyager',
    originCultureId: 'GERMANY',
    culturalCompetenceScore: { 'BRAZIL': 60, 'INDIA': 55 },
    overallCompetence: 58
  }
];
