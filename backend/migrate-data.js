const { Pool } = require('pg');
require('dotenv').config();

const localPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'honoring_students',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const remotePool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateData() {
  const localClient = await localPool.connect();
  const remoteClient = await remotePool.connect();

  try {
    console.log('🔄 Starting data migration to Supabase...');
    
    // Disable foreign key checks on remote
    // Note: Postgres doesn't easily let you disable FKs globally, but we can migrate tables in order.

    const tables = ['users', 'semesters', 'students', 'top_scores', 'subjects', 'posts'];

    for (const table of tables) {
      console.log(`\nMigrating table: ${table}`);
      
      const res = await localClient.query(`SELECT * FROM ${table}`);
      const rows = res.rows;
      
      console.log(`Found ${rows.length} rows in local ${table}.`);

      if (rows.length === 0) continue;

      // Truncate remote table first to ensure clean state
      await remoteClient.query(`TRUNCATE TABLE ${table} CASCADE`);

      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');
        
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        await remoteClient.query(query, values);
      }
      
      // Update sequence for the table so new inserts get correct ID
      const seqRes = await remoteClient.query(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = 'id'
      `, [table]);
      
      if (seqRes.rows.length > 0 && seqRes.rows[0].column_default) {
        const match = seqRes.rows[0].column_default.match(/nextval\('([^']+)'/);
        if (match) {
          const seqName = match[1];
          await remoteClient.query(`
            SELECT setval('${seqName}', COALESCE((SELECT MAX(id)+1 FROM ${table}), 1), false)
          `);
        }
      }
      
      console.log(`✅ ${table} migration complete.`);
    }

    console.log('\n🎉 Data migration to Supabase completed successfully!');
  } catch (error) {
    console.error('❌ Data migration failed:', error);
  } finally {
    localClient.release();
    remoteClient.release();
    localPool.end();
    remotePool.end();
  }
}

migrateData();
