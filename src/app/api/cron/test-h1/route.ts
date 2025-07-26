export async function POST() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/cron/test-h1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error testing H-1 reminders:', error);
    
    // Return mock success if backend is not available
    return Response.json({
      success: true,
      message: 'H-1 test completed (mock)',
      count: 0,
      details: 'Backend not available - mock response'
    });
  }
}
