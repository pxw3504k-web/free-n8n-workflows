export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Workflow {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  image: string;
  categories: string[];
  views: number;
  downloads: number;
  date: string;
}

export const categories: Category[] = [
  { id: 'social-media', name: 'Social Media', count: 120 },
  { id: 'ecommerce', name: 'E-commerce', count: 85 },
  { id: 'project-management', name: 'Project Management', count: 64 },
  { id: 'finance', name: 'Finance', count: 42 },
  { id: 'hr', name: 'HR & Recruiting', count: 38 },
  { id: 'marketing', name: 'Marketing', count: 95 },
  { id: 'sales', name: 'Sales', count: 55 },
  { id: 'support', name: 'Customer Support', count: 48 },
  { id: 'devops', name: 'DevOps', count: 72 },
  { id: 'ai', name: 'AI & Machine Learning', count: 150 },
  { id: 'operations', name: 'Operations', count: 30 },
];

export const workflows: Workflow[] = [
  {
    id: '000204c6-8d84-4166-9100-c6ebf7f36f3d',
    slug: 'automate-colombian-invoice-processing',
    title: 'Automate Colombian Invoice Processing with AI and Email Integration',
    description: 'Streamline the extraction and processing of Colombian invoices received via email. This workflow automatically retrieves invoice ZIP attachments, extracts data from PDFs and XMLs, and leverages AI to structure the information for further use.',
    author: 'Free N8N Temples',
    image: 'https://placehold.co/600x400/9fa3f5/white?text=Invoice+AI',
    categories: ['Operations', 'AI'],
    views: 211,
    downloads: 14,
    date: '2025-12-18',
  },
  {
    id: '1',
    slug: 'auto-post-instagram-linkedin',
    title: 'Auto-post to Instagram & LinkedIn',
    description: 'Automatically post content to Instagram and LinkedIn from a Google Sheet schedule.',
    author: 'Sarah Connor',
    image: 'https://placehold.co/600x400/9fa3f5/white?text=Social+Auto',
    categories: ['Social Media', 'Marketing'],
    views: 1250,
    downloads: 340,
    date: '2023-10-15',
  },
  {
    id: '2',
    slug: 'shopify-slack-notification',
    title: 'Shopify Order to Slack Notification',
    description: 'Get notified in Slack whenever a new order is placed on your Shopify store.',
    author: 'John Doe',
    image: 'https://placehold.co/600x400/f59fa3/white?text=Shopify+Slack',
    categories: ['E-commerce', 'Sales'],
    views: 980,
    downloads: 210,
    date: '2023-10-18',
  },
  {
    id: '3',
    slug: 'seo-report-generator',
    title: 'Weekly SEO Report Generator',
    description: 'Generate a weekly SEO report from Google Analytics and email it to the team.',
    author: 'Jane Smith',
    image: 'https://placehold.co/600x400/8b7ed4/white?text=SEO+Report',
    categories: ['Marketing', 'Analytics'],
    views: 1500,
    downloads: 450,
    date: '2023-10-20',
  },
  {
    id: '4',
    slug: 'lead-enrichment-clearbit',
    title: 'Lead Enrichment with Clearbit',
    description: 'Enrich new leads in Salesforce using Clearbit data automatically.',
    author: 'Mike Ross',
    image: 'https://placehold.co/600x400/e91e63/white?text=Lead+Enrich',
    categories: ['Sales', 'CRM'],
    views: 800,
    downloads: 150,
    date: '2023-10-22',
  },
  {
    id: '5',
    slug: 'telegram-bot-support',
    title: 'Telegram Bot for Support Tickets',
    description: 'Create a support ticket in Zendesk from a Telegram message.',
    author: 'Alice Wonderland',
    image: 'https://placehold.co/600x400/9fa3f5/white?text=Tele+Support',
    categories: ['Customer Support', 'Social Media'],
    views: 1100,
    downloads: 300,
    date: '2023-10-25',
  },
  {
    id: '6',
    slug: 'notion-google-calendar-sync',
    title: 'Notion to Google Calendar Sync',
    description: 'Two-way sync between Notion database items and Google Calendar events.',
    author: 'Bob Builder',
    image: 'https://placehold.co/600x400/f59fa3/white?text=Notion+GCal',
    categories: ['Project Management', 'Productivity'],
    views: 2200,
    downloads: 800,
    date: '2023-10-28',
  },
];
