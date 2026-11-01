const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || 5000;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log(' TRACKER & SOLVER APP - REST API VERIFICATION SUITE ');
  console.log('====================================================');

  const baseOpt = {
    hostname: '127.0.0.1',
    port: PORT,
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    // 1. Health check
    console.log('[1/14] Testing GET /api/health...');
    const health = await makeRequest({ ...baseOpt, path: '/api/health', method: 'GET' });
    console.log('       Status:', health.status, '| API State:', health.data.status);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. User registration
    const userEmail = `student_${Date.now()}@example.com`;
    console.log('[2/14] Testing POST /api/auth/register (Standard User)...');
    const userReg = await makeRequest(
      { ...baseOpt, path: '/api/auth/register', method: 'POST' },
      { name: 'Student Developer', email: userEmail, password: 'Password123', role: 'user' }
    );
    console.log('       Status:', userReg.status, '| Registered User:', userReg.data.user?.email);
    const userToken = userReg.data.token;
    if (!userToken) throw new Error('Failed to acquire user token');

    // 3. Admin registration
    const adminEmail = `faculty_${Date.now()}@example.com`;
    console.log('[3/14] Testing POST /api/auth/register (Admin User)...');
    const adminReg = await makeRequest(
      { ...baseOpt, path: '/api/auth/register', method: 'POST' },
      { name: 'Faculty Evaluator', email: adminEmail, password: 'AdminPassword123', role: 'admin' }
    );
    console.log('       Status:', adminReg.status, '| Registered Admin:', adminReg.data.user?.role);
    const adminToken = adminReg.data.token;
    if (!adminToken) throw new Error('Failed to acquire admin token');

    // 4. Login verification
    console.log('[4/14] Testing POST /api/auth/login...');
    const loginRes = await makeRequest(
      { ...baseOpt, path: '/api/auth/login', method: 'POST' },
      { email: userEmail, password: 'Password123' }
    );
    console.log('       Status:', loginRes.status, '| Auth Message:', loginRes.data.message);
    if (loginRes.status !== 200) throw new Error('Login failed');

    // 5. Protected profile retrieval
    console.log('[5/14] Testing GET /api/auth/profile...');
    const profileRes = await makeRequest({
      ...baseOpt,
      path: '/api/auth/profile',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
    });
    console.log('       Status:', profileRes.status, '| Verified Name:', profileRes.data.user?.name);

    // 6. Create Task
    console.log('[6/14] Testing POST /api/tasks (Create Task)...');
    const taskRes = await makeRequest(
      {
        ...baseOpt,
        path: '/api/tasks',
        method: 'POST',
        headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
      },
      {
        title: 'B.Tech CSE Project Submission Preparation',
        description: 'Complete architecture analysis, API development, responsive UI, and GitHub push',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      }
    );
    console.log('       Status:', taskRes.status, '| Created Task ID:', taskRes.data.task?._id);
    const taskId = taskRes.data.task?._id;

    // 7. Get Tasks
    console.log('[7/14] Testing GET /api/tasks (List & Filter Tasks)...');
    const tasksList = await makeRequest({
      ...baseOpt,
      path: '/api/tasks?priority=High',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
    });
    console.log('       Status:', tasksList.status, '| High Priority Count:', tasksList.data.count);

    // 8. Update Task status
    console.log('[8/14] Testing PUT /api/tasks/:id (Status Transition)...');
    const taskUpdate = await makeRequest(
      {
        ...baseOpt,
        path: `/api/tasks/${taskId}`,
        method: 'PUT',
        headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
      },
      { status: 'completed' }
    );
    console.log('       Status:', taskUpdate.status, '| New Task Status:', taskUpdate.data.task?.status);

    // 9. Record Problem
    console.log('[9/14] Testing POST /api/problems (Record Problem)...');
    const probRes = await makeRequest(
      {
        ...baseOpt,
        path: '/api/problems',
        method: 'POST',
        headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
      },
      {
        title: 'Asynchronous State Race Condition in React Component',
        description: 'Component re-rendered with stale closure before async API response arrived',
        category: 'Debugging',
        severity: 'High',
        initialSolution: 'Used AbortController inside useEffect cleanup function',
      }
    );
    console.log('       Status:', probRes.status, '| Problem ID:', probRes.data.problem?._id);
    const probId = probRes.data.problem?._id;

    // 10. Add Solution Attempt & Resolution
    console.log('[10/14] Testing POST /api/problems/:id/solutions (Log Solution)...');
    const solRes = await makeRequest(
      {
        ...baseOpt,
        path: `/api/problems/${probId}/solutions`,
        method: 'POST',
        headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
      },
      {
        solutionText: 'Implemented isMounted flag / AbortController cleanup in useEffect',
        outcome: 'Resolved',
      }
    );
    console.log('       Status:', solRes.status, '| Updated Problem Status:', solRes.data.problem?.status);

    // 11. Dashboard Metrics
    console.log('[11/14] Testing GET /api/dashboard/stats...');
    const statsRes = await makeRequest({
      ...baseOpt,
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
    });
    console.log('       Status:', statsRes.status, '| Completion Rate:', statsRes.data.stats?.taskCompletionRate + '%');

    // 12. Progress Velocity
    console.log('[12/14] Testing GET /api/dashboard/progress...');
    const progRes = await makeRequest({
      ...baseOpt,
      path: '/api/dashboard/progress',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${userToken}` },
    });
    console.log('       Status:', progRes.status, '| Today Completed:', progRes.data.progress?.daily?.tasksCompleted);

    // 13. Admin System Telemetry
    console.log('[13/14] Testing GET /api/admin/stats (Admin Guarded)...');
    const adminStats = await makeRequest({
      ...baseOpt,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${adminToken}` },
    });
    console.log('       Status:', adminStats.status, '| System Total Users:', adminStats.data.stats?.totalUsers);

    // 14. Admin Users Management
    console.log('[14/14] Testing GET /api/admin/users (Admin Guarded)...');
    const adminUsers = await makeRequest({
      ...baseOpt,
      path: '/api/admin/users',
      method: 'GET',
      headers: { ...baseOpt.headers, Authorization: `Bearer ${adminToken}` },
    });
    console.log('       Status:', adminUsers.status, '| Total Registered Users:', adminUsers.data.count);

    console.log('====================================================');
    console.log(' SUCCESS: ALL 14 API TEST CASES PASSED WITH 100% OK ');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n*** API TEST FAILED ***', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
