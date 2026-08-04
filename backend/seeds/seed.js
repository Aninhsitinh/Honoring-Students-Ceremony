const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create default admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'admin@honoring.edu.vn', passwordHash, 'admin']
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create sample semesters
    const semesters = [
      { name: 'Kỳ Xuân', year: 2025, slug: 'ky-xuan-2025', description: 'Kỳ học mùa Xuân năm 2025', is_active: false },
      { name: 'Kỳ Hè', year: 2025, slug: 'ky-he-2025', description: 'Kỳ học mùa Hè năm 2025', is_active: false },
      { name: 'Kỳ Thu', year: 2025, slug: 'ky-thu-2025', description: 'Kỳ học mùa Thu năm 2025', is_active: true },
      { name: 'Kỳ Xuân', year: 2024, slug: 'ky-xuan-2024', description: 'Kỳ học mùa Xuân năm 2024', is_active: false },
      { name: 'Kỳ Hè', year: 2024, slug: 'ky-he-2024', description: 'Kỳ học mùa Hè năm 2024', is_active: false },
      { name: 'Kỳ Thu', year: 2024, slug: 'ky-thu-2024', description: 'Kỳ học mùa Thu năm 2024', is_active: false },
    ];

    for (const sem of semesters) {
      await db.query(
        `INSERT INTO semesters (name, year, slug, description, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO NOTHING`,
        [sem.name, sem.year, sem.slug, sem.description, sem.is_active]
      );
    }
    console.log('✅ Sample semesters created');

    // Get semester IDs
    const semResult = await db.query('SELECT id, slug FROM semesters ORDER BY id');
    const semMap = {};
    semResult.rows.forEach((s) => (semMap[s.slug] = s.id));

    // Create sample students
    const students = [
      { full_name: 'Nguyễn Văn An', student_code: 'SE170001', department: 'Kỹ thuật Phần mềm', description: 'Sinh viên xuất sắc nhất kỳ với GPA 3.95/4.0. Tích cực tham gia các hoạt động nghiên cứu khoa học và đạt giải nhất cuộc thi lập trình.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Trần Thị Bình', student_code: 'SE170002', department: 'Kỹ thuật Phần mềm', description: 'GPA 3.90/4.0 - Đạt học bổng toàn phần. Dẫn dắt đội thi ACM-ICPC và đạt giải khu vực.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Lê Hoàng Cường', student_code: 'AI170003', department: 'Trí tuệ Nhân tạo', description: 'Nghiên cứu xuất sắc về Deep Learning. Công bố 2 bài báo khoa học tại hội nghị quốc tế.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Phạm Thị Dung', student_code: 'IA170004', department: 'An toàn Thông tin', description: 'Top 1 về an ninh mạng. Đạt giải nhì cuộc thi CTF toàn quốc và chứng chỉ CompTIA Security+.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Hoàng Minh Đức', student_code: 'SE170005', department: 'Kỹ thuật Phần mềm', description: 'GPA 3.88/4.0 - Founder của startup EdTech được đầu tư. Đại diện trường tham gia Google Summer of Code.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Võ Thị Em', student_code: 'GD170006', department: 'Thiết kế Đồ họa', description: 'Đạt giải nhất cuộc thi thiết kế UX/UI toàn quốc. Portfolio ấn tượng với 50+ dự án thực tế.', achievement_type: 'excellent', semester_slug: 'ky-thu-2025' },
      { full_name: 'Đặng Quốc Phong', student_code: 'SE170007', department: 'Kỹ thuật Phần mềm', description: 'Điểm 10 tuyệt đối môn Cấu trúc Dữ liệu & Giải thuật. Mentor cho hơn 30 sinh viên khóa dưới.', achievement_type: 'top_score', semester_slug: 'ky-thu-2025' },
      { full_name: 'Ngô Thị Giang', student_code: 'AI170008', department: 'Trí tuệ Nhân tạo', description: 'Điểm cao nhất lớp môn Machine Learning (9.8/10). Intern tại Google DeepMind.', achievement_type: 'top_score', semester_slug: 'ky-thu-2025' },
      { full_name: 'Bùi Văn Hải', student_code: 'SE170009', department: 'Kỹ thuật Phần mềm', description: 'GPA 3.92/4.0 - Chủ tịch CLB lập trình. Giải nhất Hackathon toàn quốc.', achievement_type: 'excellent', semester_slug: 'ky-he-2025' },
      { full_name: 'Mai Thị Hương', student_code: 'BA170010', department: 'Quản trị Kinh doanh', description: 'Sinh viên 5 tốt cấp Trung ương. Đạt IELTS 8.0 và giải thưởng nghiên cứu sinh giỏi.', achievement_type: 'excellent', semester_slug: 'ky-xuan-2025' },
    ];

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const semId = semMap[s.semester_slug];
      if (semId) {
        await db.query(
          `INSERT INTO students (full_name, student_code, department, description, achievement_type, semester_id, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [s.full_name, s.student_code, s.department, s.description, s.achievement_type, semId, i + 1]
        );
      }
    }
    console.log('✅ Sample students created');

    // Get student IDs for top scores
    const studentResult = await db.query('SELECT id, student_code FROM students');
    const studentMap = {};
    studentResult.rows.forEach((s) => (studentMap[s.student_code] = s.id));

    // Create sample top scores
    const topScores = [
      { student_code: 'SE170007', subject_name: 'Cấu trúc Dữ liệu & Giải thuật', score: 10.0, semester_slug: 'ky-thu-2025' },
      { student_code: 'AI170008', subject_name: 'Machine Learning', score: 9.8, semester_slug: 'ky-thu-2025' },
      { student_code: 'SE170001', subject_name: 'Lập trình Web', score: 9.7, semester_slug: 'ky-thu-2025' },
      { student_code: 'SE170002', subject_name: 'Cơ sở Dữ liệu', score: 9.9, semester_slug: 'ky-thu-2025' },
      { student_code: 'AI170003', subject_name: 'Deep Learning', score: 9.6, semester_slug: 'ky-thu-2025' },
      { student_code: 'IA170004', subject_name: 'An ninh Mạng', score: 9.8, semester_slug: 'ky-thu-2025' },
      { student_code: 'SE170005', subject_name: 'Kiến trúc Phần mềm', score: 9.5, semester_slug: 'ky-thu-2025' },
      { student_code: 'GD170006', subject_name: 'Thiết kế UX/UI', score: 9.9, semester_slug: 'ky-thu-2025' },
    ];

    for (const ts of topScores) {
      const studentId = studentMap[ts.student_code];
      const semId = semMap[ts.semester_slug];
      if (studentId && semId) {
        await db.query(
          'INSERT INTO top_scores (student_id, subject_name, score, semester_id) VALUES ($1, $2, $3, $4)',
          [studentId, ts.subject_name, ts.score, semId]
        );
      }
    }
    console.log('✅ Sample top scores created');

    // Create sample posts
    const adminResult = await db.query('SELECT id FROM users WHERE username = $1', ['admin']);
    const adminId = adminResult.rows[0]?.id;
    const thuSemId = semMap['ky-thu-2025'];

    if (adminId && thuSemId) {
      const posts = [
        {
          title: 'Lễ Vinh Danh Sinh Viên Xuất Sắc Kỳ Thu 2025',
          slug: 'le-vinh-danh-sv-xuat-sac-ky-thu-2025',
          content: `<h2>Lễ Vinh Danh Sinh Viên Xuất Sắc</h2>
<p>Ngày 15/12/2025, trường đã long trọng tổ chức Lễ Vinh Danh Sinh Viên Xuất Sắc Kỳ Thu 2025, tôn vinh những sinh viên có thành tích học tập và hoạt động nổi bật nhất trong kỳ.</p>
<p>Buổi lễ có sự tham dự của Ban Giám hiệu, các Trưởng khoa, Giảng viên và hơn 500 sinh viên. 8 sinh viên xuất sắc nhất đã được vinh danh trước toàn trường.</p>
<h3>Điểm nhấn của buổi lễ:</h3>
<ul>
<li>Trao giải Top sinh viên xuất sắc nhất kỳ</li>
<li>Vinh danh sinh viên đạt điểm cao nhất từng môn</li>
<li>Trao học bổng khuyến khích học tập</li>
<li>Giao lưu và chia sẻ kinh nghiệm học tập</li>
</ul>`,
          is_published: true,
        },
        {
          title: 'Top Sinh Viên Có Điểm Cao Nhất Từng Môn Kỳ Thu 2025',
          slug: 'top-sv-diem-cao-ky-thu-2025',
          content: `<h2>Vinh Danh Sinh Viên Điểm Cao</h2>
<p>Kỳ Thu 2025 ghi nhận nhiều sinh viên đạt thành tích ấn tượng với điểm số gần tuyệt đối ở các môn học quan trọng.</p>
<p>Đặc biệt, bạn Đặng Quốc Phong đã đạt điểm 10 tuyệt đối môn Cấu trúc Dữ liệu & Giải thuật - một thành tích hiếm có trong lịch sử trường.</p>`,
          is_published: true,
        },
        {
          title: 'Hackathon 2025 - Sinh Viên Tỏa Sáng',
          slug: 'hackathon-2025-sv-toa-sang',
          content: `<h2>Hackathon Toàn Quốc 2025</h2>
<p>Đội thi của trường đã xuất sắc giành giải Nhất tại Hackathon Toàn Quốc 2025 với dự án ứng dụng AI vào giáo dục.</p>
<p>Đội gồm 4 thành viên: Bùi Văn Hải (trưởng nhóm), Nguyễn Văn An, Lê Hoàng Cường và Trần Thị Bình.</p>`,
          is_published: true,
        },
      ];

      for (const post of posts) {
        await db.query(
          `INSERT INTO posts (title, slug, content, author_id, semester_id, is_published, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (slug) DO NOTHING`,
          [post.title, post.slug, post.content, adminId, thuSemId, post.is_published]
        );
      }
      console.log('✅ Sample posts created');
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('📝 Admin credentials: username=admin, password=admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
