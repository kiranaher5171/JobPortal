/**
 * Generate a URL-friendly slug from text
 * @param {string} text - The text to convert to slug
 * @returns {string} - The generated slug
 */
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

/**
 * Generate a unique slug for a job
 * @param {string} jobRole - The job role
 * @param {string} companyName - The company name
 * @param {string} jobId - Optional job ID for uniqueness
 * @returns {string} - The generated slug
 */
export function generateJobSlug(jobRole, companyName, jobId = '') {
  const roleSlug = generateSlug(jobRole);
  const companySlug = generateSlug(companyName);
  const idSuffix = jobId ? `-${jobId.slice(-6)}` : '';
  return `${roleSlug}-${companySlug}${idSuffix}`;
}

