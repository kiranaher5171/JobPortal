# Postman Guide - Adding Dummy Job Data

This guide explains how to use Postman to add dummy job data to your job portal database.

## API Endpoint

**POST** `http://localhost:3000/api/jobs`

> **Note:** Replace `localhost:3000` with your actual server URL if different.

## Request Setup in Postman

1. **Method:** Select `POST`
2. **URL:** `http://localhost:3000/api/jobs`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body:** Select `raw` and `JSON` format

## Required Fields

- `jobRole` (required) - The job title/role

## Optional Fields

- `companyName` - Company name
- `designation` - Job designation
- `teamName` - Team/Department name (used for category filter)
- `jobType` - Type of job (Full Time, Part Time, Freelance, etc.)
- `location` - Job location (Mumbai, Nashik, Gandhinagar, USA: New York, United Kingdom: London)
- `experience` - Experience level (No-experience, Fresher, Intermediate, Expert, Entry Level, Mid Level, Senior Level)
- `salary` - Salary range (e.g., "₹3-5 Lakhs", "₹5-8 Lakhs")
- `skills` - Array of skills or comma-separated string
- `keyResponsibilities` - Job responsibilities
- `minimumQualifications` - Required qualifications
- `benefits` - Job benefits
- `jobDescription` - Full job description

## Field Formatting

**Important:** The following fields support markdown formatting and bullet points:
- `keyResponsibilities` - Use bullet points (markdown format)
- `minimumQualifications` - Use bullet points (markdown format)
- `benefits` - Use bullet points (markdown format)
- `jobDescription` - Full description (supports markdown)

### Bullet Point Format

Use markdown format for bullet points:
```
- First point
- Second point
- Third point
```

Or use numbered lists:
```
1. First point
2. Second point
3. Third point
```

## Example JSON Payloads

### Example 1: Senior Software Developer

```json
{
  "jobRole": "Senior Software Developer",
  "companyName": "Tech Solutions Inc",
  "designation": "Senior Developer",
  "teamName": "Technology",
  "jobType": "Full Time",
  "location": "Mumbai",
  "experience": "Senior Level",
  "salary": "₹8-12 Lakhs",
  "skills": ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "Express.js", "REST APIs"],
  "keyResponsibilities": "- Design and develop scalable web applications using React and Node.js\n- Collaborate with cross-functional teams including designers, product managers, and other developers\n- Write clean, maintainable, and efficient code following best practices\n- Conduct code reviews and mentor junior developers\n- Troubleshoot and debug applications to optimize performance\n- Participate in agile development processes and sprint planning\n- Implement security best practices and data protection measures",
  "minimumQualifications": "- Bachelor's degree in Computer Science, Engineering, or related field\n- 5+ years of professional software development experience\n- Strong proficiency in React, Node.js, and JavaScript/TypeScript\n- Experience with MongoDB or similar NoSQL databases\n- Solid understanding of RESTful API design and development\n- Experience with version control systems (Git)\n- Strong problem-solving and analytical skills",
  "benefits": "- Competitive salary package (₹8-12 Lakhs per annum)\n- Comprehensive health insurance for employee and family\n- Flexible working hours and remote work options\n- Annual performance bonus and profit sharing\n- Professional development budget for courses and certifications\n- 20 days paid leave plus public holidays\n- Stock options and equity participation\n- Modern office with recreational facilities",
  "jobDescription": "We are seeking an experienced Senior Software Developer to join our dynamic technology team. In this role, you will be responsible for designing, developing, and maintaining high-quality web applications that serve thousands of users daily. You'll work on cutting-edge projects using modern technologies like React, Node.js, and MongoDB. This is an excellent opportunity to work in a collaborative environment where your ideas matter and you can make a real impact on our products. You'll have the chance to mentor junior developers, participate in technical decision-making, and grow your career with a fast-growing company."
}
```

### Example 2: Marketing Manager

