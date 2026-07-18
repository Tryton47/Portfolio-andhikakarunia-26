import { CATEGORIES } from './categories';

export const LOGOS_DATA = {
  [CATEGORIES.DATA]: [
    { id: 'python',  name: 'Python',    model: '/models/python.glb',  tools: ['Pandas', 'NumPy'] },
    { id: 'tableau', name: 'Tableau',   model: '/models/tableau.glb', tools: ['Dashboards'] },
    { id: 'powerbi', name: 'Power BI',  model: '/models/powerbi.glb', tools: ['Reports'] },
    { id: 'sql',     name: 'SQL',       model: '/models/sql.glb',     tools: ['Query', 'Database'] },
  ],
  [CATEGORIES.FULLSTACK]: [
    { id: 'vscode',    name: 'VS Code',     model: '/models/vscode.glb',    tools: ['Editor'] },
    { id: 'react',     name: 'React',       model: '/models/react.glb',     tools: ['Frontend'] },
    { id: 'node',      name: 'Node.js',     model: '/models/node.glb',      tools: ['Backend'] },
    { id: 'postgres',  name: 'PostgreSQL',  model: '/models/postgres.glb',  tools: ['Database'] },
  ],
  [CATEGORIES.DESIGN]: [
    { id: 'figma',        name: 'Figma',        model: '/models/figma.glb',        tools: ['UI/UX'] },
    { id: 'photoshop',    name: 'Photoshop',    model: '/models/photoshop.glb',    tools: ['Editing'] },
    { id: 'illustrator',  name: 'Illustrator',  model: '/models/illustrator.glb',  tools: ['Vector'] },
  ],
  [CATEGORIES.VIDEO]: [
    { id: 'davinci',      name: 'DaVinci Resolve',  model: '/models/davinci.glb',  tools: ['Color Grading'] },
    { id: 'premiere',     name: 'Premiere Pro',     model: '/models/premiere.glb', tools: ['Editing'] },
    { id: 'aftereffects', name: 'After Effects',    model: '/models/ae.glb',       tools: ['Motion Graphics'] },
  ],
};
