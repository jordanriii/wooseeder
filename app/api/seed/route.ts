import { NextResponse } from 'next/server'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

// Initialize the WooCommerce API client
const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_STORE_URL ?? '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY ?? '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET ?? '',
  version: 'wc/v3'
});

async function testWooCommerceConnection() {
  console.log('WOOCOMMERCE_STORE_URL:', process.env.WOOCOMMERCE_STORE_URL);
  console.log('WOOCOMMERCE_CONSUMER_KEY:', process.env.WOOCOMMERCE_CONSUMER_KEY ? 'Set' : 'Not set');
  console.log('WOOCOMMERCE_CONSUMER_SECRET:', process.env.WOOCOMMERCE_CONSUMER_SECRET ? 'Set' : 'Not set');
  
  try {
    console.log('Attempting to connect to WooCommerce API...');
    const response = await api.get('products', { per_page: 1 });
    console.log('WooCommerce API connection successful');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('WooCommerce API connection failed');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      // Type assertion for potential Axios error structure
      const axiosError = error as { response?: { data: unknown, status: number } };
      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
      }
    } else {
      console.error('Unknown error:', error);
    }
    return false;
  }
}

export async function POST(request: Request) {
  console.log('POST request received');
  
  try {
    const isConnected = await testWooCommerceConnection();
    if (!isConnected) {
      console.error('Failed to connect to WooCommerce API');
      return NextResponse.json({ message: 'Failed to connect to WooCommerce API' }, { status: 500 });
    }

    const { types, amounts } = await request.json();
    console.log('Received types:', types);
    console.log('Received amounts:', amounts);

    const results = [];

    for (const type of types) {
      try {
        switch (type) {
          case 'customers':
            await seedCustomers(amounts.customers);
            results.push(`Successfully seeded ${amounts.customers} customers`);
            break;
          case 'products':
            await seedProducts(amounts.products);
            results.push(`Successfully seeded ${amounts.products} products`);
            break;
          case 'orders':
            await seedOrders(amounts.orders);
            results.push(`Successfully seeded ${amounts.orders} orders`);
            break;
        }
      } catch (error) {
        console.error(`Error seeding ${type}:`, error);
        results.push(`Error seeding ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({ message: results.join('; ') });
  } catch (error) {
    console.error('Error in POST function:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Error processing request', error: 'Unknown error' }, { status: 500 });
    }
  }
}

function getRandomName() {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 
                      'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara', 
                      'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                     'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
                     'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return { firstName, lastName };
}

async function seedCustomers(amount: number) {
  for (let i = 0; i < amount; i++) {
    const { firstName, lastName } = getRandomName();
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
    
    await api.post('customers', {
      email: `${randomString}@email.ghostinspector.com`,
      first_name: firstName,
      last_name: lastName,
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i + 1}`,
      password: 'password123',
    })
  }
}

// Add this function to get a random order status
function getRandomOrderStatus() {
  const statuses = ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

async function seedProducts(amount: number) {
  console.log(`Seeding ${amount} products`); // Add this log
  for (let i = 0; i < amount; i++) {
    const name = getRandomProductName();
    const description = getRandomDescription();
    const price = getRandomPrice();
    const sku = getRandomSKU();

    const productData = {
      name: name,
      type: 'simple',
      regular_price: price,
      description: description,
      short_description: `${name} - ${description.substring(0, 50)}...`,
      categories: [
        {
          id: 1 // Assuming you have at least one category, adjust as needed
        }
      ],
      images: [
        {
          src: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300` // Random image
        }
      ],
      sku: sku,
      stock_quantity: Math.floor(Math.random() * 100) + 1,
      stock_status: 'instock'
    };

    try {
      console.log(`Attempting to create product ${i + 1} of ${amount}: ${name}`);
      const response = await api.post('products', productData);
      console.log(`Product created successfully: ${response.data.id}`);
    } catch (error) {
      console.error(`Error creating product: ${name}`);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        // Type assertion for potential Axios error structure
        const axiosError = error as { response?: { data: unknown, status: number } };
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
}

async function seedOrders(amount: number) {
  // Fetch all customers and products
  const { data: customers } = await api.get('customers', { per_page: 100 })
  const { data: products } = await api.get('products', { per_page: 100 })

  for (let i = 0; i < amount; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const numberOfItems = Math.floor(Math.random() * 5) + 1 // Order 1-5 items

    const lineItems: Array<{product_id: number, quantity: number}> = [];
    let totalAmount = 0;

    for (let j = 0; j < numberOfItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1 // Order 1-3 of each item
      const price = parseFloat(product.price)
      
      lineItems.push({
        product_id: product.id,
        quantity: quantity
      })

      totalAmount += price * quantity
    }

    const orderData = {
      customer_id: customer.id,
      status: getRandomOrderStatus(), // Use the new function here
      line_items: lineItems,
      billing: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        address_1: '123 Billing St',
        city: 'Billing City',
        state: 'BC',
        postcode: '12345',
        country: 'US',
        email: customer.email,
        phone: '(555) 555-5555'
      },
      shipping: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        address_1: '123 Shipping St',
        city: 'Shipping City',
        state: 'SC',
        postcode: '54321',
        country: 'US'
      },
      total: totalAmount.toFixed(2),
      set_paid: true
    }

    try {
      console.log(`Creating order ${i + 1} of ${amount}`);
      const response = await api.post('orders', orderData);
      console.log(`Order created successfully: ${response.data.id}`);
    } catch (error) {
      console.error(`Error creating order for customer ${customer.id}`);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        const axiosError = error as { response?: { data: unknown, status: number } };
        if (axiosError.response) {
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
}

function getRandomProductName() {
  const adjectives = ['Awesome', 'Fantastic', 'Incredible', 'Amazing', 'Superb'];
  const nouns = ['Widget', 'Gadget', 'Tool', 'Device', 'Gizmo'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

function getRandomDescription() {
  const descriptions = [
    'This product will change your life!',
    'You won\'t believe how great this is!',
    'The perfect solution for all your needs.',
    'Innovative design meets exceptional quality.',
    'Experience the difference with our product!'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomPrice() {
  return (Math.random() * (100 - 10) + 10).toFixed(2);
}

function getRandomSKU() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}