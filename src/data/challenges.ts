export type LanguageId =
  | 'python'
  | 'javascript'
  | 'java'
  | 'sql'
  | 'cpp'
  | 'html'
  | 'css'
  | 'logic';

export interface LanguageInfo {
  id: LanguageId;
  name: string;
  short: string;
  color: string;
  accent: string;
  icon: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { id: 'python',     name: 'Python',      short: 'PY', color: '#3776AB', accent: '#FFD43B', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript',  short: 'JS', color: '#F0DB4F', accent: '#323330', icon: '⚡' },
  { id: 'java',       name: 'Java',        short: 'JV', color: '#ED8B00', accent: '#FFFFFF', icon: '☕' },
  { id: 'sql',        name: 'SQL',         short: 'SQL',color: '#E48E00', accent: '#1B6CB0', icon: '🗄️' },
  { id: 'cpp',        name: 'C++',         short: 'C++',color: '#00599C', accent: '#65FFAD', icon: '⚙️' },
  { id: 'html',       name: 'HTML',        short: 'HTM',color: '#E34F26', accent: '#FFFFFF', icon: '📄' },
  { id: 'css',        name: 'CSS',         short: 'CSS',color: '#1572B6', accent: '#FFFFFF', icon: '🎨' },
  { id: 'logic',      name: 'Lógica',      short: 'LOG',color: '#7B2FF7', accent: '#F2C94C', icon: '🧩' },
];

export function getLanguage(id: LanguageId): LanguageInfo {
  return LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
}

export type ChallengeKind = 'quiz' | 'code';

export interface QuizChallenge {
  kind: 'quiz';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeChallenge {
  kind: 'code';
  prompt: string;
  template: string;
  blanks: { index: number; answer: string; alternatives?: string[] }[];
  explanation: string;
}

export type Challenge = QuizChallenge | CodeChallenge;

export const CHALLENGES: Record<LanguageId, Challenge[]> = {
  python: [
    {
      kind: 'quiz',
      question: 'Qual palavra-chave define uma função em Python?',
      options: ['function', 'def', 'func', 'define'],
      correctIndex: 1,
      explanation: 'Em Python usa-se `def` para definir funções, seguido do nome e parênteses.',
    },
    {
      kind: 'code',
      prompt: 'Complete a função que retorna o dobro de um número.',
      template: 'def dobro(n):\n    return n ___ 2',
      blanks: [{ index: 0, answer: '*', alternatives: ['*'] }],
      explanation: 'O operador `*` multiplica, então `n * 2` devolve o dobro.',
    },
    {
      kind: 'quiz',
      question: 'Como se cria uma lista vazia em Python?',
      options: ['list()', '[]', 'Ambas as opções', '{}'],
      correctIndex: 2,
      explanation: 'Tanto `list()` quanto `[]` criam listas vazias. `{}` cria um dicionário.',
    },
  ],
  javascript: [
    {
      kind: 'quiz',
      question: 'Qual palavra declara uma variável que não pode ser reatribuída?',
      options: ['var', 'let', 'const', 'final'],
      correctIndex: 2,
      explanation: '`const` declara uma constante — o valor não pode ser reatribuído.',
    },
    {
      kind: 'code',
      prompt: 'Complete a arrow function que soma dois valores.',
      template: 'const soma = (a, b) ___ a + b',
      blanks: [{ index: 0, answer: '=>', alternatives: ['=>', '->'] }],
      explanation: 'A seta `=>` é obrigatória na sintaxe de arrow functions.',
    },
    {
      kind: 'quiz',
      question: 'O que `typeof null` retorna em JavaScript?',
      options: ['"null"', '"object"', '"undefined"', '"number"'],
      correctIndex: 1,
      explanation: 'É um bug histórico: `typeof null` retorna "object", não "null".',
    },
  ],
  java: [
    {
      kind: 'quiz',
      question: 'Qual é o ponto de entrada de um programa Java?',
      options: ['public void start()', 'public static void main(String[] args)', 'void run()', 'main()'],
      correctIndex: 1,
      explanation: 'A JVM procura por `public static void main(String[] args)` ao iniciar.',
    },
    {
      kind: 'code',
      prompt: 'Imprima "Olá" no console.',
      template: 'System.___.println("Olá")',
      blanks: [{ index: 0, answer: 'out', alternatives: ['out'] }],
      explanation: '`System.out.println` imprime texto no console padrão.',
    },
    {
      kind: 'quiz',
      question: 'Qual tipo representa texto em Java?',
      options: ['String', 'string', 'text', 'char[]'],
      correctIndex: 0,
      explanation: 'Em Java o tipo de texto é `String` (com S maiúsculo, pois é uma classe).',
    },
  ],
  sql: [
    {
      kind: 'quiz',
      question: 'Qual comando recupera dados de uma tabela?',
      options: ['FETCH', 'GET', 'SELECT', 'RETRIEVE'],
      correctIndex: 2,
      explanation: '`SELECT` é o comando SQL para consultar dados.',
    },
    {
      kind: 'code',
      prompt: 'Filtre usuários com idade maior que 18.',
      template: 'SELECT * FROM usuarios ___ idade > 18',
      blanks: [{ index: 0, answer: 'WHERE', alternatives: ['WHERE', 'where'] }],
      explanation: 'A cláusula `WHERE` filtra linhas conforme uma condição.',
    },
    {
      kind: 'quiz',
      question: 'Como contar o número de linhas de uma tabela?',
      options: ['COUNT(*)', 'SUM(*)', 'LENGTH(*)', 'ROWS(*)'],
      correctIndex: 0,
      explanation: '`COUNT(*)` conta todas as linhas retornadas pela consulta.',
    },
  ],
  cpp: [
    {
      kind: 'quiz',
      question: 'Qual biblioteca fornece `cout` para saída em C++?',
      options: ['<stdio>', '<iostream>', '<output>', '<print>'],
      correctIndex: 1,
      explanation: '`#include <iostream>` fornece `std::cout` para saída padrão.',
    },
    {
      kind: 'code',
      prompt: 'Inclua a biblioteca de entrada/saída.',
      template: '#___ <iostream>',
      blanks: [{ index: 0, answer: 'include', alternatives: ['include'] }],
      explanation: 'A diretiva `#include` importa cabeçalhos em C++.',
    },
    {
      kind: 'quiz',
      question: 'Qual é o operador de resolução de escopo em C++?',
      options: ['.', '::', '->', ':'],
      correctIndex: 1,
      explanation: '`::` é o operador de resolução de escopo (ex.: `std::cout`).',
    },
  ],
  html: [
    {
      kind: 'quiz',
      question: 'Qual tag cria um link em HTML?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctIndex: 1,
      explanation: 'A tag `<a>` (anchor) cria hyperlinks com o atributo `href`.',
    },
    {
      kind: 'code',
      prompt: 'Crie um parágrafo com o texto "Olá".',
      template: '<___>Olá</___>',
      blanks: [{ index: 0, answer: 'p', alternatives: ['p'] }],
      explanation: 'A tag `<p>` define um parágrafo.',
    },
    {
      kind: 'quiz',
      question: 'Onde deve ficar o conteúdo visível da página?',
      options: ['<head>', '<body>', '<footer>', '<main>'],
      correctIndex: 1,
      explanation: 'O `<body>` contém todo o conteúdo visível da página HTML.',
    },
  ],
  css: [
    {
      kind: 'quiz',
      question: 'Como tornar texto vermelho em CSS?',
      options: ['text-color: red', 'color: red', 'font-color: red', 'red-text: true'],
      correctIndex: 1,
      explanation: 'A propriedade `color` define a cor do texto em CSS.',
    },
    {
      kind: 'code',
      prompt: 'Centralize o texto horizontalmente.',
      template: 'text-align: ___',
      blanks: [{ index: 0, answer: 'center', alternatives: ['center'] }],
      explanation: '`text-align: center` centraliza o texto dentro do elemento.',
    },
    {
      kind: 'quiz',
      question: 'Qual seletor aplica estilo a um id "menu"?',
      options: ['.menu', '#menu', 'menu', '*menu'],
      correctIndex: 1,
      explanation: 'O seletor `#` referencia um id, enquanto `.` referencia uma classe.',
    },
  ],
  logic: [
    {
      kind: 'quiz',
      question: 'O que o operador lógico AND (&&) retorna quando ambos os lados são verdadeiros?',
      options: ['Falso', 'Verdadeiro', 'Null', 'Erro'],
      correctIndex: 1,
      explanation: 'AND só é verdadeiro quando ambos os operandos são verdadeiros.',
    },
    {
      kind: 'code',
      prompt: 'Complete o laço que repete 5 vezes.',
      template: 'para i de 1 ___ 5 faça',
      blanks: [{ index: 0, answer: 'ate', alternatives: ['ate', 'até'] }],
      explanation: 'Em pseudocódigo, `de 1 ate 5` define o intervalo do laço.',
    },
    {
      kind: 'quiz',
      question: 'Qual estrutura executa um bloco apenas se uma condição for verdadeira?',
      options: ['FOR', 'WHILE', 'IF', 'ELSE'],
      correctIndex: 2,
      explanation: 'O `IF` executa o bloco associado apenas quando a condição é verdadeira.',
    },
  ],
};

export function getChallenges(lang: LanguageId): Challenge[] {
  return CHALLENGES[lang] ?? [];
}

export function getChallenge(lang: LanguageId, index: number): Challenge | null {
  const list = CHALLENGES[lang];
  if (!list || list.length === 0) return null;
  return list[index % list.length];
}

export function challengeCount(lang: LanguageId): number {
  return CHALLENGES[lang]?.length ?? 0;
}
