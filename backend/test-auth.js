const URL = 'http://localhost:4000/auth';

async function runTests() {
  console.log('--- Starting Auth Tests ---');

  const userData = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test Author',
    role: 'AUTHOR'
  };

  try {
    // 1. Signup
    console.log('\n[1] Testing Signup...');
    const signupRes = await fetch(`${URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const signupData = await signupRes.json();
    if (signupRes.ok) {
      console.log('✅ Signup Successful:', signupData.email);
    } else {
      console.error('❌ Signup Failed:', signupData);
    }

    // 2. Login
    console.log('\n[2] Testing Login...');
    const loginRes = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });
    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.access_token) {
      console.log('✅ Login Successful, Token obtained');
    } else {
      console.error('❌ Login Failed:', loginData);
      return;
    }

    // 3. Profile
    console.log('\n[3] Testing Get Profile...');
    const profileRes = await fetch(`${URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });
    const profileData = await profileRes.json();
    if (profileRes.ok) {
      console.log('✅ Profile Retrieved:', profileData.name, `(${profileData.role})`);
    } else {
      console.error('❌ Profile Retrieval Failed:', profileData);
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
