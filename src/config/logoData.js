import { CATEGORIES } from './categories';

export const LOGOS_DATA = {
  [CATEGORIES.DATA]: [
    { id: 'python', name: 'Python', model: '', tools: ['Data Processing', 'Analysis'] },
    { id: 'sql', name: 'SQL', model: '', tools: ['Query', 'Database'] },
    { id: 'pandas', name: 'Pandas', model: '', tools: ['Data Manipulation'] },
    { id: 'sklearn', name: 'Scikit-learn', model: '', tools: ['ML'] },
    { id: 'powerbi', name: 'Power BI', model: '', tools: ['Visualization'] },
    { id: 'looker', name: 'Looker Studio', model: '', tools: ['Dashboard'] },
    { id: 'mysql', name: 'MySQL', model: '', tools: ['Database'] },
    { id: 'postgres', name: 'PostgreSQL', model: '', tools: ['Database'] },
    { id: 'fastapi', name: 'FastAPI', model: '', tools: ['API'] },
  ],
  [CATEGORIES.FULLSTACK]: [
    { id: 'javascript', name: 'JavaScript', model: '', tools: ['Frontend Logic'] },
    { id: 'typescript', name: 'TypeScript', model: '', tools: ['Type Safety'] },
    { id: 'react', name: 'React', model: '', tools: ['UI Library'] },
    { id: 'nextjs', name: 'Next.js', model: '', tools: ['Full Stack'] },
    { id: 'nodejs', name: 'Node.js', model: '', tools: ['Backend Runtime'] },
    { id: 'php', name: 'PHP', model: '', tools: ['Server'] },
    { id: 'laravel', name: 'Laravel', model: '', tools: ['Framework'] },
    { id: 'tailwindcss', name: 'Tailwind CSS', model: '', tools: ['Styling'] },
    { id: 'prisma', name: 'Prisma', model: '', tools: ['ORM'] },
  ],
  [CATEGORIES.DESIGN]: [
    { id: 'figma', name: 'Figma', model: '', tools: ['UI/UX Design'] },
    { id: 'canva', name: 'Canva', model: '', tools: ['Graphics'] },
  ],
  [CATEGORIES.VIDEO]: [
    { id: 'davinci', name: 'DaVinci Resolve', model: '', tools: ['Color Grading'] },
    { id: 'premiere', name: 'Premiere Pro', model: '', tools: ['Video Editing'] },
    { id: 'capcut', name: 'CapCut', model: '', tools: ['Quick Edit'] },
  ],
};
