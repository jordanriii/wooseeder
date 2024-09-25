# WooCommerce Data Seeder

A Next.js application for quickly populating WooCommerce stores with test data.

## Features

- Generate customers, products, and orders in bulk
- Customizable quantities for each data type
- User-friendly interface
- Real-time seeding progress feedback
- WooCommerce REST API integration

## Getting Started

### Prerequisites

- Node.js (v14+)
- WooCommerce store with API access

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run the dev server: `npm run dev`
5. Open http://localhost:3000 in your browser

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_WOO_API_URL=https://yourstore.com/wp-json/wp/v2
NEXT_PUBLIC_WOO_API_CONSUMER_KEY=ck_yourkey
NEXT_PUBLIC_WOO_API_CONSUMER_SECRET=cs_yoursecret
```

Obtain these from WooCommerce > Settings > Advanced > REST API in your WordPress admin.

## Usage

1. Select data types to generate
2. Enter desired quantities
3. Click "Seed Selected Data"
4. Monitor progress and await confirmation

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- WooCommerce REST API

## Contributing

Contributions welcome. Please submit a Pull Request.

## License

MIT License

## Acknowledgments

- Built with shadcn/ui components
- Powered by WooCommerce REST API