export async function POST() {
  try {
    // Proxy request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/cron/stop`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error stopping cron service:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to stop cron service',
        message: 'Backend connection failed - make sure backend server is running'
      },
      { status: 500 }
    );
  }
}
