const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const setupBackupJob = () => {
  // Run every Sunday at 02:00 AM
  cron.schedule('0 2 * * 0', () => {
    console.log('Running weekly SQLite database backup...');
    
    const dbPath = path.join(__dirname, '../../prisma/dev.db');
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `dev-${timestamp}.db`);
    
    if (fs.existsSync(dbPath)) {
      fs.copyFile(dbPath, backupFile, (err) => {
        if (err) {
          console.error('Database backup failed:', err);
        } else {
          console.log(`Database backup successful: ${backupFile}`);
          
          // Keep only the last 5 backups
          fs.readdir(backupDir, (err, files) => {
            if (err) return;
            const dbFiles = files.filter(f => f.endsWith('.db')).sort();
            if (dbFiles.length > 5) {
              const filesToDelete = dbFiles.slice(0, dbFiles.length - 5);
              filesToDelete.forEach(file => {
                fs.unlink(path.join(backupDir, file), err => {
                  if (err) console.error('Failed to delete old backup:', err);
                });
              });
            }
          });
        }
      });
    }
  });
};

module.exports = setupBackupJob;
