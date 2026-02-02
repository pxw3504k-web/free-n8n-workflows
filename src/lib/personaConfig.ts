export const PERSONA_CONFIG = {
  marketers: {
    title: "Best Automation for Marketers",
    description: "Discover powerful automation workflows designed specifically for marketing professionals",
    searchQuery: "marketing",
  },
  creators: {
    title: "Best Automation for Creators",
    description: "Find automation tools and workflows tailored for content creators",
    searchQuery: "video",
  },
  beginners: {
    title: "Best Automation for Beginners",
    description: "Start your automation journey with simple and easy-to-use workflows",
    searchQuery: "simple",
  },
  developers: {
    title: "Best Automation for Developers",
    description: "Streamline your development workflow with powerful automation tools",
    searchQuery: "developer",
  },
  sales: {
    title: "Best Automation for Sales Teams",
    description: "Boost your sales productivity with automated workflows and CRM integrations",
    searchQuery: "sales",
  },
  hr: {
    title: "Best Automation for HR Professionals",
    description: "Automate recruitment, onboarding, and employee management processes",
    searchQuery: "hr",
  },
  finance: {
    title: "Best Automation for Finance Teams",
    description: "Automate financial reporting, invoicing, and accounting workflows",
    searchQuery: "finance",
  },
  ecommerce: {
    title: "Best Automation for E-commerce",
    description: "Optimize your online store with automated order processing and inventory management",
    searchQuery: "ecommerce",
  },
  social: {
    title: "Best Automation for Social Media",
    description: "Automate social media posting, engagement, and analytics",
    searchQuery: "social",
  },
} as const;

export type PersonaSlug = keyof typeof PERSONA_CONFIG;
export type PersonaConfig = typeof PERSONA_CONFIG[PersonaSlug];