```json
{
  "jobRole": "Marketing Manager",
  "companyName": "Digital Marketing Pro",
  "designation": "Manager",
  "teamName": "Commerce",
  "jobType": "Full Time",
  "location": "Nashik",
  "experience": "Mid Level",
  "salary": "₹5-8 Lakhs",
  "skills": ["Digital Marketing", "SEO", "Social Media", "Content Strategy", "Analytics", "Google Ads", "Facebook Ads"],
  "keyResponsibilities": "- Develop and execute comprehensive marketing strategies to drive brand awareness and lead generation\n- Manage multi-channel marketing campaigns across digital platforms including SEO, SEM, and social media\n- Analyze market trends, competitor activities, and customer behavior to identify opportunities\n- Oversee content creation and distribution across various marketing channels\n- Collaborate with sales team to align marketing efforts with business objectives\n- Monitor and report on marketing KPIs, ROI, and campaign performance metrics\n- Manage marketing budget and allocate resources effectively",
  "minimumQualifications": "- Bachelor's degree in Marketing, Business Administration, or related field\n- 3-5 years of experience in digital marketing and campaign management\n- Strong analytical skills with experience in Google Analytics and marketing automation tools\n- Proven track record of successful marketing campaigns\n- Excellent communication and presentation skills\n- Knowledge of SEO, SEM, social media marketing, and email marketing\n- Experience with marketing tools like HubSpot, Mailchimp, or similar",
  "benefits": "- Competitive salary package (₹5-8 Lakhs per annum)\n- Health insurance coverage for employee and dependents\n- Performance-based bonus and incentives\n- Professional development opportunities and training programs\n- Flexible working hours and work-from-home options\n- 18 days paid leave plus public holidays\n- Company laptop and necessary tools\n- Team building activities and events",
  "jobDescription": "We are looking for a dynamic Marketing Manager to lead our marketing initiatives and drive brand growth. In this role, you will be responsible for developing and executing marketing strategies that align with our business goals. You'll work closely with cross-functional teams to create compelling campaigns, manage our digital presence, and analyze performance metrics to optimize results. This is an excellent opportunity for a creative and data-driven marketer who wants to make a significant impact in a growing company."
}
```

### Example 3: Data Analyst

```json
{
  "jobRole": "Data Analyst",
  "companyName": "Analytics Corp",
  "designation": "Analyst",
  "teamName": "Technology",
  "jobType": "Full Time",
  "location": "Gandhinagar",
  "experience": "Entry Level",
  "salary": "₹3-5 Lakhs",
  "skills": ["Python", "SQL", "Excel", "Data Visualization", "Statistics"],
  "keyResponsibilities": "Analyze data sets, Create reports and dashboards, Identify trends and patterns",
  "minimumQualifications": "Bachelor's degree in Statistics or related field, Knowledge of Python and SQL",
  "benefits": "Health Insurance, Learning Opportunities, Flexible Schedule",
  "jobDescription": "We are seeking a Data Analyst to help us make data-driven decisions and improve business performance."
}
```

### Example 4: Frontend Developer (USA)

```json
{
  "jobRole": "Frontend Developer",
  "companyName": "Global Tech Solutions",
  "designation": "Developer",
  "teamName": "Technology",
  "jobType": "Contract",
  "location": "USA: New York",
  "experience": "Intermediate",
  "salary": "₹10-15 Lakhs",
  "skills": ["React", "Vue.js", "CSS", "HTML", "JavaScript"],
  "keyResponsibilities": "Build responsive web interfaces, Optimize application performance, Collaborate with UI/UX designers",
  "minimumQualifications": "2+ years of frontend development experience, Strong React skills",
  "benefits": "Remote Work, Flexible Hours, Competitive Pay",
  "jobDescription": "Join our remote team as a Frontend Developer working on cutting-edge web applications."
}
```

### Example 5: HR Manager

```json
{
  "jobRole": "HR Manager",
  "companyName": "People First Corp",
  "designation": "Manager",
  "teamName": "Education",
  "jobType": "Full Time",
  "location": "Mumbai",
  "experience": "Mid Level",
  "salary": "₹6-9 Lakhs",
  "skills": ["Recruitment", "Employee Relations", "HR Policies", "Talent Management"],
  "keyResponsibilities": "Manage recruitment process, Handle employee relations, Develop HR policies",
  "minimumQualifications": "Bachelor's degree in HR, 4+ years of HR experience",
  "benefits": "Health Insurance, Paid Time Off, Professional Development",
  "jobDescription": "We are looking for an experienced HR Manager to oversee our human resources operations."
}
```

### Example 6: Part-Time Content Writer

```json
{
  "jobRole": "Content Writer",
  "companyName": "Content Studio",
  "designation": "Writer",
  "teamName": "Commerce",
  "jobType": "Part Time",
  "location": "Nashik",
  "experience": "Fresher",
  "salary": "₹2-4 Lakhs",
  "skills": ["Content Writing", "SEO", "Blogging", "Copywriting"],
  "keyResponsibilities": "Write engaging content, Research topics, Edit and proofread content",
  "minimumQualifications": "Excellent writing skills, Basic SEO knowledge",
  "benefits": "Flexible Schedule, Remote Work",
  "jobDescription": "Join our content team as a Part-Time Content Writer. Perfect for freelancers and students."
}
```

### Example 7: Freelance Designer

```json
{
  "jobRole": "UI/UX Designer",
  "companyName": "Design Studio",
  "designation": "Designer",
  "teamName": "Technology",
  "jobType": "Freelance",
  "location": "Gandhinagar",
  "experience": "Intermediate",
  "salary": "₹4-7 Lakhs",
  "skills": ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"],
  "keyResponsibilities": "Design user interfaces, Create wireframes and prototypes, Conduct user research",
  "minimumQualifications": "Portfolio of design work, 2+ years of design experience",
  "benefits": "Flexible Projects, Remote Work",
  "jobDescription": "We are looking for a talented UI/UX Designer to work on various design projects."
}
```

