import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- Starting API E2E Tests ---');
  let token = '';
  let userId = '';

  try {
    // 1. Register
    console.log('\n1. Testing Register...');
    const testEmail = `e2e${Date.now()}@test.com`;
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'E2E Tester',
      email: testEmail,
      password: 'password123'
    });
    console.log('Register successful:', regRes.data);

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    // Wait, the email in regRes is actually dynamic. I should use the exact same.
    token = loginRes.data.token;
    userId = loginRes.data.user._id || loginRes.data.user.id;
    console.log('Login successful, Token received.');

    // Setup Axios Defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error('Auth Failed:', error.response ? error.response.data : error.message);
    return; // Stop if auth fails
  }

  try {
    // 3. Profile Update (Text)
    console.log('\n3. Testing Profile Update...');
    const profileRes = await axios.put(`${API_URL}/users/profile`, {
      bio: 'E2E Test Bio',
      department: 'Computer Science'
    });
    console.log('Profile updated successfully:', profileRes.data.bio);
  } catch (error) {
    console.error('Profile Update Failed:', error.response ? error.response.data : error.message);
  }

  const testImagePath = path.join(__dirname, 'test_image.gif');
  const gif1x1 = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
  fs.writeFileSync(testImagePath, gif1x1);

  try {
    // 4. Profile Pic Upload
    console.log('\n4. Testing Profile Pic Upload...');
    const formPic = new FormData();
    formPic.append('image', fs.createReadStream(testImagePath));
    const picRes = await axios.put(`${API_URL}/users/profile-pic`, formPic, {
      headers: formPic.getHeaders()
    });
    console.log('Profile pic uploaded successfully:', picRes.data.profilePic);
  } catch (error) {
    console.error('Profile Pic Upload Failed (Expected in Sandbox):', error.message);
  }

  try {
    // 5. Banner Upload
    console.log('\n5. Testing Banner Upload...');
    const formBanner = new FormData();
    formBanner.append('image', fs.createReadStream(testImagePath));
    const bannerRes = await axios.put(`${API_URL}/users/banner`, formBanner, {
      headers: formBanner.getHeaders()
    });
    console.log('Banner uploaded successfully:', bannerRes.data.banner);
  } catch (error) {
    console.error('Banner Upload Failed (Expected in Sandbox):', error.message);
  }

  let postId = null;
  try {
    // 6. Create Post
    console.log('\n6. Testing Create Post...');
    const postForm = new FormData();
    postForm.append('text', 'Hello from E2E tests! #e2e');
    // Don't append image here, otherwise it will try to upload to Cloudinary and fail!
    const postRes = await axios.post(`${API_URL}/posts`, postForm, {
      headers: postForm.getHeaders()
    });
    postId = postRes.data._id;
    console.log('Post created successfully, ID:', postId);
  } catch (error) {
    console.error('Create Post Failed:', error.response ? error.response.data : error.message);
  }

  try {
    // 7. Get Posts
    console.log('\n7. Testing Get Posts...');
    const getPostsRes = await axios.get(`${API_URL}/posts`);
    const postsData = getPostsRes.data.posts || getPostsRes.data;
    console.log(`Retrieved ${postsData.length} posts.`);
  } catch (error) {
    console.error('Get Posts Failed:', error.response ? error.response.data : error.message);
  }

  if (postId) {
    try {
      // 8. Like Post
      console.log('\n8. Testing Like Post...');
      const likeRes = await axios.put(`${API_URL}/posts/${postId}/like`);
      console.log('Post liked successfully. Likes:', likeRes.data.likes);
    } catch (error) {
      console.error('Like Post Failed:', error.response ? error.response.data : error.message);
    }

    try {
      // 9. Comment on Post
      console.log('\n9. Testing Comment Post...');
      const commentRes = await axios.post(`${API_URL}/posts/${postId}/comment`, {
        text: 'Great test post!'
      });
      console.log('Comment added successfully. Comments:', commentRes.data.comments.length);
    } catch (error) {
      console.error('Comment Post Failed:', error.response ? error.response.data : error.message);
    }

    try {
      // 10. Edit Post
      console.log('\n10. Testing Edit Post...');
      const editRes = await axios.put(`${API_URL}/posts/${postId}`, {
        text: 'Edited text for E2E post #e2e'
      });
      console.log('Post edited successfully:', editRes.data.text);
    } catch (error) {
      console.error('Edit Post Failed:', error.response ? error.response.data : error.message);
    }

    try {
      // 11. Delete Post
      console.log('\n11. Testing Delete Post...');
      const deleteRes = await axios.delete(`${API_URL}/posts/${postId}`);
      console.log('Post deleted successfully:', deleteRes.data.message);
    } catch (error) {
      console.error('Delete Post Failed:', error.response ? error.response.data : error.message);
    }
  }

  // Cleanup
  fs.unlinkSync(testImagePath);
  console.log('\n--- API Tests Finished ---');
}

runTests();
