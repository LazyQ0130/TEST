
import { AssessmentType, Question, AssessmentResult, MBTIResultData, HollandResultData, SCL90ResultData, IqEqResultData, SpiritualResultData } from '../types';

export const calculateResult = (
  type: AssessmentType,
  questions: Question[],
  answers: Record<number, string | number>
): AssessmentResult => {
  switch (type) {
    case 'MBTI':
      return calculateMBTI(questions, answers);
    case 'HOLLAND':
      return calculateHolland(questions, answers);
    case 'SCL90':
      return calculateSCL90(questions, answers);
    case 'IQ':
      return calculateIQ(questions, answers);
    case 'EQ':
      return calculateEQ(questions, answers);
    case 'SPIRITUAL':
      return calculateSpiritual(questions, answers);
    default:
      throw new Error(`Unknown assessment type: ${type}`);
  }
};

const calculateMBTI = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const questionMap = new Map(questions.map(q => [q.id, q]));

  Object.entries(answers).forEach(([qId, val]) => {
    const question = questionMap.get(parseInt(qId));
    if (!question) return;

    if (val === 'NEUTRAL' && question.category) {
      const [dim1, dim2] = question.category.split('');
      scores[dim1] += 0.5;
      scores[dim2] += 0.5;
    } else if (typeof val === 'string') {
      scores[val] = (scores[val] || 0) + 1;
    }
  });

  const percentages = {
    EI: Math.round((scores.E / ((scores.E + scores.I) || 1)) * 100),
    SN: Math.round((scores.S / ((scores.S + scores.N) || 1)) * 100),
    TF: Math.round((scores.T / ((scores.T + scores.F) || 1)) * 100),
    JP: Math.round((scores.J / ((scores.J + scores.P) || 1)) * 100),
  };

  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('');

  return { type: 'MBTI', data: { type, scores, percentages } };
};

const calculateHolland = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const questionMap = new Map(questions.map(q => [q.id, q]));

  Object.entries(answers).forEach(([qId, val]) => {
    const question = questionMap.get(parseInt(qId));
    if (question && question.category && val === 1) {
      scores[question.category] = (scores[question.category] || 0) + 1;
    }
  });

  // Sort categories by score descending
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const code = sorted.slice(0, 3).map(([cat]) => cat).join('');

  return { type: 'HOLLAND', data: { code, scores } };
};

const calculateSCL90 = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  let totalScore = 0;
  let count = 0;
  const factorScores: Record<string, {sum: number, count: number}> = {};

  const questionMap = new Map(questions.map(q => [q.id, q]));

  Object.entries(answers).forEach(([qId, val]) => {
    const score = val as number;
    const question = questionMap.get(parseInt(qId));
    
    totalScore += score;
    count++;

    if (question && question.category) {
      if (!factorScores[question.category]) factorScores[question.category] = {sum: 0, count: 0};
      factorScores[question.category].sum += score;
      factorScores[question.category].count++;
    }
  });

  const finalFactorScores: Record<string, number> = {};
  Object.keys(factorScores).forEach(key => {
    finalFactorScores[key] = Number((factorScores[key].sum / factorScores[key].count).toFixed(2));
  });

  const averageScore = Number((totalScore / (count || 1)).toFixed(2));
  let severity: SCL90ResultData['severity'] = 'Normal';
  if (averageScore >= 3) severity = 'Severe';
  else if (averageScore >= 2.5) severity = 'Moderate';
  else if (averageScore >= 2) severity = 'Mild';

  return { type: 'SCL90', data: { totalScore, averageScore, factorScores: finalFactorScores, severity } };
};

const calculateIQ = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  let rawScore = 0;
  
  const questionMap = new Map(questions.map(q => [q.id, q]));

  Object.entries(answers).forEach(([qId, val]) => {
    const question = questionMap.get(parseInt(qId));
    if (question) {
      rawScore += (val as number);
    }
  });

  const total = questions.length;
  const percentage = rawScore / total;
  let level = "Average";
  if (percentage >= 0.8) level = "High Distinction";
  else if (percentage >= 0.6) level = "Above Average";
  else if (percentage < 0.4) level = "Below Average";

  return { type: 'IQ', data: { score: rawScore, total, level, percentile: Math.round(percentage * 100) } };
};

const calculateEQ = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  let rawScore = 0;
  let maxPossible = 0;

  questions.forEach(q => {
     const maxOpt = Math.max(...q.options.map(o => (o.value as number)));
     maxPossible += maxOpt;
  });

  Object.entries(answers).forEach(([qId, val]) => {
     rawScore += (val as number);
  });

  const percentage = rawScore / (maxPossible || 1);
  let level = "Average";
  if (percentage >= 0.8) level = "High EQ";
  else if (percentage >= 0.6) level = "Above Average";
  else if (percentage < 0.4) level = "Developing";

  return { type: 'EQ', data: { score: rawScore, total: maxPossible, level, percentile: Math.round(percentage * 100) } };
};

const calculateSpiritual = (questions: Question[], answers: Record<number, string | number>): AssessmentResult => {
  const scores: Record<string, number> = { Meaning: 0, Connection: 0, Peace: 0 };
  let total = 0;

  const questionMap = new Map(questions.map(q => [q.id, q]));
  
  Object.entries(answers).forEach(([qId, val]) => {
    const question = questionMap.get(parseInt(qId));
    const score = val as number;
    total += score;
    if (question && question.category) {
      scores[question.category] = (scores[question.category] || 0) + score;
    }
  });

  // Find dominant
  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  return { type: 'SPIRITUAL', data: { scores, total, dominant } };
};