### Example 8: Internship Position

```json
{
  "jobRole": "Software Development Intern",
  "companyName": "Tech Startup",
  "designation": "Intern",
  "teamName": "Technology",
  "jobType": "Internship",
  "location": "Mumbai",
  "experience": "No-experience",
  "salary": "₹1-2 Lakhs",
  "skills": ["JavaScript", "HTML", "CSS", "React Basics"],
  "keyResponsibilities": "Assist in development tasks, Learn from senior developers, Contribute to projects",
  "minimumQualifications": "Currently pursuing Computer Science degree, Basic programming knowledge",
  "benefits": "Learning Opportunities, Certificate, Potential Full-Time Offer",
  "jobDescription": "Great opportunity for students to gain real-world experience in software development."
}
```

### Example 9: UK Based Job

```json
{
  "jobRole": "Business Analyst",
  "companyName": "International Business Ltd",
  "designation": "Analyst",
  "teamName": "Financial Services",
  "jobType": "Full Time",
  "location": "United Kingdom: London",
  "experience": "Expert",
  "salary": "₹15-20 Lakhs",
  "skills": ["Business Analysis", "Data Analysis", "Project Management", "SQL"],
  "keyResponsibilities": "Analyze business processes, Create requirements documents, Work with stakeholders",
  "minimumQualifications": "MBA or related degree, 7+ years of experience",
  "benefits": "Health Insurance, Relocation Assistance, Competitive Salary",
  "jobDescription": "Join our London office as a Business Analyst working on international projects."
}
```

### Example 10: Healthcare Position

```json
{
  "jobRole": "Registered Nurse",
  "companyName": "City Hospital",
  "designation": "Nurse",
  "teamName": "Healthcare",
  "jobType": "Full Time",
  "location": "Mumbai",
  "experience": "Mid Level",
  "salary": "₹4-6 Lakhs",
  "skills": ["Patient Care", "Medical Knowledge", "Communication", "Emergency Care"],
  "keyResponsibilities": "Provide patient care, Administer medications, Maintain patient records",
  "minimumQualifications": "Nursing degree, Valid nursing license, 2+ years of experience",
  "benefits": "Health Insurance, Shift Allowances, Professional Development",
  "jobDescription": "We are seeking a dedicated Registered Nurse to join our healthcare team."
}
```

## Quick Tips

1. **Skills Field:** You can provide skills as:
   - Array: `["React", "Node.js", "MongoDB"]`
   - Comma-separated string: `"React, Node.js, MongoDB"`

2. **Location Values:** Use these exact values for filter compatibility:
   - `Mumbai`
   - `Nashik`
   - `Gandhinagar`
   - `USA: New York`
   - `United Kingdom: London`

3. **Job Type Values:** Use these for filter compatibility:
   - `Full Time`
   - `Part Time`
   - `Freelance`
   - `Seasonal`
   - `Fixed-Price`
   - `Contract`
   - `Internship`

4. **Experience Levels:** Use these for filter compatibility:
   - `No-experience`
   - `Fresher`
   - `Intermediate`
   - `Expert`
   - `Entry Level`
   - `Mid Level`
   - `Senior Level`

5. **Team Name (Category):** Use these for filter compatibility:
   - `Commerce`
   - `Telecommunications`
   - `Hotels & Tourism`
   - `Education`
   - `Financial Services`
   - `Technology`
   - `Healthcare`
   - `Manufacturing`
   - `Retail`
   - `Real Estate`

## Testing in Postman

1. Open Postman
2. Create a new request
3. Set method to `POST`
4. Enter URL: `http://localhost:3000/api/jobs`
5. Go to Headers tab and add:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to Body tab:
   - Select `raw`
   - Select `JSON` from dropdown
   - Paste one of the example JSON payloads above
7. Click `Send`
8. You should receive a response with `success: true` and the created job data

## Expected Response

```json
{
  "success": true,
  "data": {
    "_id": "generated_id",
    "jobId": "unique_job_id",
    "jobRole": "Senior Software Developer",
    "companyName": "Tech Solutions Inc",
    "slug": "senior-software-developer-tech-solutions-inc-abc123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    // ... other fields
  }
}
```

## Bulk Import Script

If you want to add multiple jobs at once, you can use Postman's Collection Runner or create a simple script. Here's a Node.js example:

```javascript
const jobs = [
  // Paste all your job objects here
];

async function addJobs() {
  for (const job of jobs) {
    const response = await fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    const result = await response.json();
    console.log(`Added: ${job.jobRole} - ${result.success ? 'Success' : 'Failed'}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
  }
}

addJobs();
```

## Troubleshooting

- **404 Error:** Make sure your Next.js dev server is running (`npm run dev`)
- **500 Error:** Check your MongoDB connection string in `.env.local`
- **400 Error:** Verify that `jobRole` field is included in your JSON
- **Connection Error:** Ensure MongoDB is running and accessible

