const mongoose = require('mongoose');
require('dotenv').config();

// Import the Trek model
const Trek = require('./models/Trek');

// Sample trek data - ALL 11 original treks with original asset photos
const sampleTreks = [
  {
    name: "Valley of Flowers",
    description: "A beautiful trek through meadows filled with colorful flowers",
    image: "/src/assets/ValleyOfFlowers.png",
    experiences: [
      {
        user: "Amit",
        text: "The Valley of Flowers was breathtaking! The meadows were in full bloom.",
        photos: ["/src/assets/ValleyOfFlowers.png"],
        likes: 3,
        likedBy: [],
        comments: [
          { user: "Priya", text: "Wow, looks amazing!" }
        ]
      }
    ]
  },
  {
    name: "Kedarkantha",
    description: "A challenging snow trek with stunning mountain views",
    image: "/src/assets/Kedarkantha.jpg",
    experiences: [
      {
        user: "Rahul",
        text: "Snow trek to Kedarkantha was challenging but rewarding.",
        photos: ["/src/assets/Kedarkantha.jpg"],
        likes: 5,
        likedBy: [],
        comments: [
          { user: "Sneha", text: "I want to go there too!" }
        ]
      }
    ]
  },
  {
    name: "Kashmir Great Lakes",
    description: "A dream trek through the beautiful lakes of Kashmir",
    image: "/src/assets/KGL.jpg",
    experiences: [
      {
        user: "Neha",
        text: "The Kashmir Great Lakes trek is a dream come true for every trekker. The lakes are surreal!",
        photos: ["/src/assets/KGL.jpg"],
        likes: 8,
        likedBy: [],
        comments: [
          { user: "Rohit", text: "On my bucket list now!" }
        ]
      }
    ]
  },
  {
    name: "Hampta Pass",
    description: "Experience the contrast of lush valleys and stark deserts",
    image: "/src/assets/hampta.jpg",
    experiences: [
      {
        user: "Sonia",
        text: "Hampta Pass offers the best of both worlds: lush green valleys and stark deserts.",
        photos: ["/src/assets/hampta.jpg"],
        likes: 6,
        likedBy: [],
        comments: [
          { user: "Aman", text: "Beautiful contrast!" }
        ]
      }
    ]
  },
  {
    name: "Kuari Pass",
    description: "Spectacular views of Nanda Devi and surrounding peaks",
    image: "/src/assets/kuari.jpg",
    experiences: [
      {
        user: "Vikas",
        text: "The views of Nanda Devi from Kuari Pass are unforgettable.",
        photos: ["/src/assets/kuari.jpg"],
        likes: 4,
        likedBy: [],
        comments: [
          { user: "Meera", text: "Stunning!" }
        ]
      }
    ]
  },
  {
    name: "Everest Base Camp",
    description: "The ultimate trekking experience at the base of the world's highest peak",
    image: "/src/assets/EBC.jpg",
    experiences: [
      {
        user: "Arjun",
        text: "Standing at the base of Everest is a feeling like no other. The journey is tough but worth every step.",
        photos: ["/src/assets/EBC.jpg"],
        likes: 10,
        likedBy: [],
        comments: [
          { user: "Riya", text: "Incredible achievement!" }
        ]
      }
    ]
  },
  {
    name: "Bhrigu Lake",
    description: "A high-altitude lake trek with magical mountain reflections",
    image: "/src/assets/bhrigu.jpg",
    experiences: [
      {
        user: "Kiran",
        text: "Bhrigu Lake was still partially frozen when we visited. The reflection of the mountains was magical.",
        photos: ["/src/assets/bhrigu.jpg"],
        likes: 2,
        likedBy: [],
        comments: [
          { user: "Sahil", text: "Looks so peaceful!" }
        ]
      }
    ]
  },
  {
    name: "Gaumukh Tapovan",
    description: "Spiritual trek to the source of the Ganges",
    image: "/src/assets/gaumukh.jpg",
    experiences: [
      {
        user: "Deepa",
        text: "The trek to Gaumukh Tapovan is spiritual and scenic. The sight of the Bhagirathi peaks is awe-inspiring.",
        photos: ["/src/assets/gaumukh.jpg"],
        likes: 3,
        likedBy: [],
        comments: [
          { user: "Manoj", text: "Must do for every trekker!" }
        ]
      }
    ]
  },
  {
    name: "Har ki Dun",
    description: "Valley of gods with picture-perfect meadows and streams",
    image: "/src/assets/har.jpg",
    experiences: [
      {
        user: "Priya",
        text: "Har ki Dun is a valley of gods. The meadows and streams are picture perfect.",
        photos: ["/src/assets/har.jpg"],
        likes: 5,
        likedBy: [],
        comments: [
          { user: "Amit", text: "Adding to my list!" }
        ]
      }
    ]
  },
  {
    name: "Markha Valley",
    description: "Journey through the heart of Ladakh with otherworldly landscapes",
    image: "/src/assets/markha.jpg",
    experiences: [
      {
        user: "Rachit",
        text: "Markha Valley trek is a journey through Ladakh's heart. The landscapes are out of this world.",
        photos: ["/src/assets/markha.jpg"],
        likes: 7,
        likedBy: [],
        comments: [
          { user: "Sonia", text: "Ladakh is calling!" }
        ]
      }
    ]
  },
  {
    name: "Chandratal",
    description: "The most beautiful high-altitude lake with mesmerizing blue water",
    image: "/src/assets/moon.jpg",
    experiences: [
      {
        user: "Simran",
        text: "Chandratal Lake is the most beautiful high-altitude lake I've ever seen. The blue water is mesmerizing.",
        photos: ["/src/assets/moon.jpg"],
        likes: 6,
        likedBy: [],
        comments: [
          { user: "Arjun", text: "Wow, what a view!" }
        ]
      }
    ]
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing treks
    await Trek.deleteMany({});
    console.log('Cleared existing treks');

    // Insert sample treks
    const insertedTreks = await Trek.insertMany(sampleTreks);
    console.log(`Added ${insertedTreks.length} sample treks to the database`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase(); 