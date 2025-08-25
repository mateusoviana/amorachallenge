import { calculateApartmentScore, sortApartmentsByScore } from './reactionScoring';
import { ApartmentReaction, ReactionType } from '../types';

// Função de teste para verificar o sistema de pontuação
export const testReactionScoring = () => {
  console.log('🧪 Testando sistema de pontuação por reações...');

  // Mock de reações para teste
  const createMockReaction = (apartmentId: string, reaction: ReactionType): ApartmentReaction => ({
    id: Math.random().toString(),
    apartmentId,
    groupId: 'test-group',
    userId: Math.random().toString(),
    reaction,
    user: {
      id: Math.random().toString(),
      name: 'Test User',
      email: 'test@test.com',
      password: '',
      userType: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Teste 1: Apartamento com 1 "amei" + 1 "não gostei" = 1 ponto, 1 rejeição
  const apt1Reactions = [
    createMockReaction('apt1', 'love'),
    createMockReaction('apt1', 'dislike'),
  ];

  // Teste 2: Apartamento com 1 "gostei" + 1 "não sei" = 1 ponto, 0 rejeições
  const apt2Reactions = [
    createMockReaction('apt2', 'like'),
    createMockReaction('apt2', 'unsure'),
  ];

  // Teste 3: Apartamento com 2 "amei" = 4 pontos, 0 rejeições
  const apt3Reactions = [
    createMockReaction('apt3', 'love'),
    createMockReaction('apt3', 'love'),
  ];

  // Calcular pontuações
  const score1 = calculateApartmentScore(apt1Reactions);
  const score2 = calculateApartmentScore(apt2Reactions);
  const score3 = calculateApartmentScore(apt3Reactions);

  console.log('📊 Pontuações calculadas:');
  console.log('Apt1 (1 amei + 1 não gostei):', score1);
  console.log('Apt2 (1 gostei + 1 não sei):', score2);
  console.log('Apt3 (2 amei):', score3);

  // Testar ordenação
  const scores = [score1, score2, score3];
  const sortedScores = sortApartmentsByScore(scores);

  console.log('🏆 Ordenação final (decrescente por pontuação, critério de desempate por menos rejeições):');
  sortedScores.forEach((score, index) => {
    console.log(`${index + 1}º lugar: Apartamento ${score.apartmentId} - ${score.totalScore} pontos, ${score.negativeCount} rejeições`);
  });

  // Verificar se a ordenação está correta
  const expectedOrder = ['apt3', 'apt2', 'apt1']; // apt3 (4 pts), apt2 (1 pt, 0 rej), apt1 (1 pt, 1 rej)
  const actualOrder = sortedScores.map(s => s.apartmentId);
  
  if (JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)) {
    console.log('✅ Teste passou! Ordenação está correta.');
  } else {
    console.log('❌ Teste falhou! Ordenação esperada:', expectedOrder, 'Atual:', actualOrder);
  }

  return {
    scores: { score1, score2, score3 },
    sortedScores,
    testPassed: JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)
  };
};