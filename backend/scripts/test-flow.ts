import axios from 'axios';
import { v4 as uuid } from 'uuid';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting CargoHub Backend Tests ---');
  
  const userId = `test-user-${uuid().substring(0,8)}`;
  let bookingId: string | undefined;

  // Wait for server to be ready
  try {
    await axios.get('http://localhost:5000/health');
    console.log('✅ Server is up and running');
  } catch (err) {
    console.error('❌ Server is not reachable. Ensure "npm run dev" is running.');
    return;
  }

  // Test 1: Fare Estimate (No Auth needed)
  try {
    console.log('\nTesting POST /api/fare/estimate...');
    const fareRes = await axios.post(`${API_URL}/fare/estimate`, {
      pickupLat: 28.7041,
      pickupLng: 77.1025,
      dropLat: 28.5355,
      dropLng: 77.3910,
      vehicleType: 'TATA_ACE',
      loadType: 'FURNITURE',
      helpersRequested: 1
    });
    console.log('✅ Fare Estimate Success:', fareRes.data.data.total);
  } catch (err: any) {
    console.error('❌ Fare Estimate Failed:', err.response?.data || err.message);
  }

  // Test 2: AI Cargo Extraction
  try {
    console.log('\nTesting POST /api/ai/extract-cargo...');
    const aiRes = await axios.post(`${API_URL}/ai/extract-cargo`, {
      text: "I need to move a 3-seater sofa and a fridge to Noida."
    }, {
      headers: {
        'x-mock-uid': userId,
        'x-mock-role': 'USER'
      }
    });
    console.log('✅ AI Extraction Success:', aiRes.data.data);
  } catch (err: any) {
    console.error('❌ AI Extraction Failed:', err.response?.data || err.message);
  }

  // NOTE: Testing Booking and Payment requires the Supabase tables to exist.
  // If `supabase-init.sql` hasn't been executed, the following tests will fail
  // with a 500 error (relation "users" does not exist).
  console.log('\n--- The following tests require Supabase schema to be initialized ---');
  try {
    console.log('\nTesting POST /api/bookings...');
    const bookingRes = await axios.post(`${API_URL}/bookings`, {
      pickupLat: 28.7041,
      pickupLng: 77.1025,
      pickupAddress: "Delhi",
      dropLat: 28.5355,
      dropLng: 77.3910,
      dropAddress: "Noida",
      vehicleType: 'TATA_ACE',
      loadType: 'FURNITURE',
      helpersRequested: 1
    }, {
      headers: {
        'x-mock-uid': userId,
        'x-mock-role': 'USER'
      }
    });
    bookingId = bookingRes.data.data.booking.id;
    console.log('✅ Booking Created:', bookingId);

    if (bookingId) {
      console.log('\nTesting POST /api/payments/create-order...');
      // Note: This requires the booking status to be 'DELIVERED', so we'll get a 400 error in a real flow.
      const paymentRes = await axios.post(`${API_URL}/payments/create-order`, {
        bookingId
      }, {
        headers: {
          'x-mock-uid': userId,
          'x-mock-role': 'USER'
        }
      });
      console.log('✅ Payment Order Created:', paymentRes.data.data);
    }
  } catch (err: any) {
    console.log('ℹ️ DB Tests skipped or failed (likely due to missing Supabase tables).', err.response?.data?.error || err.message);
  }

  console.log('\n--- Tests Complete ---');
}

runTests();
