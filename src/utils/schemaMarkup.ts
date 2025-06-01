/**
 * Schema.org structured data generator for SEO
 * https://schema.org/
 */

interface SocialProfile {
  name: string;
  url: string;
}

/**
 * Generates Organization schema markup
 */
export const generateOrganizationSchema = (
  name: string = 'Z Social',
  url: string = 'https://yourdomain.com',
  logo: string = 'https://yourdomain.com/logo192.png',
  socialProfiles: SocialProfile[] = []
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: socialProfiles.map(profile => profile.url)
  };
};

/**
 * Generates WebSite schema markup
 */
export const generateWebsiteSchema = (
  name: string = 'Z Social',
  url: string = 'https://yourdomain.com',
  description: string = 'Connect with friends, share your thoughts, and stay updated with the latest trends and conversations around the world.'
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      'target': `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * Generates Person schema markup for user profiles
 */
export const generatePersonSchema = (
  name: string,
  username: string,
  description: string = '',
  image: string = 'https://yourdomain.com/default-avatar.svg'
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    alternateName: `@${username}`,
    description,
    image,
    url: `https://yourdomain.com/profile/${username}`
  };
};

/**
 * Generates SocialMediaPosting schema markup for tweets
 */
export const generateTweetSchema = (
  content: string,
  datePublished: string,
  authorName: string,
  authorUsername: string,
  tweetId: string,
  images: string[] = []
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    datePublished,
    text: content,
    sharedContent: {
      '@type': 'WebPage',
      url: `https://yourdomain.com/tweet/${tweetId}`
    },
    author: {
      '@type': 'Person',
      name: authorName,
      alternateName: `@${authorUsername}`,
      url: `https://yourdomain.com/profile/${authorUsername}`
    },
    ...(images.length > 0 && {
      image: images
    })
  };
};

/**
 * Injects schema.org JSON-LD into document head
 */
export const injectSchema = (schema: Record<string, any>) => {
  // Only run on client side
  if (typeof document === 'undefined') return;
  
  // Remove any existing schema
  const existingSchema = document.getElementById('schema-org-markup');
  if (existingSchema) {
    existingSchema.remove();
  }
  
  // Create and inject new schema
  const script = document.createElement('script');
  script.id = 'schema-org-markup';
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(schema);
  document.head.appendChild(script);
};
