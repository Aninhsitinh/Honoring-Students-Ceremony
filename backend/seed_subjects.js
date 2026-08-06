const db = require('./config/database');

const IT_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1810 Data and Web Analytics',
  'COMP1807 Agile Development with SCRUM',
  'COMP1842 Web Programming 2',
  'COMP1844 Information Analysis and Visualisation',
  'AMD201 Advanced Microservices Development and Deployment',
  'COMP1858 Data Structures and Algorithms',
  'COMP1643 Information and Content Management',
  'COMP1649 Human Computer Interaction and Design',
  'COMP1787 Requirements Management',
  'COMP1786 Mobile Application Design and Development',
  'COMP1682 Final Year Projects',
  'OJT On the Job Training'
]

const AI_DS_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'MACG101 Advanced math for Computer Science',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1807 Agile Development with SCRUM',
  'COMP1891 Applications in AI and Data Science',
  'COMP1842 Web Programming 2',
  'COMP1858 Data Structures and Algorithms',
  'FCVG101 Fundamentals of Computer Vision',
  'COMP1682 Final Year Projects',
  'COMP1861 Machine Learning',
  'COMP1921 Advanced Topics in Data Science and AI',
  'DPLG101 Deep Learning',
  'COMP1787 Requirements Management',
  'COMP1649 Human Computer Interaction and Design',
  'OJT On the Job Training'
]

const AI_CYBER_SUBJECTS = [
  'COMP1753 Programming Foundations',
  'COMP1856 Software Engineering',
  'COMP1845 Systems Development',
  'MATH1179 Mathematics for Computer Science',
  'COMP1857 Introduction to Data Science',
  'COMP1752 Object Oriented Programming',
  'COMP1843 Principles of Security',
  'COMP1589 Computer Systems and Internet Technologies',
  'MACG101 Advanced math for Computer Science',
  'COMP1773 User Interface Design',
  'COMP1841 Web Programming 1',
  'COMP1770 Professional Project Management',
  'AIGW201 Introduction to Artificial Intelligence',
  'COMP1551 Application Development',
  'COMP1807 Agile Development with SCRUM',
  'COMP1891 Applications in AI and Data Science',
  'COMP1842 Web Programming 2',
  'COMP1806 Information Security',
  'FCVG101 Fundamentals of Computer Vision',
  'COMP1682 Final Year Projects',
  'COMP1664 Network Technology',
  'COMP1860 IT Security and Privacy Risk Management',
  'DPLG101 Deep Learning',
  'COMP1787 Requirements Management',
  'COMP1859 Information Retrieval',
  'OJT On the Job Training'
]

const MEDIA_SUBJECTS = [
  'CINE1078 Media Technologies',
  'DESI1250 Visual Thinking',
  'VCMG101 Visual Communication (Optional)',
  'DMTG101 Digital Media Tools (Optional)',
  'SSGG103 Teamwork in Global Environment',
  'MEDS1161 Creative Communications',
  'MEDS1177 Media and Identity',
  'MCTG101 Media Theory, Culture',
  'MARK1265 Consumer Culture',
  'DESI1251 Ideas Lab',
  'CCPG101 Creative Content Production (Optional)',
  'SSFG101 Scriptwriting and Screenwriting Fundamentals (Optional)',
  'ISMG201 Strategic Communication (Optional)',
  'MEDS1175 Brand Storytelling',
  'JOUR1016 Writing Journalism',
  'MEDS1146 Advanced Projects',
  'DESI1257 Platform Personas: Curating Social Media Identities',
  'MEDS1178 Brand Worldbuilding',
  'OJT On the job training'
]

async function seed() {
  const insertQuery = `INSERT INTO subjects (code, name, department) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`;

  const departments = [
    { name: 'Công nghệ thông tin', subjects: IT_SUBJECTS },
    { name: 'Trí tuệ nhân tạo và Khoa học dữ liệu', subjects: AI_DS_SUBJECTS },
    { name: 'Trí tuệ nhân tạo và An ninh mạng', subjects: AI_CYBER_SUBJECTS },
    { name: 'Truyền thông đa phương tiện', subjects: MEDIA_SUBJECTS },
  ];

  for (const dep of departments) {
    for (const sub of dep.subjects) {
      const match = sub.match(/^([A-Z0-9]+)\s+(.+)$/);
      if (match) {
        const code = match[1];
        const name = match[2];
        await db.query(insertQuery, [code, name, dep.name]);
      }
    }
  }

  console.log('Done seeding subjects');
  process.exit(0);
}

seed();
