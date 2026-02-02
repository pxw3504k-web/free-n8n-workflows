/**
 * Formatting utility functions
 */

/**
 * Special case mappings for app names that need custom formatting
 */
const SPECIAL_CASES: Record<string, string> = {
  // Common acronyms that should be uppercase
  'crm': 'CRM',
  'api': 'API',
  'sms': 'SMS',
  'cms': 'CMS',
  'erp': 'ERP',
  'seo': 'SEO',
  'rss': 'RSS',
  'xml': 'XML',
  'json': 'JSON',
  'csv': 'CSV',
  'pdf': 'PDF',
  'sql': 'SQL',
  'aws': 'AWS',
  'gcp': 'GCP',
  'iam': 'IAM',
  'cdn': 'CDN',
  'dns': 'DNS',
  'ftp': 'FTP',
  'ssh': 'SSH',
  'vpn': 'VPN',
  'http': 'HTTP',
  'https': 'HTTPS',
  
  // Brand names with specific capitalization
  'n8n': 'n8n',
  'github': 'GitHub',
  'gitlab': 'GitLab',
  'youtube': 'YouTube',
  'linkedin': 'LinkedIn',
  'mongodb': 'MongoDB',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'redis': 'Redis',
  'elasticsearch': 'Elasticsearch',
  'wordpress': 'WordPress',
  'woocommerce': 'WooCommerce',
  'shopify': 'Shopify',
  'salesforce': 'Salesforce',
  'hubspot': 'HubSpot',
  'mailchimp': 'Mailchimp',
  'sendgrid': 'SendGrid',
  'twilio': 'Twilio',
  'stripe': 'Stripe',
  'paypal': 'PayPal',
  'dropbox': 'Dropbox',
  'onedrive': 'OneDrive',
  'sharepoint': 'SharePoint',
  'asana': 'Asana',
  'trello': 'Trello',
  'jira': 'Jira',
  'confluence': 'Confluence',
  'zendesk': 'Zendesk',
  'intercom': 'Intercom',
  'freshdesk': 'Freshdesk',
  'typeform': 'Typeform',
  'airtable': 'Airtable',
  'notion': 'Notion',
  'clickup': 'ClickUp',
  'monday': 'Monday.com',
  'basecamp': 'Basecamp',
  'todoist': 'Todoist',
  'evernote': 'Evernote',
  'onenote': 'OneNote',
  'lastpass': 'LastPass',
  'bitbucket': 'Bitbucket',
  'circleci': 'CircleCI',
  'travisci': 'Travis CI',
  'jenkins': 'Jenkins',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'terraform': 'Terraform',
  'ansible': 'Ansible',
  'datadog': 'Datadog',
  'newrelic': 'New Relic',
  'pagerduty': 'PagerDuty',
  'opsgenie': 'Opsgenie',
  'splunk': 'Splunk',
  'sumo': 'Sumo Logic',
  'logstash': 'Logstash',
  'grafana': 'Grafana',
  'prometheus': 'Prometheus',
  'mixpanel': 'Mixpanel',
  'amplitude': 'Amplitude',
  'segment': 'Segment',
  'hotjar': 'Hotjar',
  'optimizely': 'Optimizely',
  'unbounce': 'Unbounce',
  'calendly': 'Calendly',
  'zoom': 'Zoom',
  'webex': 'Webex',
  'gotomeeting': 'GoToMeeting',
  'whereby': 'Whereby',
  'miro': 'Miro',
  'figma': 'Figma',
  'canva': 'Canva',
  'lucidchart': 'Lucidchart',
  'mural': 'Mural',
};

/**
 * Format app name from kebab-case to proper display name
 * 
 * Examples:
 * - "google-sheets" -> "Google Sheets"
 * - "agile-crm" -> "Agile CRM"
 * - "n8n" -> "n8n"
 * - "github" -> "GitHub"
 * 
 * @param name - The app name in kebab-case format
 * @returns Formatted app name with proper capitalization
 */
export function formatAppName(name: string): string {
  if (!name) return '';
  
  // Trim and convert to lowercase for consistency
  const normalized = name.trim().toLowerCase();
  
  // Check if the entire name is a special case (e.g., "n8n", "github")
  if (SPECIAL_CASES[normalized]) {
    return SPECIAL_CASES[normalized];
  }
  
  // Split by hyphens and process each word
  const words = normalized.split('-');
  
  const formattedWords = words.map(word => {
    // Check if this word is a special case
    if (SPECIAL_CASES[word]) {
      return SPECIAL_CASES[word];
    }
    
    // Standard title case: capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  return formattedWords.join(' ');
}

/**
 * Format a number with commas for better readability
 * 
 * Examples:
 * - 1000 -> "1,000"
 * - 1234567 -> "1,234,567"
 * 
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a date to a human-readable string
 * 
 * Examples:
 * - "2024-01-15" -> "Jan 15, 2024"
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a slug to a readable title
 * 
 * Examples:
 * - "agile-crm-to-schedule-trigger" -> "Agile CRM to Schedule Trigger"
 * 
 * @param slug - The slug to format
 * @returns Formatted title
 */
export function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => {
      if (SPECIAL_CASES[word.toLowerCase()]) {
        return SPECIAL_CASES[word.toLowerCase()];
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Truncate text to a maximum length with ellipsis
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Pluralize a word based on count
 * 
 * @param count - The count to check
 * @param singular - Singular form of the word
 * @param plural - Optional plural form (defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || singular + 's';
}



