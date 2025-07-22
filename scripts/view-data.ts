import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432
})

async function viewTableData() {
  const client = await pool.connect()
  try {
    console.log('📊 Viewing Database Tables Data\n')

    // View Users
    console.log('👥 Users Table:')
    const usersResult = await client.query('SELECT id, name, email, role, created_at FROM users')
    console.table(usersResult.rows)
    console.log('\n')

    // View Categories
    console.log('📑 Categories Table:')
    const categoriesResult = await client.query('SELECT * FROM categories')
    console.table(categoriesResult.rows)
    console.log('\n')

    // View Services
    console.log('🔧 Services Table:')
    const servicesResult = await client.query(`
      SELECT s.*, c.name_en as category_name 
      FROM services s 
      LEFT JOIN categories c ON s.category_id = c.id
    `)
    console.table(servicesResult.rows)
    console.log('\n')

    // View Cart Items
    console.log('🛒 Cart Items Table:')
    const cartResult = await client.query(`
      SELECT ci.*, u.name as user_name, s.name_en as service_name
      FROM cart_items ci
      LEFT JOIN users u ON ci.user_id = u.id
      LEFT JOIN services s ON ci.service_id = s.id
    `)
    console.table(cartResult.rows)
    console.log('\n')

    // View Orders
    console.log('📦 Orders Table:')
    const ordersResult = await client.query(`
      SELECT o.*, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `)
    console.table(ordersResult.rows)
    console.log('\n')

    // View Order Items
    console.log('📝 Order Items Table:')
    const orderItemsResult = await client.query(`
      SELECT oi.*, o.id as order_id, s.name_en as service_name
      FROM order_items oi
      LEFT JOIN orders o ON oi.order_id = o.id
      LEFT JOIN services s ON oi.service_id = s.id
    `)
    console.table(orderItemsResult.rows)

  } catch (error) {
    console.error('❌ Error viewing data:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

async function viewUsers() {
  const client = await pool.connect()
  try {
    console.log('🔍 Viewing user data...')
    
    const result = await client.query(`
      SELECT id, name, email, phone, role, address, is_active, created_at 
      FROM users
    `)
    
    console.log('\n📋 Users in database:')
    console.log('-------------------')
    result.rows.forEach(user => {
      console.log(`
ID: ${user.id}
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Role: ${user.role}
Address: ${user.address}
Active: ${user.is_active}
Created: ${user.created_at}
-------------------`)
    })
  } catch (error) {
    console.error('❌ Error viewing users:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

viewTableData()
viewUsers() 