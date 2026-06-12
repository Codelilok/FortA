import bcrypt from "bcryptjs";
import { db, projectsTable, galleryTable, teamMembersTable, servicesTable, socialLinksTable, companyInfoTable, adminsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Company info
  const existingCompany = await db.select().from(companyInfoTable).limit(1);
  if (existingCompany.length === 0) {
    await db.insert(companyInfoTable).values({
      companyName: "Forth Architecture Consulting & Construction Ltd",
      slogan: "Building Visions, Crafting Excellence",
      about: "Forth Architecture Consulting & Construction Ltd is a premier architecture and construction firm with over 15 years of experience delivering exceptional design solutions across Ghana and West Africa. We combine innovative design thinking with technical expertise to create spaces that inspire, function beautifully, and stand the test of time.\n\nOur multidisciplinary team of architects, engineers, and project managers work collaboratively with clients to bring their vision to life — from concept to completion. We believe that great architecture should not only be visually stunning but also sustainable, culturally responsive, and deeply connected to its environment.",
      mission: "To deliver innovative, sustainable architectural solutions that exceed client expectations, enrich communities, and set new standards of excellence in design and construction.",
      vision: "To be the most trusted and celebrated architecture and construction firm in West Africa, recognized for transforming spaces and improving lives through the power of exceptional design.",
      values: "Integrity — We operate with transparency and honesty in every project. Innovation — We embrace creativity and cutting-edge solutions. Excellence — We pursue the highest standards in all we do. Collaboration — We build strong partnerships with our clients and communities. Sustainability — We design with the future in mind.",
      phone: "+233 30 200 0000",
      email: "info@fortharchitecture.com",
      address: "15 Independence Avenue, Accra, Ghana",
      whatsapp: "+233 55 000 0000",
    });
    console.log("✓ Company info seeded");
  }

  // Services
  const existingServices = await db.select().from(servicesTable).limit(1);
  if (existingServices.length === 0) {
    await db.insert(servicesTable).values([
      {
        title: "Architectural Design",
        description: "From concept sketches to detailed construction drawings, we provide comprehensive architectural design services for residential, commercial, and institutional projects. Our designs balance aesthetics with functionality, creating spaces that inspire and endure.",
        icon: "Building2",
        sortOrder: 1,
      },
      {
        title: "Interior Design",
        description: "We create interior environments that reflect your brand, personality, and lifestyle. Our interior design team combines spatial planning, material selection, lighting design, and furniture curation to craft interiors that are both beautiful and livable.",
        icon: "Sofa",
        sortOrder: 2,
      },
      {
        title: "Construction Management",
        description: "Our experienced project managers oversee every aspect of your build — from procurement and scheduling to quality control and safety. We ensure projects are delivered on time, within budget, and to the highest quality standards.",
        icon: "HardHat",
        sortOrder: 3,
      },
      {
        title: "Urban Planning",
        description: "We help shape the future of communities through thoughtful urban planning and master planning services. Our urban designers work with local governments and developers to create livable, sustainable, and vibrant urban environments.",
        icon: "Map",
        sortOrder: 4,
      },
      {
        title: "Feasibility Studies",
        description: "Before you commit resources to a project, we conduct thorough feasibility studies to assess technical, financial, and regulatory viability. Our reports give you the clarity and confidence to make informed investment decisions.",
        icon: "BarChart3",
        sortOrder: 5,
      },
      {
        title: "Sustainable Design",
        description: "We are committed to environmentally responsible design. Our sustainable design services include passive cooling strategies, solar integration, rainwater harvesting, green roofs, and LEED-aligned design principles — creating buildings that are good for people and the planet.",
        icon: "Leaf",
        sortOrder: 6,
      },
    ]);
    console.log("✓ Services seeded");
  }

  // Team members
  const existingTeam = await db.select().from(teamMembersTable).limit(1);
  if (existingTeam.length === 0) {
    await db.insert(teamMembersTable).values([
      {
        name: "Kwame Asante",
        position: "Principal Architect & CEO",
        bio: "Kwame founded Forth Architecture with a vision to transform Ghana's built environment through innovative, sustainable design. With a Master's degree from the Architectural Association in London and over 20 years of practice, he has led landmark projects across West Africa.",
        email: "k.asante@fortharchitecture.com",
        linkedinUrl: "https://linkedin.com",
        sortOrder: 1,
      },
      {
        name: "Abena Mensah",
        position: "Head of Design",
        bio: "Abena brings a unique blend of African vernacular tradition and contemporary design sensibility to every project. Her portfolio spans luxury residential developments, hospitality projects, and cultural institutions across the continent.",
        email: "a.mensah@fortharchitecture.com",
        linkedinUrl: "https://linkedin.com",
        sortOrder: 2,
      },
      {
        name: "Emmanuel Boateng",
        position: "Construction Director",
        bio: "Emmanuel oversees all construction operations with a meticulous focus on quality, safety, and delivery. His engineering background and 15 years of site management experience ensure every project is built to the highest standards.",
        email: "e.boateng@fortharchitecture.com",
        sortOrder: 3,
      },
      {
        name: "Akosua Darko",
        position: "Interior Design Lead",
        bio: "Akosua transforms spaces with her intuitive understanding of how people live and work. Her designs layer texture, light, and material to create interiors that feel both refined and deeply personal.",
        email: "a.darko@fortharchitecture.com",
        linkedinUrl: "https://linkedin.com",
        sortOrder: 4,
      },
      {
        name: "Kofi Amponsah",
        position: "Senior Urban Planner",
        bio: "Kofi specializes in urban design and master planning for large-scale mixed-use developments. He works closely with government agencies and private developers to create city environments that are sustainable, equitable, and economically vibrant.",
        email: "k.amponsah@fortharchitecture.com",
        sortOrder: 5,
      },
      {
        name: "Ama Owusu",
        position: "Project Manager",
        bio: "Ama's exceptional organizational skills and client-focused approach ensure that every project runs smoothly from inception to handover. She coordinates cross-functional teams and manages stakeholder relationships with precision and care.",
        email: "a.owusu@fortharchitecture.com",
        sortOrder: 6,
      },
    ]);
    console.log("✓ Team members seeded");
  }

  // Projects
  const existingProjects = await db.select().from(projectsTable).limit(1);
  if (existingProjects.length === 0) {
    await db.insert(projectsTable).values([
      {
        title: "Accra Executive Towers",
        description: "A landmark 28-storey mixed-use tower in the heart of Accra's CBD. Featuring Class-A office floors, luxury apartments on the upper levels, and a vibrant retail podium, this project redefines the city's skyline with its elegant curtain-wall façade and rooftop sky garden.",
        location: "Accra Central, Ghana",
        completionDate: "2023",
        category: "Commercial",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Labadi Beach Residences",
        description: "An exclusive beachfront residential development comprising 12 luxury villas and 24 premium apartments. The design takes inspiration from coastal vernacular architecture, incorporating natural materials, generous terraces, and views of the Atlantic Ocean.",
        location: "Labadi, Accra, Ghana",
        completionDate: "2022",
        category: "Residential",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Kumasi Cultural Centre",
        description: "A landmark cultural centre celebrating Ashanti heritage through contemporary architectural expression. The building houses a museum, performance hall, craft market, and community galleries, creating a vibrant hub for arts and culture in Ghana's second city.",
        location: "Kumasi, Ghana",
        completionDate: "2024",
        category: "Cultural",
        featured: true,
        sortOrder: 3,
      },
      {
        title: "Independence Avenue Corporate Campus",
        description: "A 5-building corporate campus designed for a major Ghanaian conglomerate. The interconnected buildings create a cohesive campus identity while allowing each structure to express its own character. Sustainable features include solar panels, rainwater harvesting, and extensive green space.",
        location: "Accra, Ghana",
        completionDate: "2023",
        category: "Commercial",
        featured: false,
        sortOrder: 4,
      },
      {
        title: "East Legon Villa",
        description: "A bespoke private residence for a prominent Ghanaian family, designed around a central courtyard garden. The home blends modernist principles with Ghanaian spatial traditions — generous verandahs, shaded walkways, and indoor-outdoor living spaces.",
        location: "East Legon, Accra, Ghana",
        completionDate: "2022",
        category: "Residential",
        featured: false,
        sortOrder: 5,
      },
      {
        title: "Takoradi Port Authority Headquarters",
        description: "The new headquarters for the Takoradi Port Authority, designed to reflect the port's significance as a national economic gateway. The building's wave-form façade references the maritime environment while its interiors provide state-of-the-art working environments.",
        location: "Takoradi, Ghana",
        completionDate: "2021",
        category: "Institutional",
        featured: false,
        sortOrder: 6,
      },
    ]);
    console.log("✓ Projects seeded");
  }

  // Gallery
  const existingGallery = await db.select().from(galleryTable).limit(1);
  if (existingGallery.length === 0) {
    await db.insert(galleryTable).values([
      { title: "Accra Towers — Lobby", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", sortOrder: 1 },
      { title: "Coastal Residence", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", sortOrder: 2 },
      { title: "Cultural Centre — Atrium", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", sortOrder: 3 },
      { title: "Corporate Campus Aerial", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800", sortOrder: 4 },
      { title: "Executive Suite Interior", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800", sortOrder: 5 },
      { title: "Luxury Villa Pool", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", sortOrder: 6 },
      { title: "Port Authority — Façade", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800", sortOrder: 7 },
      { title: "Conference Room", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800", sortOrder: 8 },
      { title: "Residential Courtyard", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", sortOrder: 9 },
      { title: "Museum Gallery Space", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=800", sortOrder: 10 },
      { title: "Rooftop Garden", category: "Exterior", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", sortOrder: 11 },
      { title: "Open Plan Office", category: "Interior", imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800", sortOrder: 12 },
    ]);
    console.log("✓ Gallery seeded");
  }

  // Social links
  const existingSocial = await db.select().from(socialLinksTable).limit(1);
  if (existingSocial.length === 0) {
    await db.insert(socialLinksTable).values([
      { platform: "instagram", url: "https://instagram.com/fortharchitecture" },
      { platform: "linkedin", url: "https://linkedin.com/company/fortharchitecture" },
      { platform: "twitter", url: "https://twitter.com/fortharchitect" },
      { platform: "facebook", url: "https://facebook.com/fortharchitecture" },
    ]);
    console.log("✓ Social links seeded");
  }

  // Admin user
  const existingAdmin = await db.select().from(adminsTable).limit(1);
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash("Fortharcitecture@12", 10);
    await db.insert(adminsTable).values({ username: "fortharchitecture", passwordHash });
    console.log("✓ Admin user seeded — username: fortharchitecture / password: Fortharcitecture@12");
  } else {
    console.log("✓ Admin user already exists");
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
