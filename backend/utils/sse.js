/**
 * SSE (Server-Sent Events) broadcaster
 * Allows the server to push real-time updates to all connected clients.
 * 
 * Events emitted:
 *   - students_updated  : when students are added/deleted/imported
 *   - top_scores_updated: when top scores change
 *   - semesters_updated : when a semester changes
 */

const clients = new Set();

function addClient(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // Send a heartbeat immediately so the connection is established
  res.write(':heartbeat\n\n');

  clients.add(res);

  // Remove client when connection is closed
  res.on('close', () => {
    clients.delete(res);
  });
}

function broadcast(event, data = {}) {
  const payload = `event: ${event}\ndata: ${JSON.stringify({ ...data, ts: Date.now() })}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

// Heartbeat every 25s to keep connections alive through proxies/load balancers
setInterval(() => {
  for (const client of clients) {
    try {
      client.write(':heartbeat\n\n');
    } catch {
      clients.delete(client);
    }
  }
}, 25000);

module.exports = { addClient, broadcast };
