'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.workflows': 'Workflows',
    'nav.integrations': 'Integrations',
    'nav.components': 'Components',
    'nav.support': 'Support',
    'nav.authors': 'Authors',
    'nav.categories': 'Categories',
    'nav.collections': 'Collections',
    'nav.opal': 'Google Opal Templates',
    'nav.leaderboard': 'Leaderboard',
    'nav.getCustom': 'Get Custom',
    'nav.advertise': 'Advertise',
    'nav.tools': 'Advanced Template Trial',
    'tools.title': 'Advanced Template Trial',
    'tools.subtitle': 'Try professional AI workflows for free. Purchase individual templates for $4.9 to unlock full production access.',
    'tools.tryNow': 'Try for Free',
    'tools.back': 'Back to Tools',
    'tools.buyTemplate': 'Buy this template ($4.9)',
    'seo.audit.title': 'AI SEO Audit (Search Engine Perspective)',
    'seo.audit.description': 'Simulate search engine crawlers and analyze SEO readability with AI.',
    'b2b.leads.title': 'B2B Leads Discovery',
    'b2b.leads.description': 'Enter industry keywords and target city to discover high-value business leads.',
    'reddit.opportunity.title': 'Market Gap Extractor',
    'reddit.opportunity.subtitle': 'Our AI scans thousands of community discussions to identify verified pain points and formulate high-potential market entry strategies.',
    'reddit.opportunity.button.start': 'Launch Mining Protocol',
    'reddit.article.generator.title': 'Reddit Virality Engine',
    'reddit.article.generator.description': 'Select a trending Reddit hotspot and transform community energy into high-engagement long-form articles.',
    'reddit.article.generator.source': 'Pulse Source',
    'reddit.article.generator.select': 'Select Insight',
    'reddit.article.generator.style': 'Style DNA',
    'reddit.article.generator.empty': 'Search a subreddit to begin',
    'reddit.article.generator.label': 'Viral AI Post',
    'reddit.article.generator.summary': 'Executive Summary',
    'reddit.article.generator.engine': 'n8n Neural Engine',
    'reddit.article.generator.publish': 'Publish Workflow',
    'reddit.article.generator.studio': 'Creative Studio',
    'reddit.article.generator.studio.desc': 'Our AI will transform trending data into long-form digital assets.',
    'reddit.article.generator.generating': 'Analyzing community sentiment and linguistic trends...',
    'article.illustrator.title': 'Article Illustrator',
    'article.illustrator.description': 'Generate storyboard scripts and illustrations automatically from article content.',
    'magic.inpainting.title': 'Smart Image Inpainting',
    'magic.inpainting.description': 'Erase or replace objects in images with automatic background filling.',
    'product.photo.title': 'Product Photo Generator',
    'product.photo.description': 'Upload product photos and generate high-conversion e-commerce scenes with AI.',
    'product.hunt.title': 'Product Hunt Daily',
    'product.hunt.description': 'Get today\'s top trending tech products globally in one click.',
    'brand.sentiment.title': 'Brand Sentiment Analysis',
    'brand.sentiment.description': 'Monitor brand discussions and sentiment trends on Reddit in real-time.',
    'invoice.extractor.title': 'Smart Invoice Recognition',
    'invoice.extractor.description': 'Automatically extract key information from PDF or image invoices.',
    'reddit.article.title': 'Reddit Hot Topic Article',
    'reddit.article.description': 'Generate marketing articles based on Reddit trending topics.',
    'reddit.hotspot.title': 'Reddit Hotspot Monitor',
    'reddit.hotspot.description': 'Track hot posts in specific subreddits in real-time.',
    'company.research.title': 'Company Due Diligence',
    'company.research.description': 'Quickly get market positioning and competitive intelligence of target companies.',
    'search.placeholder': 'Enter the problem you want to solve, we\'ll match the best workflows',
    'common.results': 'Results',
    'common.download': 'Download',
    'common.copy': 'Copy',
    'common.original': 'Original',
    'common.status.ready': 'Ready',
    'common.status.processing': 'Processing...',
    'common.view.original': 'View Original',
    'common.generate': 'Generate',
    'common.upload': 'Upload',
    'common.upload.hint': 'Click or drag to upload',
    
    'seo.url.placeholder': 'Enter URL to audit...',
    'seo.status.auditing': 'Auditing...',
    'seo.score.label': 'SEO Score',
    'seo.summary': 'Audit Summary',
    'seo.recommendations': 'Recommendations',
    'seo.technical': 'Technical Details',
    'seo.analyzing': 'AI is analyzing SEO...',
    'seo.analyzing.description': 'This may take 10-20 seconds, please wait.',
    'seo.start.audit': 'Start Audit',
    'seo.score.title': 'SEO Score',
    'seo.score.max': 'Max 10.0',
    'seo.summary.title': 'Analysis Summary',
    'seo.recommendations.title': 'Optimization Suggestions',
    'seo.recommendations.empty': 'No suggestions yet',
    'seo.technical.details.title': 'Technical Details',
    'seo.technical.h1': 'H1 Tag',
    'seo.technical.meta': 'Meta Tags',
    'seo.audit.pro.tip': 'Higher scores generally correlate with better crawlability. Ensure your {meta} align with your {h1} for maximum relevance injection.',
    'common.pro.tip': 'Pro Tip',
    
    'b2b.leads.input.industry': 'Target Industry',
    'b2b.leads.input.location': 'Location',
    'b2b.leads.input.limit': 'Intensity',
    'b2b.leads.status.mining': 'Mining Databases...',
    'b2b.leads.button.start': 'Initialize Mining',
    'b2b.leads.results.entities': 'Detected Entities',
    'b2b.leads.table.context': 'Business Context',
    'b2b.leads.table.contacts': 'Contact Intelligence',
    'b2b.leads.table.maturity': 'Lead Maturity',
    'b2b.leads.quality': 'Quality',
    'b2b.leads.keyword': 'Industry Keywords',
    'b2b.leads.city': 'Target City',
    'b2b.leads.start': 'Start Mining',
    
    'brand.sentiment.input.brand': 'Target Monitor',
    'brand.sentiment.input.placeholder': 'E.g. "n8n", "Tesla"...',
    'brand.sentiment.status.scanning': 'Scanning Socials...',
    'brand.sentiment.button.analyze': 'Analyze Sentiment',
    'brand.sentiment.overall.reputation': 'Overall Reputation',
    'brand.sentiment.score.label': 'Score',
    'brand.sentiment.conversations': 'Key Conversations',
    'brand.sentiment.ai.insight': 'Executive AI Insight',
    
    'magic.inpainting.brush': 'Brush',
    'magic.inpainting.undo': 'Undo',
    'magic.inpainting.clear': 'Clear All',
    'magic.inpainting.invoke': 'Invoke Magic',
    'magic.inpainting.target.label': 'Target Object',
    'magic.inpainting.target.placeholder': 'Describe what should be here...',
    'magic.inpainting.how.to.use': 'Paint over the object you want to change.',
    
    'product.photo.step.image': 'Product Image',
    'product.photo.step.vision': 'Creative Vision',
    'product.photo.step.reference': 'Style References',
    'product.photo.button.generate': 'Start Generation',
    'product.photo.composition': 'Final Composition',
    'product.photo.transparent': 'Transparent Layer',
    'product.photo.fine.tune': 'Fine Tune (Magic Inpainting)',
    
    'article.illustrator.scenes.count': '{count} Scenes',
    'article.illustrator.narrator': 'Narrator',
    'article.illustrator.dialogue': 'Dialogue',
    'article.illustrator.preview': 'Storyboard Preview',
    'article.illustrator.input': 'Article Content',
    'article.illustrator.generate': 'Generate Illustration',
    
    'invoice.extractor.input': 'Document Input',
    'invoice.extractor.fields': 'Extracted Fields',
    'invoice.extractor.reconcile': 'Reconcile Data',
    
    'product.hunt.ranking': 'Global Ranking',
    'product.hunt.access': 'Access Today\'s Ranking',
    
    'reddit.hotspot.source': 'Reddit Source',
    'reddit.hotspot.algorithm': 'Algorithm',
    'reddit.hotspot.fetch': 'Fetch Feed',
    
    'company.research.entity': 'Entity Search',
    'company.research.scope': 'Research Scope',
    'company.research.dashboard': 'Intelligence Dashboard',
    'company.research.ecosystem': 'Ecosystem Nodes',
    'company.research.market': 'Market Cluster',
    'company.research.domain': 'Digital Domain',
    'company.research.cost': 'Base Entry Cost',
    'company.research.verified': 'Technical Profile Verified',
    'home.latestWorkflows': 'Latest Workflows',
    'home.showing': 'Showing',
    'home.of': 'of',
    'sidebar.categories': 'Categories',
    'sidebar.sortBy': 'Sort By',
    'sidebar.whoAmI': 'Who Am I?',
    'sidebar.whoAmIDesc': 'New here? Find workflows tailored for you',
    'sidebar.persona.marketers': 'Marketer',
    'sidebar.persona.creators': 'Creator',
    'sidebar.persona.beginners': 'Beginner',
    'sidebar.persona.developers': 'Developer',
    'sidebar.persona.sales': 'Sales',
    'sidebar.persona.hr': 'HR',
    'sidebar.persona.finance': 'Finance',
    'sidebar.persona.ecommerce': 'E-commerce',
    'sidebar.persona.social': 'Social Media',
    'sidebar.showMore': 'Show More',
    'sidebar.showLess': 'Show Less',
    // Advertise page
    'advertise.heroTitle': 'Reach Thousands of Automation Experts & Decision Makers',
    'advertise.heroSubtitle': 'The premier destination for n8n workflows, self-hosted tools, and AI automation. Promote your product to a high-intent technical audience.',
    'advertise.ctaButton': 'Get in Touch',
    'advertise.stats.monthlyViews': 'Monthly Views',
    'advertise.stats.workflowDownloads': 'Workflow Downloads',
    'advertise.stats.audienceType': 'Audience Type',
    'advertise.stats.avgTimeOnSite': 'Avg. Time on Site',
    'advertise.contact.title': 'Get in Touch',
    'advertise.contact.subtitle': 'Fill out the form below and we\'ll get back to you within 24 hours.',
    'advertise.contact.name': 'Name',
    'advertise.contact.email': 'Email',
    'advertise.contact.company': 'Company',
    'advertise.contact.message': 'Message',
    'advertise.contact.submit': 'Send Message',
    'advertise.contact.submitting': 'Sending...',
    'advertise.contact.success': 'Thank you! We\'ll get back to you soon.',
    'advertise.contact.error': 'Failed to send message. Please try again.',
    'advertise.audience.title': 'Who reads n8nworkflows.world?',
    'advertise.audience.selfHosters.title': 'Self-Hosters & SysAdmins',
    'advertise.audience.selfHosters.desc': 'People looking for VPS, domains, and hosting solutions.',
    'advertise.audience.founders.title': 'SaaS Founders & CTOs',
    'advertise.audience.founders.desc': 'Decision makers looking for APIs and efficiency tools.',
    'advertise.audience.engineers.title': 'Automation Engineers',
    'advertise.audience.engineers.desc': 'Power users looking for advanced integrations and proxies.',
    'advertise.sponsorship.title': 'Sponsorship Options',
    'advertise.sponsorship.workflow.title': 'Sponsored Workflow',
    'advertise.sponsorship.workflow.desc': 'We create (or you provide) a dedicated workflow using your tool. It gets pinned to the homepage and tagged as \'Featured\'.',
    'advertise.sponsorship.workflow.bestFor': 'Best For: API tools, SaaS integrations.',
    'advertise.sponsorship.banner.title': 'Header/Sidebar Display',
    'advertise.sponsorship.banner.desc': 'High-visibility banner placement on the homepage and workflow detail pages.',
    'advertise.sponsorship.banner.bestFor': 'Best For: Brand awareness, Hosting offers.',
    'advertise.sponsorship.content.title': 'Content Deep Dive',
    'advertise.sponsorship.content.desc': 'A dedicated blog post or \'How-to\' guide focusing on your product\'s use case with n8n.',
    'advertise.sponsorship.content.bestFor': 'Best For: Complex products needing explanation.',
    'advertise.getStarted.title': 'Get Started',
    'advertise.getStarted.text': 'Ready to grow? Let\'s find the right package for you. We are open to custom collaborations.',
    'advertise.getStarted.contactEmail': 'pxw3504k@gmail.com',
    'advertise.getStarted.form.name': 'Name',
    'advertise.getStarted.form.workEmail': 'Work Email',
    'advertise.getStarted.form.website': 'Website URL',
    'advertise.getStarted.form.message': 'Message',
    'advertise.getStarted.form.submit': 'Inquire about Sponsorship',
    'advertise.getStarted.form.submitting': 'Sending...',
    'advertise.getStarted.form.success': 'Thank you! We\'ll contact you within 24 hours.',
    'sort.mostPopular': 'Most Downloaded',
    'sort.newest': 'Newest',
    'sort.trending': 'Trending',
    'sort.communityVerified': '👥 Community Verified',
    'sort.hardToEasy': 'Hard to Easy',
    'sort.easyToHard': 'Easy to Hard',
    'workflow.nodes': 'nodes',
    'workflow.views': 'views',
    'workflow.downloads': 'downloads',
    'workflow.viewWorkflow': 'View Workflow',
    'workflow.difficulty.beginner': 'Beginner',
    'workflow.difficulty.intermediate': 'Intermediate',
    'workflow.difficulty.advanced': 'Advanced',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'detail.about': 'About This Workflow',
    'detail.features': 'Key Features',
    'detail.howToUse': 'How To Use',
    'detail.appsUsed': 'Apps Used',
    'detail.workflowJson': 'Workflow JSON',
    'detail.copySample': 'Copy Sample JSON',
    'detail.interactiveViewer': 'Interactive Viewer',
    'detail.nodesConnected': 'nodes connected',
    'detail.relatedWorkflows': 'Related Workflows',
    'detail.relatedWorkflowsDescription': 'Discover more workflows you might like',
    'custom.title': 'Get Your Custom Workflow',
    'custom.subtitle': 'Fill the form and receive a tailored offer from our experts',
    'custom.name': 'Name',
    'custom.optional': 'optional',
    'custom.namePlaceholder': 'John Doe',
    'custom.companyName': 'Company Name',
    'custom.companyNamePlaceholder': 'Acme Corp',
    'custom.companyWebsite': 'Company Website',
    'custom.companyWebsitePlaceholder': 'acmecorp.com',
    'custom.email': 'Email',
    'custom.emailPlaceholder': 'john@example.com',
    'custom.budgetRange': 'Budget Range (USD)',
    'custom.budgetRangePlaceholder': 'Select your budget range',
    'custom.budget.under1k': 'Under $1,000',
    'custom.budget.1k5k': '$1,000 - $5,000',
    'custom.budget.5k10k': '$5,000 - $10,000',
    'custom.budget.10k25k': '$10,000 - $25,000',
    'custom.budget.25k50k': '$25,000 - $50,000',
    'custom.budget.50kPlus': '$50,000+',
    'custom.message': 'Message',
    'custom.messagePlaceholder': 'Tell us about your project, timeline, and what you need help with...',
    'custom.characters': 'characters',
    'custom.minimum': 'minimum',
    'custom.sendMessage': 'Send Message',
    'custom.submitting': 'Submitting...',
    'custom.successMessage': 'Thank you! Your request has been submitted successfully. We will contact you within 24 hours.',
    'custom.errorMessage': 'Failed to submit. Please check your inputs and try again.',
    'custom.responseTime': 'We typically respond within 24 hours',
    'team.title': 'Meet The Team Behind',
    'team.description': 'We\'re the passionate team behind Free N8N Temples and Free N8N, dedicated to revolutionizing automation through AI-powered workflows and cutting-edge technology.',
    'team.linkedin': 'in LinkedIn',
    'mission.title': 'Our Mission',
    'mission.statement': 'At Free N8N Temples, we believe in democratizing automation through AI-powered workflows. Our team combines deep technical expertise with a passion for solving real-world problems, creating solutions that help businesses and individuals automate their processes efficiently and intelligently.',
    'support.title': 'Support the Project',
    'support.description': 'Support our work and help us keep the Free N8N Workflow Catalog running and growing!',
    'support.chooseAmount': 'Choose Your Amount',
    'support.amountRange': 'Amount must be between $1 and $100',
    'support.amountRangeError': 'Amount must be between $1 and $100',
    'support.quickSelect': 'Quick Select',
    'support.supportButton': 'Support the project for {amount}',
    'support.processing': 'Processing...',
    'support.scanQRCode': 'Scan QR Code with WeChat',
    'support.qrCodeHint': 'Please complete payment within 30 minutes',
    'support.securePayment': 'Secure payment powered by WeChat Pay',
    'support.createOrderError': 'Failed to create payment order',
    'support.networkError': 'Network error, please try again',
    'support.paymentSuccess': 'Payment successful! Thank you for your support!',
    'support.orderExpired': 'Order expired, please create a new order',
    'support.close': 'Close',
    'support.back': 'Back',
    'support.loadingQRCode': 'Generating QR code...',
    // Categories page
    'categories.title': 'Browse Workflow Categories',
    'categories.subtitle': 'Explore workflows organized by business function and use case. Find automation solutions for your specific needs.',
    'categories.cardDescription': 'Click to view workflows in this category.',
    'categories.workflows': 'workflows',
    'collections.title': 'Workflow Collections',
    'collections.subtitle': 'Curated collections of automation workflows designed for specific business scenarios and use cases.',
    'collections.cardDescription': 'Click to explore workflows in this collection.',
    'collections.workflows': 'workflows',
    'collections.featured': 'Featured Collection',
    // Collection page specific
    'collection.download.prepare': 'Prepare & Download ZIP',
    'collection.download.ready': 'Download ZIP',
    'collection.relatedCollections': 'Related Collections',
    'breadcrumb.home': 'Home',
    'breadcrumb.collections': 'Collections',
    'collection.unlockTitle': 'Unlock Full Collection Download',
    'collection.unlockButton': 'Unlock & Download',
    // Authors page
    'authors.title': 'Community Contributors',
    'authors.subtitle': 'Meet the experts and curators behind our workflow library.',
    'authors.joined': 'Joined',
    'authors.role': 'Role',
    'authors.workflows': 'Workflows Created',
    'authors.handle': 'Handle',
    // Leaderboard page
    'leaderboard.title': 'Hall of Fame',
    'leaderboard.subtitle': 'Discover the most popular automation workflows',
    // Monetization - Hosting Sidebar
    'monetization.sidebar.title': 'RECOMMENDED HOSTING',
    'monetization.sidebar.zeabur.title': 'Zeabur',
    'monetization.sidebar.zeabur.desc': 'Deploy n8n in seconds with one-click',
    'monetization.sidebar.do.title': 'DigitalOcean',
    'monetization.sidebar.do.desc': 'Reliable cloud hosting for n8n',
    // Monetization - Deploy Options
    'monetization.detail.title': 'Ready to Deploy This Workflow?',
    'monetization.detail.zeabur_btn': 'Deploy on Zeabur',
    'monetization.detail.do_btn': 'Get $200 Credit on DigitalOcean',
    // Submit workflow (UGC)
    'submit.title': 'Submit Your Workflow',
    'submit.subtitle': 'Share your automation magic with the world.',
    'submit.form.title_label': 'Workflow Title',
    'submit.form.description_label': 'Description',
    'submit.form.json_label': 'Workflow Code (JSON)',
    'submit.form.json_placeholder': 'Paste the code from n8n editor...',
    'submit.form.author_name_label': 'Author Name',
    'submit.form.author_url_label': 'Author Website / Twitter',
    'submit.form.author_reward_hint': '🚀 Reward: Your link will be displayed to thousands of users if featured!',
    'submit.form.submit_btn': 'Submit for Review',
    'submit.success': 'Submission Received! We will review it shortly.',
    'submit.errors.titleTooShort': 'Title must be at least 5 characters.',
    'submit.errors.nodesInvalid': 'Workflow JSON is invalid.',
    'submit.errors.authorUrlInvalid': 'Author URL is invalid. Use http(s) format.',
    'submit.errors.missingFields': 'Please fill in the required fields.',
    'submit.errors.serverError': 'Server error. Please try again later.',
    // Search related
    'search.button': 'AI Search',
    'search.noResults': 'No workflows found for the selected filters.',
    'search.resultsFor': 'Results for',
    'search.tryExamples': 'Try:',
    'search.loading': 'Loading...',
    'search.suggestions': 'Suggestions',
    // Trending section
    'trending.description': 'These are the most popular automations saving people 10+ hours this week.',
    // Share messages
    'share.copied': 'Link copied to clipboard!',
    'share.shared': 'Shared successfully!',
    'share.error': 'Failed to share. Please try again.',
    'nav.submit': 'Submit',
    'brand.name': 'Free N8N',
    'footer.description': 'The best place to find, share, and learn about n8n workflows. Community-driven templates to automate your work.',
    'footer.declaration': 'N8Nworkflows is a project under AIWord LLC. Built with ❤️ for the automation community.',
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.workflows': 'Workflows',
    'footer.categories': 'Categories',
    'footer.authors': 'Authors',
    'footer.collections': 'Collections',
    'footer.opal': 'Google Opal Templates',
    'footer.leaderboard': 'Leaderboard',
    'newsletter.title': 'Newsletter',
    'newsletter.description': 'Stay updated with the latest workflows and automation tips.',
    'newsletter.subscribe': 'Subscribe',
    'newsletter.follow': 'Follow our public account',
    'footer.joinGroup': 'Join our group',
    'contact.scanHint': 'Scan the QR code to join the group',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.popularIntegrations': 'Popular n8n Integrations',
    'footer.popularIntegrationsDesc': 'Connect your favorite apps and automate workflows',
    // Integrations
    'integration.directory.title': 'Popular n8n Integrations',
    'integration.directory.description': 'Browse hundreds of ready-to-use workflow combinations. Connect your favorite apps and services with n8n automation templates. No coding required.',
    'integration.directory.integrations': 'Integration Combinations',
    'integration.directory.workflows': 'Workflows',
    'integration.directory.viewAll': 'View All Integrations',
    'integration.directory.about': 'About n8n Integration Workflows',
    'integration.directory.aboutDesc': 'n8n is a powerful open-source workflow automation tool that connects hundreds of apps and services. This directory showcases the most popular integration combinations created by our community, helping you automate repetitive tasks and streamline your workflows.',
    'integration.directory.categories': 'Popular Integration Categories',
    'integration.directory.dataAnalytics': 'Data & Analytics',
    'integration.directory.dataAnalyticsDesc': 'Connect databases, spreadsheets, and BI tools for automated reporting and data sync.',
    'integration.directory.communication': 'Communication',
    'integration.directory.communicationDesc': 'Integrate Slack, Discord, email, and messaging platforms for team notifications.',
    'integration.directory.development': 'Development',
    'integration.directory.developmentDesc': 'Connect GitHub, GitLab, Jira, and DevOps tools for CI/CD automation.',
    'integration.directory.productivity': 'Productivity',
    'integration.directory.productivityDesc': 'Automate tasks between Notion, Google Workspace, Airtable, and more.',
    'integration.directory.whyN8n': 'Why Choose n8n?',
    'integration.directory.openSource': 'Free & Open Source',
    'integration.directory.openSourceDesc': 'Self-host and customize without vendor lock-in',
    'integration.directory.visualEditor': 'Visual Workflow Editor',
    'integration.directory.visualEditorDesc': 'Build automations with an intuitive drag-and-drop interface',
    'integration.directory.manyIntegrations': '400+ Integrations',
    'integration.directory.manyIntegrationsDesc': 'Connect to popular apps, APIs, and databases',
    'integration.directory.communityTemplates': 'Community Templates',
    'integration.directory.communityTemplatesDesc': 'Download and customize workflows created by thousands of users',
    'integration.directory.selfHosted': 'Self-Hosted or Cloud',
    'integration.directory.selfHostedDesc': 'Choose between n8n.cloud or deploy on your own infrastructure',
    'integration.directory.gettingStarted': 'Getting Started',
    'integration.directory.gettingStartedDesc': 'Click on any integration above to see available workflows. Each workflow includes a visual preview, detailed documentation, and a downloadable JSON file. Import it into your n8n instance, configure your app credentials, and you\'re ready to automate!',
    'integration.detail.workflowsAvailable': 'Workflows Available',
    'integration.detail.connect': 'Connect',
    'integration.detail.and': 'and',
    'integration.detail.availableWorkflows': 'Available Workflows',
    'integration.detail.workflow': 'workflow',
    'integration.detail.workflows': 'workflows',
    'integration.detail.noWorkflowsTitle': 'No workflows found yet',
    'integration.detail.noWorkflowsDesc': 'We\'re working on adding workflows for this integration. Check back soon or',
    'integration.detail.submitYourOwn': 'submit your own workflow',
    'integration.detail.aboutIntegration': 'About {appA} and {appB} Integration',
    'integration.detail.aboutDesc': 'n8n is a powerful workflow automation tool that allows you to connect {appA} and {appB} seamlessly. With these pre-built workflows, you can automate data synchronization, trigger actions based on events, and create sophisticated integrations without writing code.',
    'integration.detail.whyUseN8n': 'Why Use n8n for {appA} + {appB} Integration?',
    'integration.detail.noCodeSolution': 'No-Code Solution',
    'integration.detail.noCodeSolutionDesc': 'Connect apps visually without technical expertise',
    'integration.detail.freeOpenSource': 'Free & Open Source',
    'integration.detail.freeOpenSourceDesc': 'Self-host and customize to your needs',
    'integration.detail.readyTemplates': 'Ready-to-Use Templates',
    'integration.detail.readyTemplatesDesc': 'Download and import workflows instantly',
    'integration.detail.communitySupport': 'Community Support',
    'integration.detail.communitySupportDesc': 'Thousands of users sharing workflows and tips',
    'integration.detail.gettingStartedTitle': 'Getting Started',
    'integration.detail.gettingStartedDesc': 'Browse the workflows above, click on any workflow to view its details, and download the JSON file. Import it into your n8n instance, configure your credentials for {appA} and {appB}, and you\'re ready to automate! Each workflow includes detailed documentation and setup instructions.',
    // Privacy & Terms
    'privacy.title': 'Privacy Policy',
    'privacy.p1': 'We value your privacy. This policy explains how we collect, use, and protect your information when you use Free N8N.',
    'privacy.p2': 'We collect information you provide directly (e.g., submissions, contact requests) and technical data (e.g., logs, usage) to improve our service.',
    'privacy.p3': 'We do not sell your personal data. We may share aggregated or anonymized data with partners.',
    'privacy.p4': 'If you have questions, contact us at ' + (process.env.NEXT_PUBLIC_PRIVACY_EMAIL || 'privacy@n8nworkflows.world') + '.',
    'terms.title': 'Terms of Service',
    // Full Privacy content (English)
    'privacy.content': `Last updated: 2025-01-01

This Privacy Policy explains how Free N8N ("we", "us", or "our") collects, uses, shares, and protects information about you when you use our website and related services (the "Service").

1. Information We Collect
- Information you provide directly: account/contact information, workflow submissions, messages, and support requests.
- Usage information: pages visited, search queries, clicks, downloads, and timestamps.
- Technical information: IP address, browser type/version, device identifiers, and cookies.

2. How We Use Information
- Provide and improve the Service, including rendering pages and generating previews.
- Analyze usage to improve features, detect fraud, and understand traffic.
- Communicate with you about your submissions, account, or support requests.

3. Sharing and Disclosure
We do not sell personal data. We may share:
- Service providers and partners who perform services on our behalf (e.g., hosting, analytics).
- Aggregated or anonymized data for research and product improvement.
We will only disclose personal data when required by law or to protect rights and safety.

4. Cookies and Tracking
We use cookies and similar technologies (including Google Analytics) to collect usage and performance data. You can manage cookie preferences via your browser.

5. Data Retention and Deletion
We retain personal data as necessary to provide the Service and comply with legal obligations. You may request deletion of your data; see the Contact section.

6. International Transfers
Data may be processed or stored outside your jurisdiction. We take appropriate safeguards to protect transferred data.

7. Your Rights
Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data. Contact us to exercise these rights.

Contact: ${process.env.NEXT_PUBLIC_PRIVACY_EMAIL || 'privacy@n8nworkflows.world'}`,
    // Full Terms content (English)
    'terms.content': `Effective date: 2025-01-01

Welcome to Free N8N. These Terms of Service ("Terms") govern your access to and use of our website and services. By using the Service you agree to these Terms.

1. Use of the Service
You may use the Service for lawful purposes only. You agree not to use the Service to infringe rights, distribute malware, or engage in unlawful activities.

2. Submissions and Content
Users may submit workflows and related content. You retain ownership of your submissions but grant Free N8N a non-exclusive, worldwide, royalty-free license to display, distribute, and promote submitted content on the Service.
You represent that you have the necessary rights to submit the content and that submissions do not violate third-party rights.

3. Moderation and Removal
We reserve the right to review, remove, or refuse any content that violates these Terms or our policies.

4. Disclaimers and Liability
The Service is provided "as is". We disclaim warranties to the extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of the Service.

5. Indemnification
You agree to indemnify and hold harmless Free N8N from claims arising from your breach of these Terms or your submissions.

6. Changes to Terms
We may modify these Terms from time to time; updated Terms will be posted with a new effective date.

Contact: ${process.env.NEXT_PUBLIC_LEGAL_EMAIL || 'legal@n8nworkflows.world'}`,
  },
  zh: {
    'nav.workflows': '工作流',
    'nav.integrations': '目录',
    'nav.components': '组件',
    'nav.support': '支持',
    'nav.authors': '作者',
    'nav.categories': '分类',
    'nav.collections': '集合',
    'nav.opal': 'Google Opal 模版',
    'nav.leaderboard': '排行榜',
    'nav.getCustom': '获取定制',
    'nav.advertise': '广告合作',
    'search.placeholder': '输入你想要解决的问题，我们自动匹配最佳工作流',
    'common.results': '结果',
    'common.download': '下载',
    'common.copy': '复制',
    'common.original': '原图',
    'common.status.ready': '就绪',
    'common.status.processing': '处理中...',
    'common.view.original': '查看原文',
    'common.generate': '生成',
    'common.upload': '上传',
    'common.upload.hint': '点击或拖拽上传',
    
    'seo.url.placeholder': '输入要审计的网址，例如：https://example.com',
    'seo.status.auditing': '审计中...',
    'seo.score.label': 'SEO 评分',
    'seo.summary': '分析摘要',
    'seo.recommendations': '优化建议',
    'seo.technical': '技术细节',
    'seo.audit.pro.tip': '评分越高通常意味着更好的爬取可能性。确保您的 {meta} 与 {h1} 保持一致，以实现最大程度的相关性注入。',
    'common.pro.tip': '专家建议',
    
    'b2b.leads.input.industry': '目标行业',
    'b2b.leads.input.location': '地理位置',
    'b2b.leads.input.limit': '挖掘深度',
    'b2b.leads.status.mining': '正在挖掘数据库...',
    'b2b.leads.button.start': '开始挖掘',
    'b2b.leads.results.entities': '发现实体',
    'b2b.leads.table.context': '业务背景',
    'b2b.leads.table.contacts': '联系人情报',
    'b2b.leads.table.maturity': '线索成熟度',
    'b2b.leads.quality': '质量',
    
    'brand.sentiment.input.brand': '监控目标',
    'brand.sentiment.input.placeholder': '例如 "n8n", "特斯拉"...',
    'brand.sentiment.status.scanning': '正在扫描社交媒体...',
    'brand.sentiment.button.analyze': '分析情绪',
    'brand.sentiment.overall.reputation': '全网口碑',
    'brand.sentiment.score.label': '评分',
    'brand.sentiment.conversations': '关键对话',
    'brand.sentiment.ai.insight': 'AI 决策洞察',
    
    'magic.inpainting.brush': '画笔',
    'magic.inpainting.undo': '撤销',
    'magic.inpainting.clear': '清除全部',
    'magic.inpainting.invoke': '调用魔法',
    'magic.inpainting.target.label': '目标物体',
    'magic.inpainting.target.placeholder': '描述这里应该出现什么...',
    'magic.inpainting.how.to.use': '涂抹你想要修改或消除的物体。',
    
    'product.photo.step.image': '商品主图',
    'product.photo.step.vision': '创意设想',
    'product.photo.step.reference': '风格参考',
    'product.photo.button.generate': '开始生成',
    'product.photo.composition': '最终场景图',
    'product.photo.transparent': '透明图层',
    'product.photo.fine.tune': '微调 (智能修复)',
    
    'article.illustrator.scenes.count': '{count} 个场景',
    'article.illustrator.narrator': '旁白',
    'article.illustrator.dialogue': '对话',
    'article.illustrator.preview': '分镜预览',
    
    'invoice.extractor.input': '发票输入',
    'invoice.extractor.fields': '提取字段',
    'invoice.extractor.reconcile': '数据核对',
    
    'product.hunt.ranking': '全球排行',
    'product.hunt.access': '获取今日榜单',
    
    'reddit.hotspot.source': 'Reddit 板块',
    'reddit.hotspot.algorithm': '排序算法',
    'reddit.hotspot.fetch': '获取订阅集',
    
    'company.research.entity': '实体搜索',
    'company.research.scope': '研究范围',
    'company.research.dashboard': '情报看板',
    'company.research.ecosystem': '生态节点',
    'company.research.market': '市场集群',
    'company.research.domain': '数字域名',
    'company.research.cost': '准入门槛',
    'company.research.verified': '技术画像验证',
    'home.latestWorkflows': '最新工作流',
    'home.showing': '显示',
    'home.of': '共',
    'sidebar.categories': '分类',
    'sidebar.sortBy': '排序方式',
    'sidebar.whoAmI': '我是谁？',
    'sidebar.whoAmIDesc': '新用户？找到适合你的工作流',
    'sidebar.persona.marketers': '营销人员',
    'sidebar.persona.creators': '内容创作者',
    'sidebar.persona.beginners': '初学者',
    'sidebar.persona.developers': '开发者',
    'sidebar.persona.sales': '销售',
    'sidebar.persona.hr': '人力资源',
    'sidebar.persona.finance': '财务',
    'sidebar.persona.ecommerce': '电商',
    'sidebar.persona.social': '社交媒体',
    'sidebar.showMore': '查看更多',
    'sidebar.showLess': '收起',
    // Advertise page
    'advertise.heroTitle': '触达数千名自动化专家与决策者',
    'advertise.heroSubtitle': 'n8n 工作流、自托管工具和 AI 自动化的首选平台。向高意向技术受众推广您的产品。',
    'advertise.ctaButton': '联系我们',
    'advertise.stats.monthlyViews': '月浏览量',
    'advertise.stats.workflowDownloads': '工作流下载量',
    'advertise.stats.audienceType': '受众类型',
    'advertise.stats.avgTimeOnSite': '平均停留时间',
    'advertise.contact.title': '联系我们',
    'advertise.contact.subtitle': '填写下面的表单，我们将在24小时内回复您。',
    'advertise.contact.name': '姓名',
    'advertise.contact.email': '邮箱',
    'advertise.contact.company': '公司',
    'advertise.contact.message': '留言',
    'advertise.contact.submit': '发送消息',
    'advertise.contact.submitting': '发送中...',
    'advertise.contact.success': '感谢！我们会尽快回复您。',
    'advertise.contact.error': '发送失败，请重试。',
    'advertise.audience.title': '谁在阅读 n8nworkflows.world？',
    'advertise.audience.selfHosters.title': '自托管者 & 系统管理员',
    'advertise.audience.selfHosters.desc': '寻找 VPS、域名和托管解决方案的人群。',
    'advertise.audience.founders.title': 'SaaS 创始人 & CTO',
    'advertise.audience.founders.desc': '寻找 API 和效率工具的决策者。',
    'advertise.audience.engineers.title': '自动化工程师',
    'advertise.audience.engineers.desc': '寻找高级集成和代理的高级用户。',
    'advertise.sponsorship.title': '合作方式',
    'advertise.sponsorship.workflow.title': '原生推荐',
    'advertise.sponsorship.workflow.desc': '我们创建（或您提供）一个使用您工具的专用工作流。它会被固定在首页并标记为"精选"。',
    'advertise.sponsorship.workflow.bestFor': '适合：API 工具、SaaS 集成。',
    'advertise.sponsorship.banner.title': '通栏广告',
    'advertise.sponsorship.banner.desc': '在首页和工作流详情页的高可见度横幅广告位。',
    'advertise.sponsorship.banner.bestFor': '适合：品牌知名度、托管服务。',
    'advertise.sponsorship.content.title': '内容植入',
    'advertise.sponsorship.content.desc': '专门的文章或"使用指南"，重点介绍您的产品与 n8n 的使用场景。',
    'advertise.sponsorship.content.bestFor': '适合：需要详细说明的复杂产品。',
    'advertise.getStarted.title': '开始合作',
    'advertise.getStarted.text': '准备好成长了吗？让我们为您找到合适的方案。我们欢迎定制化合作。',
    'advertise.getStarted.contactEmail': 'pxw3504k@gmail.com',
    'advertise.getStarted.form.name': '姓名',
    'advertise.getStarted.form.workEmail': '工作邮箱',
    'advertise.getStarted.form.website': '网站地址',
    'advertise.getStarted.form.message': '留言',
    'advertise.getStarted.form.submit': '咨询合作',
    'advertise.getStarted.form.submitting': '发送中...',
    'advertise.getStarted.form.success': '感谢！我们将在24小时内联系您。',
    'sort.mostPopular': '下载最多',
    'sort.newest': '最新',
    'sort.trending': '热门',
    'sort.communityVerified': '👥 社区认证',
    'sort.hardToEasy': '由难到易',
    'sort.easyToHard': '由易到难',
    'workflow.nodes': '个节点',
    'workflow.views': '次浏览',
    'workflow.downloads': '次下载',
    'workflow.viewWorkflow': '查看工作流',
    'workflow.difficulty.beginner': '初级',
    'workflow.difficulty.intermediate': '中级',
    'workflow.difficulty.advanced': '高级',
    'pagination.previous': '上一页',
    'pagination.next': '下一页',
    'detail.about': '关于此工作流',
    'detail.features': '主要功能',
    'detail.howToUse': '使用方法',
    'detail.appsUsed': '使用的应用',
    'detail.workflowJson': '工作流 JSON',
    'detail.copySample': '复制示例 JSON',
    'detail.interactiveViewer': '交互式查看器',
    'detail.nodesConnected': '个节点已连接',
    'detail.relatedWorkflows': '相关工作流',
    'detail.relatedWorkflowsDescription': '发现更多您可能喜欢的工作流',
    'custom.title': '获取您的定制工作流',
    'custom.subtitle': '填写表单，我们的专家将为您提供量身定制的方案',
    'custom.name': '姓名',
    'custom.optional': '可选',
    'custom.namePlaceholder': '张三',
    'custom.companyName': '公司名称',
    'custom.companyNamePlaceholder': '示例公司',
    'custom.companyWebsite': '公司网站',
    'custom.companyWebsitePlaceholder': 'example.com',
    'custom.email': '邮箱',
    'custom.emailPlaceholder': 'zhangsan@example.com',
    'custom.budgetRange': '预算范围（人民币）',
    'custom.budgetRangePlaceholder': '请选择您的预算范围',
    'custom.budget.under1k': '1万元以下',
    'custom.budget.1k5k': '1万 - 5万元',
    'custom.budget.5k10k': '5万 - 10万元',
    'custom.budget.10k25k': '10万 - 25万元',
    'custom.budget.25k50k': '25万 - 50万元',
    'custom.budget.50kPlus': '50万元以上',
    'custom.message': '项目描述',
    'custom.messagePlaceholder': '请告诉我们您的项目需求、时间安排以及需要帮助的内容...',
    'custom.characters': '字符',
    'custom.minimum': '最少',
    'custom.sendMessage': '发送消息',
    'custom.submitting': '提交中...',
    'custom.successMessage': '感谢您！您的请求已成功提交。我们将在24小时内与您联系。',
    'custom.errorMessage': '提交失败。请检查您的输入后重试。',
    'custom.responseTime': '我们通常在24小时内回复',
    'team.title': '认识 Free N8N 背后的团队',
    'team.description': '我们是 Free N8N Temples 和 Free N8N 背后的热情团队，致力于通过 AI 驱动的工作流和前沿技术革新自动化。',
    'team.linkedin': '在 LinkedIn',
    'mission.title': '我们的使命',
    'mission.statement': '在 Free N8N Temples，我们相信通过 AI 驱动的工作流实现自动化的民主化。我们的团队结合深厚的技术专长和对解决实际问题的热情，创建帮助企业和个人高效、智能地自动化其流程的解决方案。',
    'support.title': '支持项目',
    'support.description': '支持我们的工作，帮助我们保持 Free N8N 工作流目录的运行和发展！',
    'support.chooseAmount': '选择您的金额',
    'support.amountRange': '金额必须在 ¥1 到 ¥100 之间',
    'support.amountRangeError': '金额必须在 ¥1 到 ¥100 之间',
    'support.quickSelect': '快速选择',
    'support.supportButton': '支持项目 {amount}',
    'support.processing': '处理中...',
    'support.scanQRCode': '使用微信扫描二维码',
    'support.qrCodeHint': '请在30分钟内完成支付',
    'support.securePayment': '由微信支付提供安全支付',
    'support.createOrderError': '创建支付订单失败',
    'support.networkError': '网络错误，请重试',
    'support.paymentSuccess': '支付成功！感谢您的支持！',
    'support.orderExpired': '订单已过期，请创建新订单',
    'support.close': '关闭',
    'support.back': '返回',
    'support.loadingQRCode': '正在生成二维码...',
    // 提交工作流 (UGC)
    'submit.title': '提交您的工作流',
    'submit.subtitle': '我们会自动变成多语言，与世界分享您的自动化成果',
    'submit.form.title_label': '工作流标题',
    'submit.form.description_label': '描述',
    'submit.form.json_label': '工作流代码 (JSON)',
    'submit.form.json_placeholder': '请粘贴从 n8n 编辑器复制的代码...',
    'submit.form.author_name_label': '作者姓名',
    'submit.form.author_url_label': '作者网站 / 推特',
    'submit.form.author_reward_hint': '🚀 奖励：如果被收录，您的链接将展示给成千上万的用户！',
    'submit.form.submit_btn': '提交审核',
    'submit.success': '提交成功！我们将尽快审核。',
    'submit.errors.titleTooShort': '标题至少需要 5 个字符。',
    'submit.errors.nodesInvalid': '工作流 JSON 无效。',
    'submit.errors.authorUrlInvalid': '作者链接无效，请使用 http(s) 格式。',
    'submit.errors.missingFields': '请填写必填字段。',
    'submit.errors.serverError': '服务器错误，请稍后重试。',
    // Search related
    'search.button': 'AI 搜索',
    'search.noResults': '未找到匹配的工作流。',
    'search.resultsFor': '搜索结果：',
    'search.tryExamples': '尝试：',
    'search.loading': '加载中...',
    'search.suggestions': '建议',
    // Trending section
    'trending.description': '这些是本周最受欢迎的自动化工作流，帮助人们节省了 10+ 小时的时间。',
    // Share messages
    'share.copied': '链接已复制到剪贴板！',
    'share.shared': '分享成功！',
    'share.error': '分享失败，请稍后重试。',
    'nav.submit': '提交',
    'brand.name': 'Free N8N',
    'footer.description': '寻找、分享并学习 n8n 工作流的首选之地。社区驱动的模板，帮助您自动化工作。',
    'footer.declaration': 'N8Nworkflows 是 AIWord LLC 旗下的项目。为自动化社区用 ❤️ 构建。',
    'footer.product': '产品',
    'footer.resources': '资源',
    'footer.quickLinks': '快速链接',
    'footer.contact': '联系方式',
    'footer.workflows': '工作流',
    'footer.categories': '分类',
    'footer.authors': '作者',
    'footer.collections': '集合',
    'footer.opal': 'Google Opal 模版',
    'footer.leaderboard': '排行榜',
    'newsletter.title': '订阅',
    'newsletter.description': '获取最新工作流与自动化技巧',
    'newsletter.subscribe': '订阅',
    'newsletter.follow': '关注我们的公众号',
    'footer.joinGroup': '进交流群',
    'contact.scanHint': '扫码加入交流群',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.popularIntegrations': '热门 n8n 集成',
    'footer.popularIntegrationsDesc': '连接您喜爱的应用，自动化工作流程',
    // 集成页面
    'integration.directory.title': '热门 n8n 集成',
    'integration.directory.description': '浏览数百个即用型工作流组合。通过 n8n 自动化模板连接您喜爱的应用和服务。无需编码。',
    'integration.directory.integrations': '集成组合',
    'integration.directory.workflows': '工作流',
    'integration.directory.viewAll': '查看所有集成',
    'integration.directory.about': '关于 n8n 集成工作流',
    'integration.directory.aboutDesc': 'n8n 是一个强大的开源工作流自动化工具，可连接数百个应用和服务。此目录展示了我们社区创建的最受欢迎的集成组合，帮助您自动化重复性任务并简化工作流程。',
    'integration.directory.categories': '热门集成分类',
    'integration.directory.dataAnalytics': '数据与分析',
    'integration.directory.dataAnalyticsDesc': '连接数据库、电子表格和 BI 工具，实现自动报告和数据同步。',
    'integration.directory.communication': '通信',
    'integration.directory.communicationDesc': '集成 Slack、Discord、电子邮件和消息平台，实现团队通知。',
    'integration.directory.development': '开发',
    'integration.directory.developmentDesc': '连接 GitHub、GitLab、Jira 和 DevOps 工具，实现 CI/CD 自动化。',
    'integration.directory.productivity': '生产力',
    'integration.directory.productivityDesc': '在 Notion、Google Workspace、Airtable 等之间自动化任务。',
    'integration.directory.whyN8n': '为什么选择 n8n？',
    'integration.directory.openSource': '免费且开源',
    'integration.directory.openSourceDesc': '自托管和自定义，无供应商锁定',
    'integration.directory.visualEditor': '可视化工作流编辑器',
    'integration.directory.visualEditorDesc': '使用直观的拖放界面构建自动化',
    'integration.directory.manyIntegrations': '400+ 集成',
    'integration.directory.manyIntegrationsDesc': '连接到流行的应用、API 和数据库',
    'integration.directory.communityTemplates': '社区模板',
    'integration.directory.communityTemplatesDesc': '下载并自定义由数千名用户创建的工作流',
    'integration.directory.selfHosted': '自托管或云端',
    'integration.directory.selfHostedDesc': '在 n8n.cloud 和自有基础设施之间选择',
    'integration.directory.gettingStarted': '入门指南',
    'integration.directory.gettingStartedDesc': '点击上面的任何集成以查看可用的工作流。每个工作流都包含可视化预览、详细文档和可下载的 JSON 文件。将其导入到您的 n8n 实例，配置您的应用凭据，即可开始自动化！',
    'integration.detail.workflowsAvailable': '个工作流可用',
    'integration.detail.connect': '连接',
    'integration.detail.and': '和',
    'integration.detail.availableWorkflows': '可用工作流',
    'integration.detail.workflow': '个工作流',
    'integration.detail.workflows': '个工作流',
    'integration.detail.noWorkflowsTitle': '暂无工作流',
    'integration.detail.noWorkflowsDesc': '我们正在为此集成添加工作流。请稍后再来查看或',
    'integration.detail.submitYourOwn': '提交您自己的工作流',
    'integration.detail.aboutIntegration': '关于 {appA} 和 {appB} 集成',
    'integration.detail.aboutDesc': 'n8n 是一个强大的工作流自动化工具，可让您无缝连接 {appA} 和 {appB}。通过这些预构建的工作流，您可以自动化数据同步、基于事件触发操作，并在无需编写代码的情况下创建复杂的集成。',
    'integration.detail.whyUseN8n': '为什么使用 n8n 进行 {appA} + {appB} 集成？',
    'integration.detail.noCodeSolution': '无代码解决方案',
    'integration.detail.noCodeSolutionDesc': '无需技术专业知识即可直观地连接应用',
    'integration.detail.freeOpenSource': '免费且开源',
    'integration.detail.freeOpenSourceDesc': '自托管并根据您的需求进行自定义',
    'integration.detail.readyTemplates': '即用型模板',
    'integration.detail.readyTemplatesDesc': '立即下载和导入工作流',
    'integration.detail.communitySupport': '社区支持',
    'integration.detail.communitySupportDesc': '数千名用户分享工作流和技巧',
    'integration.detail.gettingStartedTitle': '入门指南',
    'integration.detail.gettingStartedDesc': '浏览上面的工作流，点击任何工作流查看其详细信息，然后下载 JSON 文件。将其导入到您的 n8n 实例，为 {appA} 和 {appB} 配置凭据，即可开始自动化！每个工作流都包含详细的文档和设置说明。',
    // 隐私与条款
    'privacy.title': '隐私政策',
    'terms.title': '服务条款',
    'privacy.p1': '我们重视您的隐私。本政策说明在您使用 Free N8N 时我们如何收集、使用和保护您的信息。',
    'privacy.p2': '我们会收集您直接提供的信息（例如提交的工作流、联系方式）以及技术数据（例如日志、使用情况）以改进服务。',
    'privacy.p3': '我们不会出售您的个人数据。我们可能会与合作方共享汇总或匿名化的数据。',
    'privacy.content': `更新日期：2025-01-01

本隐私政策说明 Free N8N（“我们”）如何在您使用网站和服务时收集、使用、共享和保护您的信息。

1. 我们收集的信息
- 您直接提供的信息：联系方式、提交的工作流、支持请求等。
- 使用信息：访问页面、搜索词、下载记录、时间戳等。
- 技术信息：IP、浏览器/设备信息、Cookie 等。

2. 信息使用方式
- 提供和改进服务（渲染页面、生成预览、处理提交）。
- 分析使用情况以提升功能、检测欺诈、理解流量来源。
- 将就您的提交或支持请求与您沟通。

3. 共享与披露
我们不会出售个人数据。可能在以下情况下共享：
- 向为我们提供服务的第三方（托管、分析、支付处理等）披露。
- 共享汇总或匿名化的数据用于研究或产品改进。
在法律要求或为保护我们的权利与安全时，我们也可能披露数据。

4. Cookie 与跟踪
我们使用 Cookie 与类似技术（包括 Google Analytics）收集使用和性能数据。您可以通过浏览器管理 Cookie 偏好。

5. 数据保留与删除
我们在为提供服务和遵守法律义务所需的期限内保留个人数据。您可联系删除或导出您的数据。

6. 国际传输
数据可能在境外处理或存储，我们会采取必要的保护措施。

7. 您的权利
根据地区，您可能拥有访问、更正、删除或导出个人数据的权利。请联系我们行使这些权利。

联系方式：${process.env.NEXT_PUBLIC_PRIVACY_EMAIL || 'privacy@n8nworkflows.world'}`,
    'terms.content': `生效日期：2025-01-01

欢迎使用 Free N8N。以下“服务条款”约束您对本网站及服务的使用。使用本服务即表示您同意这些条款。

1. 服务使用
您仅可将本服务用于合法用途，不得侵犯他人权利、散布恶意代码或从事违法活动。

2. 提交内容
用户可提交工作流与相关内容。您保留提交内容的所有权利，但同时授予 Free N8N 非独占、全球、免版税的许可，以在本服务上展示与分发您的提交。
您声明拥有提交权利且提交不侵害第三方权利。

3. 内容审核与移除
我们有权审核、拒绝或移除任何违反条款或政策的内容。

4. 免责声明与责任限制
本服务按“现状”提供，在法律允许范围内我们不承担明示或暗示的保证。对因使用本服务导致的间接或结果性损害不承担责任。

5. 赔偿
若因您违反条款或提交的内容导致第三方索赔，您同意赔偿 Free N8N 的损失。

6. 条款变更
我们可能不时更新条款，更新后会在页面公布生效日期。

联系方式：${process.env.NEXT_PUBLIC_LEGAL_EMAIL || 'legal@n8nworkflows.world'}`,
    // 分类页
    'categories.title': '浏览工作流分类',
    'categories.subtitle': '按业务功能和使用场景组织的工作流。为您的特定需求寻找自动化解决方案。',
    'categories.cardDescription': '点击查看该分类下的工作流。',
    'categories.workflows': '个工作流',
    'collections.title': '工作流集合',
    'collections.subtitle': '为特定业务场景和使用案例精心策划的自动化工作流集合。',
    'collections.cardDescription': '点击探索该集合中的工作流。',
    'collections.workflows': '个工作流',
    'collections.featured': '精选集合',
    // Collection page specific (中文)
    'collection.download.prepare': '准备并下载 ZIP',
    'collection.download.ready': '下载 ZIP',
    'collection.relatedCollections': '相关合集',
    'breadcrumb.home': '首页',
    'breadcrumb.collections': '集合',
    'collection.unlockTitle': '解锁完整合集下载',
    'collection.unlockButton': '解锁并下载',
    // 作者页（中文）
    'authors.title': '社区贡献者',
    'authors.subtitle': '认识构建并策划我们工作流库的专家们。',
    'authors.joined': '加入时间',
    'authors.role': '角色',
    'authors.workflows': '创建的工作流数',
    'authors.handle': '账号',
    // 排行榜页面
    'leaderboard.title': '名人堂',
    'leaderboard.subtitle': '发现最受欢迎的自动化工作流',
    // 货币化 - 托管侧边栏
    'monetization.sidebar.title': '推荐托管服务',
    'monetization.sidebar.zeabur.title': 'Zeabur',
    'monetization.sidebar.zeabur.desc': '一键部署 n8n，几秒钟即可完成',
    'monetization.sidebar.do.title': 'DigitalOcean',
    'monetization.sidebar.do.desc': '可靠的 n8n 云托管服务',
    // 货币化 - 部署选项
    'monetization.detail.title': '准备部署此工作流？',
    'monetization.detail.do_btn': '在 DigitalOcean 获取 $200 额度',
    'nav.tools': '高级模版试用',
    // Tools & Workflows
    'tools.title': '高级模版试用',
    'tools.subtitle': '免费体验专业版 AI 工作流。单模版仅需 $4.9 即可解锁完整生产授权。',
    'tools.tryNow': '免费试用',
    'tools.back': '返回工具集',
    'tools.buyTemplate': '购买此模版 ($4.9)',
    'seo.analyzing': 'AI 正在分析页面 SEO...',
    'seo.analyzing.description': '这可能需要 10-20 秒，请稍候',
    'seo.error.enter.url': '请输入 URL',
    'seo.error.invalid.url': '请输入有效的 URL（例如：https://example.com）',
    'seo.error.audit.failed': '审计失败，请稍后重试',
    'seo.audit.title': 'AI SEO 搜索引擎视角审计',
    'seo.audit.description': '模拟搜索引擎爬虫抓取页面，AI 分析 SEO 可读性',
    'seo.url.placeholder': '输入要审计的网址，例如：https://example.com',
    'seo.auditing': '审计中...',
    'seo.start.audit': '开始审计',
    'seo.score.title': 'SEO 评分',
    'seo.score.max': '满分 10.0',
    'seo.summary.title': '分析摘要',
    'seo.recommendations.title': '优化建议',
    'seo.recommendations.empty': '暂无建议',
    'seo.technical.details.title': '技术细节',
    'seo.technical.h1': 'H1 标签',
    'seo.technical.meta': 'Meta 标签',
     'seo.technical.structured': '结构化数据',
     'seo.technical.content.too.short': '内容过少 ({count} 字符) - AI 无法理解',
     'seo.technical.content.length': '内容长度: {count} 字符',
     'seo.technical.view.robots': '查看 robots.txt',
    'b2b.leads.title': 'B2B 商家邮箱挖掘',
    'b2b.leads.description': '输入行业关键词与目标区域，自动发现商家并挖掘高价值邮箱',
    'b2b.leads.keyword': '行业关键词',
    'b2b.leads.city': '目标城市',
    'b2b.leads.start': '开始挖掘',
    'b2b.leads.mining': '正在挖掘...',
    'b2b.leads.results': '挖掘结果 ({count} 条)',
    'b2b.leads.company': '公司',
    'b2b.leads.contact': '联系方式',
    'b2b.leads.score': '质量得分',
    'reddit.opportunity.title': '市场空白挖掘机',
    'reddit.opportunity.subtitle': '我们的 AI 扫描数千个社区讨论，识别经过验证的痛点并制定高潜力的市场进入策略。',
    'reddit.opportunity.button.start': '启动挖掘协议',
    'reddit.opportunity.start': '开始挖掘',
    'reddit.opportunity.mining': '正在挖掘...',
    'reddit.opportunity.results': '挖掘结果',
    'reddit.opportunity.pain.point': '痛点',
    'reddit.opportunity.idea': '商业创意',
    'reddit.article.generator.title': 'Reddit 爆款引擎',
    'reddit.article.generator.description': '在左侧选择热门帖子，AI 将自动将其转化为高互动率的长篇文章。',
    'reddit.article.generator.source': '热点源',
    'reddit.article.generator.select': '选择洞察',
    'reddit.article.generator.style': '风格基因',
    'reddit.article.generator.empty': '搜索并点击帖子开始生成',
    'reddit.article.generator.label': '爆款 AI 帖子',
    'reddit.article.generator.summary': '执行摘要',
    'reddit.article.generator.engine': 'n8n 神经引擎',
    'reddit.article.generator.publish': '发布工作流',
    'reddit.article.generator.studio': '创意工作室',
    'reddit.article.generator.studio.desc': 'AI 将把趋势数据转化为长篇数字资产。',
    'reddit.article.generator.generating': '正在分析社区情绪和语言趋势...',
    // Article Illustrator
    'article.illustrator.title': '文章配图生成',
    'article.illustrator.description': '输入文章内容，AI 自动生成分镜脚本与插图',
    'article.illustrator.input': '文章内容',
    'article.illustrator.generating': '生成中...',
    'article.illustrator.generate': '生成插图',
    'article.illustrator.scenes': '分镜场景',
    // Magic Inpainting
    'magic.inpainting.title': '智能图像修复',
    'magic.inpainting.description': '涂抹消除或替换图片中的任意物体，自动填充背景',
    // Product Photo
    'product.photo.title': '商品图生成',
    'product.photo.description': '上传商品主图，AI 自动生成高转化电商场景图',
    // Product Hunt
    'product.hunt.title': 'Product Hunt 日报',
    'product.hunt.description': '一键获取今日全球最火科技产品榜单',
    // Brand Sentiment
    'brand.sentiment.title': '品牌舆情分析',
    'brand.sentiment.description': '实时监控 Reddit 上的品牌讨论与情感倾向',
    // Invoice Extractor
    'invoice.extractor.title': '智能发票识别',
    'invoice.extractor.description': '自动提取 PDF/图片发票中的关键信息',
    // Reddit Article
    'reddit.article.title': 'Reddit 热点文章',
    'reddit.article.description': '基于 Reddit 热门话题一键生成营销文章',
    // Reddit Hotspot
    'reddit.hotspot.title': 'Reddit 热点监控',
    'reddit.hotspot.description': '实时追踪指定板块的热门帖子',
    // Company Research
    'company.research.title': '公司背调',
    'company.research.description': '快速获取目标公司的市场定位与竞争情报',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // 从 localStorage 读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'zh') {
      // set asynchronously to avoid synchronous state update within effect
      setTimeout(() => setLanguageState(savedLanguage), 0);
    }
  }, []);

  // 保存语言设置到 localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // 翻译函数
  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || key;
    // 简单的参数替换
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

