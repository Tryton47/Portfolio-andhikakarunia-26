export const ALL_TOOLS = [
  // DATA ANALYST
  { id: 'python',     name: 'Python',        category: 'Data',   desc: 'Data processing, ML, automation',         color: '#3776AB', slug: 'python' },
  { id: 'sql',        name: 'SQL',            category: 'Data',   desc: 'Database queries & optimization',          color: '#E48E00', slug: 'sqlite' },
  { id: 'pandas',     name: 'Pandas',         category: 'Data',   desc: 'Data manipulation & analysis',             color: '#150458', slug: 'pandas' },
  { id: 'sklearn',    name: 'Scikit-learn',   category: 'Data',   desc: 'Machine learning algorithms',              color: '#F7931E', slug: 'scikitlearn' },
  { id: 'powerbi',   name: 'Power BI',       category: 'Data',   desc: 'Business intelligence & dashboards',       color: '#F2C811', slug: 'powerbi' },
  { id: 'looker',    name: 'Looker Studio',  category: 'Data',   desc: 'Data visualization & analytics',           color: '#4285F4', slug: 'looker' },
  { id: 'mysql',     name: 'MySQL',          category: 'Data',   desc: 'Relational database management',           color: '#4479A1', slug: 'mysql' },
  { id: 'postgres',  name: 'PostgreSQL',     category: 'Data',   desc: 'Advanced open-source database',            color: '#4169E1', slug: 'postgresql' },
  { id: 'fastapi',   name: 'FastAPI',        category: 'Data',   desc: 'Modern async Python API framework',        color: '#009688', slug: 'fastapi' },

  // FULL STACK DEV
  { id: 'javascript', name: 'JavaScript',    category: 'Dev',    desc: 'Dynamic frontend & backend scripting',     color: '#F7DF1E', slug: 'javascript' },
  { id: 'typescript', name: 'TypeScript',    category: 'Dev',    desc: 'Type-safe JavaScript at scale',            color: '#3178C6', slug: 'typescript' },
  { id: 'react',     name: 'React',          category: 'Dev',    desc: 'UI component library',                     color: '#61DAFB', slug: 'react' },
  { id: 'nextjs',    name: 'Next.js',        category: 'Dev',    desc: 'Full-stack React framework',               color: '#000000', slug: 'nextdotjs' },
  { id: 'nodejs',    name: 'Node.js',        category: 'Dev',    desc: 'JavaScript runtime for servers',           color: '#339933', slug: 'nodedotjs' },
  { id: 'php',       name: 'PHP',            category: 'Dev',    desc: 'Server-side web scripting',                color: '#777BB4', slug: 'php' },
  { id: 'laravel',   name: 'Laravel',        category: 'Dev',    desc: 'Elegant PHP web framework',                color: '#FF2D20', slug: 'laravel' },
  { id: 'tailwind',  name: 'Tailwind CSS',   category: 'Dev',    desc: 'Utility-first CSS framework',              color: '#06B6D4', slug: 'tailwindcss' },
  { id: 'prisma',    name: 'Prisma',         category: 'Dev',    desc: 'Next-gen Node.js & TypeScript ORM',        color: '#2D3748', slug: 'prisma' },
  { id: 'git',       name: 'Git',            category: 'Dev',    desc: 'Distributed version control system',       color: '#F05032', slug: 'git' },
  { id: 'vscode',    name: 'VS Code',        category: 'Dev',    desc: 'Powerful, extensible code editor',         color: '#007ACC', slug: 'visualstudiocode' },

  // DESIGN
  { id: 'figma',     name: 'Figma',          category: 'Design', desc: 'Collaborative UI/UX design tool',          color: '#F24E1E', slug: 'figma' },
  { id: 'canva',     name: 'Canva',          category: 'Design', desc: 'Graphic design for everyone',              color: '#00C4CC', slug: 'canva' },

  // VIDEO EDITING
  { id: 'davinci',   name: 'DaVinci Resolve',category: 'Video',  desc: 'Professional color grading & editing',    color: '#CE2029', slug: 'davinciresolve' },
  { id: 'premiere',  name: 'Premiere Pro',   category: 'Video',  desc: 'Industry-standard video editing',         color: '#9999FF', slug: 'adobepremierepro' },
  { id: 'capcut',    name: 'CapCut',         category: 'Video',  desc: 'Fast & easy video creation',              color: '#000000', slug: 'tiktok' }, // Fallback icon since capcut isn't in simpleicons
];
