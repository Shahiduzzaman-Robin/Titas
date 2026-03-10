const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const BlogPost = require('./models/BlogPost');
const BlogCategory = require('./models/BlogCategory');
const BlogTag = require('./models/BlogTag');

dotenv.config({ path: path.join(__dirname, '.env') });

const slugify = (value = '') =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const estimateReadingTime = (content = '') => {
    const plain = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plain.split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
};

const DEMO_CATEGORIES = [
    { name: 'Announcements', description: 'Latest updates and notices.' },
    { name: 'Events', description: 'Stories and highlights from programs.' },
    { name: 'Alumni Stories', description: 'Journeys and lessons from alumni.' },
    { name: 'Career & Opportunities', description: 'Internships, jobs, and growth pathways.' },
    { name: 'Student Life', description: 'Campus experiences and journeys.' },
    { name: 'Articles', description: 'Long-form insights and ideas.' },
];

const DEMO_TAGS = [
    'Community',
    'Campus',
    'Career',
    'Alumni',
    'Scholarship',
    'Workshop',
    'Inspiration',
    'Bangla',
    'Technology',
    'Success Story',
    'Leadership',
    'Volunteer',
    'Placement',
];

const DEMO_POSTS = [
    {
        title: 'Welcome to the New Titas Blog',
        author: 'Titas Editorial Team',
        category: 'Announcements',
        tags: ['Community', 'Campus'],
        excerpt: 'We are launching a fresh blog experience to share updates, stories, and opportunities from the Titas community.',
        content: `
            <h2>Why this blog?</h2>
            <p>Our community has grown quickly, and we needed one place where students, mentors, and alumni can stay connected.</p>
            <p>This blog will highlight key announcements, practical resources, and inspiring stories from around the campus.</p>
            <h3>What you can expect</h3>
            <ul>
                <li>Official notices and schedule changes</li>
                <li>Event recaps with photos</li>
                <li>Career and scholarship opportunities</li>
                <li>Student and alumni success stories</li>
            </ul>
            <p>Thank you for being part of this journey. We are just getting started.</p>
        `,
    },
    {
        title: 'Career Workshop Recap: Building a Strong CV',
        author: 'Career Cell',
        category: 'Events',
        tags: ['Career', 'Workshop'],
        excerpt: 'A quick recap of our recent CV workshop with practical advice that helped students build clearer and stronger profiles.',
        content: `
            <h2>Workshop highlights</h2>
            <p>Last week, the Career Cell hosted a hands-on CV workshop where students revised their resumes live with mentor feedback.</p>
            <p>The main focus was to write impact statements with numbers and outcomes rather than generic responsibilities.</p>
            <h3>Top takeaways</h3>
            <ul>
                <li>Use concise bullet points with measurable achievements</li>
                <li>Tailor your CV for each role or internship</li>
                <li>Keep formatting clean and easy to scan</li>
            </ul>
            <p>A follow-up mock interview session is planned for next month.</p>
        `,
    },
    {
        title: 'Student Spotlight: From First Semester to Internship',
        author: 'Campus Media Desk',
        category: 'Student Life',
        tags: ['Inspiration', 'Career'],
        excerpt: 'Meet a student who turned classroom projects into a real internship opportunity in less than one year.',
        content: `
            <h2>A growth story</h2>
            <p>When Rafi joined the first semester, he had little practical experience and was unsure how to start building a portfolio.</p>
            <p>By consistently sharing project updates, attending mentoring sessions, and improving communication, he earned an internship offer.</p>
            <h3>Advice for juniors</h3>
            <ol>
                <li>Start small but ship work regularly</li>
                <li>Ask for feedback early</li>
                <li>Document your progress publicly</li>
            </ol>
            <p>His story reminds us that steady effort creates real momentum.</p>
        `,
    },
    {
        title: 'Alumni Story: Turning Learning into Leadership',
        author: 'Alumni Network',
        category: 'Articles',
        tags: ['Alumni', 'Inspiration'],
        excerpt: 'An alumni perspective on how foundational skills at Titas helped shape leadership in a fast-moving workplace.',
        content: `
            <h2>Beyond technical skills</h2>
            <p>Technical depth opens doors, but communication and teamwork are what sustain long-term growth.</p>
            <p>In this interview, an alum shares how project collaboration at Titas prepared him to lead cross-functional teams.</p>
            <h3>Leadership habits that helped</h3>
            <ul>
                <li>Write down decisions and assumptions</li>
                <li>Listen first, then propose solutions</li>
                <li>Coach peers with patience and clarity</li>
            </ul>
            <p>These habits are practical, learnable, and useful at every stage of a career.</p>
        `,
    },
    {
        title: 'Scholarship Opportunities You Should Not Miss',
        author: 'Academic Office',
        category: 'Announcements',
        tags: ['Scholarship', 'Career'],
        excerpt: 'A curated list of current scholarship opportunities and a checklist to prepare a stronger application.',
        content: `
            <h2>Open opportunities</h2>
            <p>Several scholarship windows are now open for local and international programs across technology and business domains.</p>
            <p>Students are encouraged to start documentation early to avoid last-minute delays.</p>
            <h3>Application checklist</h3>
            <ul>
                <li>Updated transcript and recommendation letters</li>
                <li>Statement of purpose tailored to the program</li>
                <li>Portfolio or project links with clear outcomes</li>
            </ul>
            <p>If you need guidance, book a consultation with the Academic Office this week.</p>
        `,
    },
    {
        title: 'Inside the Community: What Makes Titas Special',
        author: 'Editorial Team',
        category: 'Student Life',
        tags: ['Community', 'Campus'],
        excerpt: 'A closer look at the people, culture, and support system that make the Titas learning environment unique.',
        content: `
            <h2>Culture of support</h2>
            <p>At Titas, learning happens through collaboration. Seniors mentor juniors, peers review each other's work, and faculty remain approachable.</p>
            <p>This culture helps students stay motivated and resilient while balancing studies and personal responsibilities.</p>
            <h3>Why students stay engaged</h3>
            <ul>
                <li>Regular events and peer-learning sessions</li>
                <li>Access to mentors and alumni insights</li>
                <li>A strong sense of belonging</li>
            </ul>
            <p>Community is not a slogan here. It is part of the everyday learning experience.</p>
        `,
    },
    {
        title: 'Orientation Day Recap - নতুনদের জন্য প্রথম দিন',
        author: 'Campus Affairs',
        category: 'Events',
        tags: ['Campus', 'Bangla', 'Community'],
        excerpt: 'A warm welcome event where seniors guided new students with practical tips for their first semester.',
        content: `
            <h2>First day energy</h2>
            <p>Our orientation day was full of excitement. নতুন শিক্ষার্থীরা ক্যাম্পাস ঘুরে দেখেছে এবং বিভাগভিত্তিক সেশন করেছে।</p>
            <p>Seniors shared simple advice on attendance, assignments, and team projects.</p>
            <h3>Key notes</h3>
            <ul>
                <li>Keep a weekly study plan from day one</li>
                <li>Join at least one student club</li>
                <li>Use office hours for difficult topics</li>
            </ul>
        `,
    },
    {
        title: 'Campus Volunteer Drive - সবার অংশগ্রহণে সফল আয়োজন',
        author: 'Student Welfare Desk',
        category: 'Student Life',
        tags: ['Volunteer', 'Community', 'Bangla'],
        excerpt: 'Students and mentors joined a volunteer drive to support local community initiatives near campus.',
        content: `
            <h2>Community in action</h2>
            <p>We organized a weekend volunteer drive with over 120 participants. সবাই মিলে পরিচ্ছন্নতা, বই বিতরণ ও সচেতনতা কার্যক্রমে অংশ নেয়।</p>
            <p>The event showed how small actions can create visible impact when done together.</p>
            <h3>What we learned</h3>
            <ul>
                <li>Planning teams early makes execution smoother</li>
                <li>Clear communication increases participation</li>
                <li>Follow-up is essential for long-term impact</li>
            </ul>
        `,
    },
    {
        title: 'Alumni Talk: Global Remote Jobs and Skill Roadmap',
        author: 'Alumni Network',
        category: 'Alumni Stories',
        tags: ['Alumni', 'Career', 'Technology'],
        excerpt: 'An interactive session where alumni explained how to prepare for remote roles in international teams.',
        content: `
            <h2>Roadmap to remote work</h2>
            <p>Alumni speakers discussed practical steps for international remote jobs, including communication standards and async collaboration.</p>
            <p>তারা বলেছে, technical skill এর পাশাপাশি professional writing skill অনেক গুরুত্বপূর্ণ।</p>
            <h3>Recommended path</h3>
            <ol>
                <li>Build two strong portfolio projects</li>
                <li>Practice written updates and documentation</li>
                <li>Learn time-zone friendly workflow habits</li>
            </ol>
        `,
    },
    {
        title: 'Internship Bootcamp - CV থেকে Interview পর্যন্ত',
        author: 'Career Cell',
        category: 'Career & Opportunities',
        tags: ['Career', 'Placement', 'Workshop', 'Bangla'],
        excerpt: 'A focused bootcamp that covered resume improvement, portfolio presentation, and interview practice.',
        content: `
            <h2>From preparation to confidence</h2>
            <p>The bootcamp ran for three days with live review sessions. শিক্ষার্থীরা তাদের CV, LinkedIn, এবং portfolio feedback পেয়েছে।</p>
            <p>Mock interviews helped participants identify communication gaps and improve confidence.</p>
            <h3>Bootcamp outcomes</h3>
            <ul>
                <li>Most participants improved resume clarity</li>
                <li>Students practiced STAR-based interview answers</li>
                <li>Peer reviews improved project storytelling</li>
            </ul>
        `,
    },
    {
        title: 'Scholarship Diary: SOP লেখার বাস্তব টিপস',
        author: 'Academic Office',
        category: 'Career & Opportunities',
        tags: ['Scholarship', 'Bangla', 'Career'],
        excerpt: 'A practical guide on writing a strong Statement of Purpose with clear structure and personal impact.',
        content: `
            <h2>Write with clarity</h2>
            <p>Many students struggle to start an SOP. মূল কথা হলো নিজের লক্ষ্য, প্রস্তুতি এবং ভবিষ্যৎ পরিকল্পনা পরিষ্কারভাবে বলা।</p>
            <p>Avoid generic claims and use specific examples from your projects and responsibilities.</p>
            <h3>Simple SOP structure</h3>
            <ul>
                <li>Motivation and background</li>
                <li>Academic and project highlights</li>
                <li>Future goals and program fit</li>
            </ul>
        `,
    },
    {
        title: 'Tech Friday: AI Tools for Student Productivity',
        author: 'Innovation Club',
        category: 'Articles',
        tags: ['Technology', 'Career', 'Campus'],
        excerpt: 'Students explored practical AI tools for note-taking, revision planning, and project collaboration.',
        content: `
            <h2>Smarter workflows</h2>
            <p>During Tech Friday, students tested AI tools for summarizing lectures and generating study checklists.</p>
            <p>কিন্তু সবাইকে মনে করিয়ে দেওয়া হয়েছে: tools are helpers, not replacements for critical thinking.</p>
            <h3>Best practices</h3>
            <ul>
                <li>Always verify generated information</li>
                <li>Use AI to plan, then execute yourself</li>
                <li>Keep your own voice in assignments</li>
            </ul>
        `,
    },
    {
        title: 'Parents Meet 2026 - Progress, Support, and Trust',
        author: 'Administration',
        category: 'Announcements',
        tags: ['Community', 'Campus'],
        excerpt: 'A productive parents meet focused on student progress tracking, mentoring support, and communication channels.',
        content: `
            <h2>Shared responsibility</h2>
            <p>Parents, mentors, and faculty met to discuss student growth patterns and ways to improve support systems.</p>
            <p>আলোচনায় অংশগ্রহণকারীরা একমত হন যে নিয়মিত ফিডব্যাক শিক্ষার্থীর অগ্রগতিতে বড় ভূমিকা রাখে।</p>
            <h3>Action points</h3>
            <ul>
                <li>Monthly performance brief for guardians</li>
                <li>Early support for attendance concerns</li>
                <li>Career counseling from second semester</li>
            </ul>
        `,
    },
    {
        title: 'Placement Update: 34 Students Secured New Roles',
        author: 'Placement Desk',
        category: 'Career & Opportunities',
        tags: ['Placement', 'Success Story', 'Career'],
        excerpt: 'A positive placement cycle with students joining software, support, and business operations roles.',
        content: `
            <h2>Latest placement outcomes</h2>
            <p>In the current cycle, 34 students secured new roles across multiple organizations.</p>
            <p>এই সাফল্যের পেছনে ছিল ধারাবাহিক mock interview, profile review, এবং mentor guidance।</p>
            <h3>What worked</h3>
            <ul>
                <li>Weekly hiring updates and preparation sessions</li>
                <li>Targeted skill practice by job track</li>
                <li>Peer accountability groups</li>
            </ul>
        `,
    },
    {
        title: 'Alumni Story: Startup Journey শুরু from Campus Project',
        author: 'Alumni Network',
        category: 'Alumni Stories',
        tags: ['Alumni', 'Leadership', 'Inspiration'],
        excerpt: 'A former student explains how a small final-year project evolved into a growing startup venture.',
        content: `
            <h2>From idea to execution</h2>
            <p>The startup began as a classroom prototype. ধীরে ধীরে market feedback নিয়ে team product improve করে।</p>
            <p>Today, the team serves paying clients and continues to iterate every month.</p>
            <h3>Founder advice</h3>
            <ul>
                <li>Validate early with real users</li>
                <li>Start revenue conversations sooner</li>
                <li>Build a team that can handle ambiguity</li>
            </ul>
        `,
    },
    {
        title: 'Exam Preparation Sprint - Study Plan in 7 Days',
        author: 'Academic Support Team',
        category: 'Student Life',
        tags: ['Campus', 'Bangla', 'Inspiration'],
        excerpt: 'A practical seven-day revision plan to balance theory, practice, and rest before exams.',
        content: `
            <h2>Plan before panic</h2>
            <p>Many students wait too long before preparing. এই স্প্রিন্ট প্ল্যানটি আপনাকে কম সময়ে স্মার্টভাবে প্রস্তুতি নিতে সাহায্য করবে।</p>
            <p>Break subjects into small blocks and include spaced revision for retention.</p>
            <h3>7-day method</h3>
            <ul>
                <li>Day 1-2: concept mapping</li>
                <li>Day 3-5: practice and weak-topic focus</li>
                <li>Day 6-7: timed revision and rest</li>
            </ul>
        `,
    },
    {
        title: 'Industry Visit Notes - Learning Beyond the Classroom',
        author: 'Events Team',
        category: 'Events',
        tags: ['Career', 'Campus', 'Technology'],
        excerpt: 'Students visited a partner company to observe workflows, tools, and team collaboration in a real setting.',
        content: `
            <h2>Field learning experience</h2>
            <p>The industry visit offered direct exposure to production workflows, QA practices, and team communication models.</p>
            <p>শিক্ষার্থীরা দেখেছে class project এবং industry delivery এর পার্থক্য কোথায়।</p>
            <h3>Main observations</h3>
            <ul>
                <li>Documentation is central to delivery speed</li>
                <li>Version control discipline matters</li>
                <li>Communication prevents costly rework</li>
            </ul>
        `,
    },
    {
        title: 'Community Voices: কেন Peer Learning কাজ করে',
        author: 'Editorial Team',
        category: 'Articles',
        tags: ['Community', 'Bangla', 'Inspiration'],
        excerpt: 'Students share how peer learning groups improved their confidence, consistency, and problem-solving habits.',
        content: `
            <h2>Learning together, growing faster</h2>
            <p>Peer learning groups create rhythm. একজনের শক্তি অন্যজনের দুর্বলতা কাটাতে সাহায্য করে।</p>
            <p>Regular discussion also improves presentation skill and technical vocabulary.</p>
            <h3>Peer learning rules</h3>
            <ul>
                <li>Meet on a fixed schedule</li>
                <li>Rotate presenter roles each week</li>
                <li>Track goals and follow-ups</li>
            </ul>
        `,
    },
];

