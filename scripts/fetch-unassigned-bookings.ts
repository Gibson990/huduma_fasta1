<<<<<<< HEAD
const fetchApi = require('node-fetch');

async function fetchUnassignedBookingsAPI() {
  const res = await fetchApi('http://localhost:3000/api/bookings?unassigned=true');
=======
const fetchApiLib = require('node-fetch');

async function fetchUnassignedBookingsAPI() {
  const res = await fetchApiLib('http://localhost:3000/api/bookings?unassigned=true');
>>>>>>> provider-dashboard-enhancement
  const data = await res.json();
  console.log('API /api/bookings?unassigned=true response:');
  console.dir(data, { depth: null });
}

fetchUnassignedBookingsAPI().catch(console.error); 