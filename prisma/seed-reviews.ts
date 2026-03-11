import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const seedReviews = [
  {
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    rating: 5,
    title: "Lifesaver in Tokyo",
    text: "Landed at Narita and had data within 30 seconds of turning off airplane mode. Used it for Google Maps, translation apps, and video calls home for two weeks straight. Never dropped below 4G. This is how travel should be.",
    destination: "Japan",
    countryCode: "JP",
    verified: true,
    approved: true,
  },
  {
    name: "Marcus Weber",
    email: "marcus.w@example.com",
    rating: 5,
    title: "Perfect for multi-country Europe trips",
    text: "Drove through France, Spain, and Portugal over three weeks. One eSIM covered all three countries seamlessly. No switching SIMs at borders, no roaming fees. Speed was consistently good even in smaller towns.",
    destination: "Europe",
    countryCode: "EU",
    verified: true,
    approved: true,
  },
  {
    name: "Priya Sharma",
    email: "priya.s@example.com",
    rating: 4,
    title: "Great value for Bali trip",
    text: "The 5GB plan lasted my entire 10-day Bali trip. Speeds were solid in Seminyak and Ubud. Only reason for 4 stars is the connection was spotty in very rural areas, but that's expected anywhere.",
    destination: "Indonesia",
    countryCode: "ID",
    verified: true,
    approved: true,
  },
  {
    name: "James O'Brien",
    email: "james.ob@example.com",
    rating: 5,
    title: "Business trip essential",
    text: "I travel for work constantly and MobiaL has become non-negotiable. Set up takes two minutes, the connection is reliable for video conferences, and my company reimburses it easily with the clear receipts. Used it in Singapore, Thailand, and Vietnam this month alone.",
    destination: "Southeast Asia",
    countryCode: "SG",
    verified: true,
    approved: true,
  },
  {
    name: "Elena Costa",
    email: "elena.c@example.com",
    rating: 5,
    title: "So much better than airport SIM cards",
    text: "I used to waste 45 minutes at every airport buying local SIMs. Now I install the eSIM at home before my flight and I'm connected the moment I land. Used it across Turkey for two weeks and it was flawless.",
    destination: "Turkey",
    countryCode: "TR",
    verified: true,
    approved: true,
  },
  {
    name: "Yuki Tanaka",
    email: "yuki.t@example.com",
    rating: 4,
    title: "Reliable connection in the US",
    text: "Visited New York and LA over 12 days. Data speeds were excellent in both cities. Streaming, maps, and ride-sharing apps all worked perfectly. Would have liked a slightly larger data option for the price, but overall very happy.",
    destination: "United States",
    countryCode: "US",
    verified: true,
    approved: true,
  },
  {
    name: "Ahmed Hassan",
    email: "ahmed.h@example.com",
    rating: 5,
    title: "Made my Dubai trip stress-free",
    text: "First time using an eSIM and the setup guide was crystal clear. Had 5G speeds across Dubai and Abu Dhabi. Used it for navigation, restaurant reviews, and staying in touch with family. Will never go back to physical SIMs.",
    destination: "UAE",
    countryCode: "AE",
    verified: true,
    approved: true,
  },
  {
    name: "Lisa Chen",
    email: "lisa.c@example.com",
    rating: 5,
    title: "Digital nomad approved",
    text: "I've been working remotely across Southeast Asia for six months. MobiaL's regional plans are the best value I've found. Reliable enough for daily Zoom calls, and switching countries is seamless. Already recommended it to my entire coworking group.",
    destination: "Thailand",
    countryCode: "TH",
    verified: true,
    approved: true,
  },
  {
    name: "Roberto Fernandez",
    email: "roberto.f@example.com",
    rating: 4,
    title: "Solid service in South America",
    text: "Used it through Colombia and Peru for three weeks. Connection was strong in major cities like Bogota and Lima. Slightly slower in Cusco but still very usable. The instant delivery and easy setup made it a clear winner over the alternatives I researched.",
    destination: "South America",
    countryCode: "CO",
    verified: true,
    approved: true,
  },
  {
    name: "Sophie Martin",
    email: "sophie.m@example.com",
    rating: 5,
    title: "Saved me in an emergency",
    text: "My physical SIM stopped working mid-trip in Morocco. Bought a MobiaL eSIM on my phone browser, scanned the QR code, and was back online in under five minutes. Actual lifesaver when you need maps and translation in a foreign country.",
    destination: "Morocco",
    countryCode: "MA",
    verified: true,
    approved: true,
  },
  {
    name: "David Kim",
    email: "david.k@example.com",
    rating: 5,
    title: "Fast speeds in Europe",
    text: "Visited London, Paris, and Amsterdam over two weeks. LTE speeds consistently above 50 Mbps. The dual-SIM setup meant I could keep receiving Korean calls while using MobiaL for data. Incredibly convenient.",
    destination: "Europe",
    countryCode: "KR",
    verified: true,
    approved: true,
  },
  {
    name: "Maria Gonzalez",
    email: "maria.g@example.com",
    rating: 4,
    title: "Great for family vacations",
    text: "Bought plans for myself and my husband for our Italy trip. Both activated in minutes. The kids could use our hotspot for their tablets. Much cheaper than the hotel Wi-Fi add-on and way more reliable. Will definitely use again for our next trip.",
    destination: "Italy",
    countryCode: "IT",
    verified: true,
    approved: true,
  },
]

async function main() {
  console.log("Seeding reviews...")

  for (const review of seedReviews) {
    await db.review.create({ data: review })
  }

  console.log(`Seeded ${seedReviews.length} reviews.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