const getDemoImagePaths = () => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) return [];

    const imageNames = fs
        .readdirSync(uploadsDir)
        .filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name))
        .filter((name) => !name.includes('student-'))
        .sort()
        .slice(-24);

    return imageNames.map((name) => `/uploads/${name}`);
};

const ensureCategory = async ({ name, description }) => {
    const slug = slugify(name);
    let category = await BlogCategory.findOne({ slug });

    if (!category) {
        category = await BlogCategory.create({ name, slug, description });
    }

    return category;
};

const ensureTag = async (name) => {
    const slug = slugify(name);
    let tag = await BlogTag.findOne({ slug });

    if (!tag) {
        tag = await BlogTag.create({ name, slug });
    }

    return tag;
};

const upsertDemoPosts = async () => {
    const categoryMap = {};
    for (const categoryInput of DEMO_CATEGORIES) {
        const category = await ensureCategory(categoryInput);
        categoryMap[category.name] = category;
    }

    const tagMap = {};
    for (const tagName of DEMO_TAGS) {
        const tag = await ensureTag(tagName);
        tagMap[tag.name] = tag;
    }

    const imagePaths = getDemoImagePaths();

    let index = 0;
    for (const postInput of DEMO_POSTS) {
        const slug = slugify(postInput.title);
        const category = categoryMap[postInput.category];
        const tagIds = postInput.tags.map((name) => tagMap[name]?._id).filter(Boolean);

        const payload = {
            title: postInput.title,
            slug,
            content: postInput.content,
            excerpt: postInput.excerpt,
            author: postInput.author,
            category: category._id,
            tags: tagIds,
            status: 'published',
            publishedAt: new Date(Date.now() - index * 86400000),
            readingTime: estimateReadingTime(postInput.content),
        };

        if (imagePaths.length > 0) {
            payload.featuredImage = imagePaths[index % imagePaths.length];
        }

        await BlogPost.findOneAndUpdate({ slug }, payload, {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true,
        });

        index += 1;
    }
};

const main = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/titas_clone';
        await mongoose.connect(mongoUri);

        await upsertDemoPosts();

        console.log('Demo blog posts with demo photos are ready.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed demo blog posts:', error.message);
        process.exit(1);
    }
};

main();
