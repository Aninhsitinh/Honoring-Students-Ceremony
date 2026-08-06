export default {
  // Navigation
  nav: {
    home: 'Home',
    news: 'News',
    search: 'Search',
    login: 'Login',
    dashboard: 'Dashboard',
    logout: 'Logout',
    semesters: 'Semesters',
    graduation: 'Graduation'
  },
  // Hero Section
  hero: {
    title_line: 'Honoring Ceremony',
    title_accent: 'Excellent Students',
    description: 'Honoring students with outstanding academic achievements, highest scores in subjects, and remarkable contributions to university activities.',
    students: 'Students',
    semesters: 'Semesters',
    subjects: 'Subjects',
    explore: 'Explore more'
  },
  // Home Page
  home: {
    top_students: 'Top Students',
    top_students_desc: 'Outstanding faces with the highest achievements in the semester',
    highest_scores: 'Highest Scores',
    highest_scores_desc: 'Students achieving absolute scores in subjects',
    latest_news: 'Latest News',
    latest_news_desc: 'Updates on activities and events',
    no_students: 'No students found',
    no_scores: 'No scores found',
    view_all: 'View All',
    search_placeholder: 'Search for students, subjects...',
    subject: 'Subject',
    score: 'Score',
    load_more_students: 'Load more students ↓'
  },
  // Footer
  footer: {
    description: 'FPT Greenwich Vietnam is an international educational environment, aiming to comprehensively develop students both in knowledge and skills.',
    links: 'Links',
    contact: 'Contact',
    rights: 'All rights reserved by FPT Greenwich Vietnam.',
    follow_us: 'Follow Us'
  },
  // Posts
  post: {
    news_events: 'News & Events',
    page_desc: 'Stay updated with honoring events, outstanding activities, and the latest news',
    loading: 'Loading...',
    no_news: 'No news found',
    read_more: 'Read more',
    back: 'Back',
    share: 'Share',
    published_on: 'Published on',
    by: 'by'
  },
  // Student Modal
  student: {
    achievement: 'Achievements',
    subject: 'Subject',
    score: 'Score',
    close: 'Close',
    excellent: 'Excellent Student',
    high_score: 'High Score',
    id: 'ID',
    department: 'Department',
    semester: 'Semester',
    top_scores: 'Top Scores',
    view_detail: 'View detail'
  },
  // Admin & Generic
  admin: {
    dashboard: 'Dashboard',
    manage_semesters: 'Manage Semesters',
    manage_students: 'Manage Students',
    manage_scores: 'Manage Top Scores',
    manage_posts: 'Manage Posts',
    manage_subjects: 'Manage Subjects',
    login_title: 'Admin Login',
    login_desc: 'Login to manage the system',
    username: 'Username',
    username_placeholder: 'Enter username...',
    password: 'Password',
    password_placeholder: 'Enter password...',
    login_btn: 'Login',
    logging_in: 'Logging in...',
    back_home: 'Back to Home',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    confirm_delete: 'Are you sure you want to delete this?',
    all_semesters: 'All Semesters',
    saving: 'Saving...',
    select_subject: '-- Select Subject --',
    type_subject: 'e.g., Machine Learning',
    error_save: 'Error while saving',
    error_delete: 'Error while deleting',
    save_success: 'Save successful!',
    delete_success: 'Delete successful!',
    all_departments: 'All Departments',
    add_subject: 'Add Subject',
    subject_code: 'Subject Code',
    subject_name: 'Subject Name',
    no_data: 'No data available',
    edit_subject: 'Edit Subject',
    eg_subject_code: 'e.g., CINE1078',
    eg_subject_name: 'e.g., Media Technologies',
    error_occurred: 'Error occurred',
    delete_subject_confirm: 'Are you sure you want to delete this subject?',
    delete_students_confirm: 'Are you sure you want to delete {count} selected students?',
    delete_subjects_confirm: 'Are you sure you want to delete {count} selected subjects?',
    export_excel: 'Export Excel',
    import_excel: 'Import Excel',
    importing: 'Importing...',
    no_export_data: 'No data to export',
    none_selected: 'None selected',
    // Students
    student_type: 'Type',
    add_student: 'Add Student',
    edit_student: 'Edit Student',
    full_name: 'Full Name *',
    select_department: '-- Select Department --',
    tech_dept: 'Technology',
    biz_dept: 'Business',
    design_dept: 'Design',
    type_excellent: 'Excellent',
    type_topscore: 'Top Score',
    sort_order: 'Sort Order',
    avatar: 'Avatar URL',
    desc_achievement: 'Achievement Description',
    // Top Scores
    add_topscore: 'Add Top Score',
    edit_topscore: 'Edit Top Score',
    // Posts
    add_post: 'Add Post',
    edit_post: 'Edit Post',
    title: 'Title',
    status: 'Status',
    date_posted: 'Date Posted',
    published: 'Published',
    draft: 'Draft',
    content: 'Content',
    cover_image: 'Cover Image',
    publish_post: 'Publish Post',
    // Semesters
    add_semester: 'Add Semester',
    edit_semester: 'Edit Semester',
    sem_name: 'Semester Name',
    year: 'Year',
    slug: 'Slug',
    active_status: 'Active',
    closed_status: 'Closed',
    desc: 'Description',
    activate: 'Activate (Show to public)',
    theme_color: 'Theme Color',
    bg_image: 'Background Image',
    no_desc: 'No description',
    color_bg: 'Theme color:',
    delete_sem_confirm: 'Deleting this semester will remove all related students and top scores. Continue?',
    sem_spring: 'Spring',
    sem_summer: 'Summer',
    sem_fall: 'Fall',
    // Dashboard
    overview: 'Overview',
    total_students: 'Total Students',
    recent_activity: 'Recent Activity',
    just_added_student: 'Just added student',
    posted_new: 'Posted new article',
    scored_high: 'Graded top score for',
    stats_by_type: 'Student Statistics by Type'
  },
  // Backend errors mapped to i18n
  error: {
    server: 'Internal Server Error',
    not_found: 'Not Found',
    invalid_data: 'Invalid data',
    auth: {
      missing_credentials: 'Username and password are required',
      invalid: 'Invalid username or password'
    },
    user_not_found: 'User not found',
    semester: {
      not_found: 'Semester not found',
      no_active: 'No active semester found',
      exists: 'Semester already exists'
    },
    subject: {
      not_found: 'Subject not found',
      missing_info: 'Please fill in all required fields',
      exists: 'Subject code already exists in this department',
      excel_error: 'An error occurred while reading the Excel file'
    },
    student: {
      not_found: 'Student not found',
      invalid_code: 'Invalid student ID. Please check the prefix (GCS, GBS, GDS) matching the department and ensure exactly 6 digits follow.'
    },
    post: {
      not_found: 'Post not found'
    }
  },
  success: {
    auth: {
      login: 'Login successful'
    },
    semester: {
      deleted: 'Semester deleted successfully'
    },
    student: {
      deleted: 'Student deleted successfully'
    },
    topscore: {
      deleted: 'Score deleted successfully'
    },
    post: {
      deleted: 'Post deleted successfully'
    }
  }
}
