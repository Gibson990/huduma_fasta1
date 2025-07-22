const fetchApiLib = require('node-fetch');

async function fetchUnassignedBookingsAPI() {
  const res = await fetchApiLib('http://localhost:3000/api/bookings?unassigned=true');
  const data = await res.json();
  console.log('API /api/bookings?unassigned=true response:');
  console.dir(data, { depth: null });
}

fetchUnassignedBookingsAPI().catch(console.error); 