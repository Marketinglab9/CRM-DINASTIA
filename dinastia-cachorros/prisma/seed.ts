import { PrismaClient, Role, Sex, PetStatus, InterestLevel, LeadStatus, BannerTarget, VaccinationStatus, SaleStatus, PaymentStatus, DeliveryMethod, DeliveryStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@dinastiacachorros.com',
      phone: '+57 300 123 4567',
      role: Role.ADMIN,
      passwordHash: await hash('admin123', 12),
      isActive: true,
    },
  })

  // Create Advisor Users
  const advisor1User = await prisma.user.create({
    data: {
      name: 'María García',
      email: 'maria@dinastiacachorros.com',
      phone: '+57 300 234 5678',
      role: Role.ADVISOR,
      passwordHash: await hash('advisor123', 12),
      isActive: true,
    },
  })

  const advisor2User = await prisma.user.create({
    data: {
      name: 'Carlos Rodríguez',
      email: 'carlos@dinastiacachorros.com',
      phone: '+57 300 345 6789',
      role: Role.ADVISOR,
      passwordHash: await hash('advisor123', 12),
      isActive: true,
    },
  })

  // Create Advisor profiles
  const advisor1 = await prisma.advisor.create({
    data: {
      userId: advisor1User.id,
      code: 'ADV001',
    },
  })

  const advisor2 = await prisma.advisor.create({
    data: {
      userId: advisor2User.id,
      code: 'ADV002',
    },
  })

  // Create Client Users
  const clientUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        phone: '+57 300 456 7890',
        role: Role.CLIENT,
        passwordHash: await hash('client123', 12),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Martínez',
        email: 'pedro.martinez@email.com',
        phone: '+57 300 567 8901',
        role: Role.CLIENT,
        passwordHash: await hash('client123', 12),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Laura Sánchez',
        email: 'laura.sanchez@email.com',
        phone: '+57 300 678 9012',
        role: Role.CLIENT,
        passwordHash: await hash('client123', 12),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jorge Ramírez',
        email: 'jorge.ramirez@email.com',
        phone: '+57 300 789 0123',
        role: Role.CLIENT,
        passwordHash: await hash('client123', 12),
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carmen Díaz',
        email: 'carmen.diaz@email.com',
        phone: '+57 300 890 1234',
        role: Role.CLIENT,
        passwordHash: await hash('client123', 12),
        isActive: true,
      },
    }),
  ])

  // Create Client profiles
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: clientUsers[0].id,
        documentId: '1234567890',
        city: 'Bogotá',
        address: 'Calle 123 #45-67',
        notes: 'Cliente VIP, muy interesado en Golden Retriever',
      },
    }),
    prisma.client.create({
      data: {
        userId: clientUsers[1].id,
        documentId: '2345678901',
        city: 'Medellín',
        address: 'Carrera 70 #52-31',
        notes: 'Busca cachorro para apartamento',
      },
    }),
    prisma.client.create({
      data: {
        userId: clientUsers[2].id,
        documentId: '3456789012',
        city: 'Cali',
        address: 'Avenida 6N #25-30',
        notes: 'Primera mascota, necesita asesoría',
      },
    }),
    prisma.client.create({
      data: {
        userId: clientUsers[3].id,
        documentId: '4567890123',
        city: 'Barranquilla',
        address: 'Calle 84 #51-45',
        notes: 'Cliente frecuente',
      },
    }),
    prisma.client.create({
      data: {
        userId: clientUsers[4].id,
        documentId: '5678901234',
        city: 'Bucaramanga',
        address: 'Carrera 33 #42-18',
        notes: 'Interesada en razas pequeñas',
      },
    }),
  ])

  // Create Breeds
  const breeds = await Promise.all([
    prisma.breed.create({ data: { name: 'Golden Retriever' } }),
    prisma.breed.create({ data: { name: 'Labrador' } }),
    prisma.breed.create({ data: { name: 'Bulldog Francés' } }),
    prisma.breed.create({ data: { name: 'Pastor Alemán' } }),
    prisma.breed.create({ data: { name: 'Poodle' } }),
    prisma.breed.create({ data: { name: 'Husky Siberiano' } }),
  ])

  // Create Vaccines
  const vaccines = await Promise.all([
    prisma.vaccine.create({
      data: {
        name: 'Primera Vacuna (DHPP)',
        description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza',
        offsetWeeks: 6,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Segunda Vacuna (DHPP)',
        description: 'Refuerzo de DHPP',
        offsetWeeks: 9,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Tercera Vacuna (DHPP)',
        description: 'Segundo refuerzo de DHPP',
        offsetWeeks: 12,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Vacuna Antirrábica',
        description: 'Vacuna contra la rabia',
        offsetWeeks: 16,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Refuerzo Anual DHPP',
        description: 'Refuerzo anual de DHPP',
        offsetWeeks: 52,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Refuerzo Antirrábica',
        description: 'Refuerzo anual antirrábica',
        offsetWeeks: 68,
      },
    }),
  ])

  // Create Pets
  const pets = await Promise.all([
    prisma.pet.create({
      data: {
        name: 'Max',
        breedId: breeds[0].id, // Golden Retriever
        color: 'Dorado',
        sex: Sex.MALE,
        birthDate: new Date('2024-01-15'),
        photoUrl: '/images/pets/max.jpg',
        price: 2500000,
        status: PetStatus.AVAILABLE,
        notes: 'Cachorro muy juguetón y sociable',
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Luna',
        breedId: breeds[1].id, // Labrador
        color: 'Chocolate',
        sex: Sex.FEMALE,
        birthDate: new Date('2024-02-01'),
        photoUrl: '/images/pets/luna.jpg',
        price: 2200000,
        status: PetStatus.RESERVED,
        notes: 'Muy inteligente y obediente',
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Rocky',
        breedId: breeds[2].id, // Bulldog Francés
        color: 'Atigrado',
        sex: Sex.MALE,
        birthDate: new Date('2024-01-20'),
        photoUrl: '/images/pets/rocky.jpg',
        price: 3500000,
        status: PetStatus.SOLD,
        notes: 'Perfecto para apartamento',
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Bella',
        breedId: breeds[3].id, // Pastor Alemán
        color: 'Negro y Fuego',
        sex: Sex.FEMALE,
        birthDate: new Date('2024-01-10'),
        photoUrl: '/images/pets/bella.jpg',
        price: 2800000,
        status: PetStatus.DELIVERED,
        notes: 'Excelente para guardia y compañía',
      },
    }),
    prisma.pet.create({
      data: {
        name: 'Coco',
        breedId: breeds[4].id, // Poodle
        color: 'Blanco',
        sex: Sex.FEMALE,
        birthDate: new Date('2024-02-10'),
        photoUrl: '/images/pets/coco.jpg',
        price: 1800000,
        status: PetStatus.AVAILABLE,
        notes: 'Hipoalergénico, ideal para niños',
      },
    }),
  ])

  // Create Leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Sofía Herrera',
        email: 'sofia.herrera@email.com',
        phone: '+57 300 111 2222',
        city: 'Bogotá',
        source: 'Instagram',
        interestBreedId: breeds[0].id,
        interestLevel: InterestLevel.HOT,
        status: LeadStatus.NEW,
        nextContactAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        advisorId: advisor1User.id,
        notes: 'Muy interesada, busca cachorro para regalo',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Miguel Torres',
        email: 'miguel.torres@email.com',
        phone: '+57 300 222 3333',
        city: 'Medellín',
        source: 'Facebook',
        interestBreedId: breeds[1].id,
        interestLevel: InterestLevel.WARM,
        status: LeadStatus.CONTACTED,
        nextContactAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        advisorId: advisor2User.id,
        notes: 'Necesita tiempo para decidir',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Isabella Castro',
        email: 'isabella.castro@email.com',
        phone: '+57 300 333 4444',
        city: 'Cali',
        source: 'Google',
        interestBreedId: breeds[2].id,
        interestLevel: InterestLevel.HOT,
        status: LeadStatus.QUALIFIED,
        nextContactAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In a week
        advisorId: advisor1User.id,
        notes: 'Lista para comprar, esperando disponibilidad',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Andrés Morales',
        email: 'andres.morales@email.com',
        phone: '+57 300 444 5555',
        city: 'Barranquilla',
        source: 'Referido',
        interestLevel: InterestLevel.COLD,
        status: LeadStatus.NEW,
        nextContactAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
        advisorId: advisor2User.id,
        notes: 'Solo está explorando opciones',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Valentina Ruiz',
        email: 'valentina.ruiz@email.com',
        phone: '+57 300 555 6666',
        city: 'Bucaramanga',
        source: 'WhatsApp',
        interestBreedId: breeds[4].id,
        interestLevel: InterestLevel.WARM,
        status: LeadStatus.CONTACTED,
        nextContactAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        advisorId: advisor1User.id,
        notes: 'Interesada en Poodle miniatura',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Ricardo Jiménez',
        email: 'ricardo.jimenez@email.com',
        phone: '+57 300 666 7777',
        city: 'Pereira',
        source: 'Instagram',
        interestBreedId: breeds[3].id,
        interestLevel: InterestLevel.HOT,
        status: LeadStatus.CONVERTED,
        advisorId: advisor2User.id,
        notes: 'Convertido exitosamente a venta',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Camila Vega',
        email: 'camila.vega@email.com',
        phone: '+57 300 777 8888',
        city: 'Manizales',
        source: 'Facebook',
        interestBreedId: breeds[5].id,
        interestLevel: InterestLevel.COLD,
        status: LeadStatus.LOST,
        advisorId: advisor1User.id,
        notes: 'No pudo permitirse el precio',
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Sebastián Vargas',
        email: 'sebastian.vargas@email.com',
        phone: '+57 300 888 9999',
        city: 'Cartagena',
        source: 'Google',
        interestBreedId: breeds[0].id,
        interestLevel: InterestLevel.WARM,
        status: LeadStatus.QUALIFIED,
        nextContactAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // In 4 days
        advisorId: advisor2User.id,
        notes: 'Muy prometedor, familia con niños',
      },
    }),
  ])

  // Create sample sales and invoices for client demo
  const sale1 = await prisma.sale.create({
    data: {
      clientId: clients[0].id, // Ana López
      petId: pets[0].id, // Max (Golden Retriever)
      advisorId: advisor1User.id,
      price: 2500000, // 2.5M COP
      saleDate: new Date('2024-02-15'),
      status: SaleStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
    },
  })

  const invoice1 = await prisma.invoice.create({
    data: {
      saleId: sale1.id,
      number: 'DIN1001',
      subtotal: 2100420, // 2.5M - IVA
      taxes: 399580, // 19% IVA
      total: 2500000,
      issuedAt: new Date('2024-02-15'),
      sentAt: new Date('2024-02-15'),
      pdfUrl: '/invoices/DIN1001.pdf',
    },
  })

  // Update sale with invoice reference
  await prisma.sale.update({
    where: { id: sale1.id },
    data: { invoiceId: invoice1.id },
  })

  // Create delivery for the sale
  const delivery1 = await prisma.delivery.create({
    data: {
      saleId: sale1.id,
      estimatedDate: new Date('2024-02-20'),
      method: DeliveryMethod.PICKUP,
      status: DeliveryStatus.COMPLETED,
      address: 'Calle 123 #45-67, Bogotá',
      notes: 'Entrega exitosa. Cliente muy satisfecho.',
    },
  })

  // Create pet vaccinations for the delivered pet
  const petVaccinations = await Promise.all([
    prisma.petVaccination.create({
      data: {
        petId: pets[0].id, // Max
        vaccineId: vaccines[0].id, // First vaccine
        scheduledDate: new Date('2024-03-01'),
        status: VaccinationStatus.DONE,
        completedDate: new Date('2024-03-01'),
        notes: 'Primera vacuna aplicada correctamente',
      },
    }),
    prisma.petVaccination.create({
      data: {
        petId: pets[0].id, // Max
        vaccineId: vaccines[1].id, // Second vaccine
        scheduledDate: new Date('2024-03-15'),
        status: VaccinationStatus.DONE,
        completedDate: new Date('2024-03-15'),
        notes: 'Segunda dosis aplicada',
      },
    }),
    prisma.petVaccination.create({
      data: {
        petId: pets[0].id, // Max
        vaccineId: vaccines[2].id, // Third vaccine
        scheduledDate: new Date('2024-04-01'),
        status: VaccinationStatus.DUE,
        notes: 'Próxima vacuna programada',
      },
    }),
    prisma.petVaccination.create({
      data: {
        petId: pets[0].id, // Max
        vaccineId: vaccines[3].id, // Fourth vaccine
        scheduledDate: new Date('2024-12-25'),
        status: VaccinationStatus.DUE,
        notes: 'Refuerzo anual',
      },
    }),
  ])

  // Create Banners
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: '¡Nuevos Cachorros Disponibles!',
        body: 'Tenemos hermosos cachorros Golden Retriever y Labrador listos para entrega. ¡Contáctanos ahora!',
        imageUrl: '/images/banners/nuevos-cachorros.jpg',
        linkUrl: '/cachorros',
        target: BannerTarget.ALL,
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Programa de Vacunación Completo',
        body: 'Todos nuestros cachorros incluyen el programa completo de vacunación y desparasitación.',
        imageUrl: '/images/banners/vacunacion.jpg',
        target: BannerTarget.CLIENTS,
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Meta de Ventas del Mes',
        body: 'Estamos a solo 3 ventas de alcanzar nuestra meta mensual. ¡Sigamos así!',
        target: BannerTarget.ADVISORS,
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Descuento Especial Fin de Mes',
        body: 'Aprovecha nuestro descuento especial del 10% en cachorros seleccionados hasta fin de mes.',
        imageUrl: '/images/banners/descuento.jpg',
        linkUrl: '/promociones',
        target: BannerTarget.ALL,
        activeFrom: new Date(),
        activeTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        isActive: true,
      },
    }),
  ])

  console.log('✅ Seed completed successfully!')
  console.log(`📧 Admin user: admin@dinastiacachorros.com / admin123`)
  console.log(`📧 Advisor 1: maria@dinastiacachorros.com / advisor123`)
  console.log(`📧 Advisor 2: carlos@dinastiacachorros.com / advisor123`)
  console.log(`📧 Client example: ana.lopez@email.com / client123`)
  console.log(`🐕 Created ${breeds.length} breeds`)
  console.log(`🐶 Created ${pets.length} pets`)
  console.log(`👥 Created ${leads.length} leads`)
  console.log(`💉 Created ${vaccines.length} vaccines`)
  console.log(`📢 Created ${banners.length} banners`)
  console.log(`💰 Created 1 sale with invoice and delivery`)
  console.log(`🏥 Created ${petVaccinations.length} pet vaccinations`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })