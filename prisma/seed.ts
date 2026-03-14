import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const defaultPassword = "password"

async function main() {
  const hash = await bcrypt.hash(defaultPassword, 10)

  const user1 = await prisma.user.upsert({
    where: { email: "aidar@nis.edu.kz" },
    update: {},
    create: {
      email: "aidar@nis.edu.kz",
      passwordHash: hash,
      name: "Айдар Нурланов",
      role: "admin",
      grade: "11A",
      phone: "+7 777 123 4567",
      bio: "Администратор платформы NIS CLUBS",
    },
  })
  const user2 = await prisma.user.upsert({
    where: { email: "alina@nis.edu.kz" },
    update: {},
    create: {
      email: "alina@nis.edu.kz",
      passwordHash: hash,
      name: "Алина Сериккызы",
      role: "owner",
      grade: "10B",
      phone: "+7 777 234 5678",
      bio: "Основатель клуба робототехники",
    },
  })
  const user3 = await prisma.user.upsert({
    where: { email: "daniyar@nis.edu.kz" },
    update: {},
    create: {
      email: "daniyar@nis.edu.kz",
      passwordHash: hash,
      name: "Данияр Асанов",
      role: "student",
      grade: "9C",
      phone: "+7 777 345 6789",
    },
  })

  const club1 = await prisma.club.upsert({
    where: { id: "club-1" },
    update: {},
    create: {
      id: "club-1",
      name: "Клуб робототехники",
      description:
        "Изучаем основы робототехники, программирования и инженерии. Участвуем в соревнованиях и создаем собственные проекты. Подходит для всех уровней подготовки.",
      shortDescription: "Робототехника, программирование и участие в соревнованиях",
      coverImage: "/robotics-club-students-working.jpg",
      photos: JSON.stringify(["/robotics-competition.png", "/students-building-robots.jpg", "/robot-programming.jpg"]),
      schedule: JSON.stringify([
        { day: "Понедельник", time: "15:00-17:00", room: "Каб. 205" },
        { day: "Среда", time: "15:00-17:00", room: "Каб. 205" },
        { day: "Пятница", time: "16:00-18:00", room: "Каб. 205" },
      ]),
      links: JSON.stringify({ telegram: "https://t.me/nisrobotics", whatsapp: "https://wa.me/77771234567" }),
      city: "Кызылорда",
      memberCount: 24,
      categories: JSON.stringify(["Технологии", "STEM"]),
    },
  })
  const club2 = await prisma.club.upsert({
    where: { id: "club-2" },
    update: {},
    create: {
      id: "club-2",
      name: "Дебатный клуб",
      description:
        "Развиваем навыки публичных выступлений, критического мышления и аргументации. Участвуем в турнирах по дебатам на казахском, русском и английском языках.",
      shortDescription: "Публичные выступления и участие в турнирах",
      coverImage: "/debate-club-students-speaking.jpg",
      photos: JSON.stringify(["/debate-tournament.jpg", "/students-debating.jpg"]),
      schedule: JSON.stringify([
        { day: "Вторник", time: "16:00-18:00", room: "Актовый зал" },
        { day: "Четверг", time: "16:00-18:00", room: "Актовый зал" },
      ]),
      links: JSON.stringify({ telegram: "https://t.me/nisdebate" }),
      city: "Астана",
      memberCount: 18,
      categories: JSON.stringify(["Образование", "Коммуникация"]),
    },
  })
  const club3 = await prisma.club.upsert({
    where: { id: "club-3" },
    update: {},
    create: {
      id: "club-3",
      name: "Художественная студия",
      description:
        "Занимаемся живописью, графикой, скульптурой и другими видами изобразительного искусства. Организуем выставки и участвуем в конкурсах.",
      shortDescription: "Живопись, графика и участие в выставках",
      coverImage: "/art-studio-students-painting.jpg",
      photos: JSON.stringify(["/art-exhibition.png", "/students-painting.jpg", "/vibrant-art-gallery.png"]),
      schedule: JSON.stringify([
        { day: "Среда", time: "14:00-16:00", room: "Каб. 101" },
        { day: "Суббота", time: "10:00-13:00", room: "Каб. 101" },
      ]),
      links: JSON.stringify({ telegram: "https://t.me/nisart", website: "https://nisart.example.com" }),
      city: "Алматы",
      memberCount: 15,
      categories: JSON.stringify(["Искусство", "Творчество"]),
    },
  })

  await prisma.clubOwner.createMany({
    data: [
      { clubId: club1.id, userId: user2.id },
      { clubId: club2.id, userId: user3.id },
      { clubId: club3.id, userId: user2.id },
    ],
  })
  await prisma.clubMember.createMany({
    data: [
      { clubId: club1.id, userId: user1.id },
      { clubId: club1.id, userId: user2.id },
      { clubId: club1.id, userId: user3.id },
      { clubId: club2.id, userId: user1.id },
      { clubId: club2.id, userId: user3.id },
      { clubId: club3.id, userId: user2.id },
      { clubId: club3.id, userId: user3.id },
    ],
  })

  const ann1 = await prisma.announcement.create({
    data: {
      clubId: club1.id,
      title: "Соревнования по робототехнике",
      content:
        "Приглашаем всех участников клуба на региональные соревнования по робототехнике, которые пройдут 15 ноября. Регистрация до 1 ноября!",
      image: "/robotics-competition-poster.jpg",
      authorId: user2.id,
      createdAt: new Date("2024-10-20"),
    },
  })
  await prisma.comment.create({
    data: {
      announcementId: ann1.id,
      userId: user1.id,
      content: "Отличная новость! Обязательно участвуем!",
      createdAt: new Date("2024-10-21"),
    },
  })
  await prisma.announcementLike.createMany({
    data: [
      { announcementId: ann1.id, userId: user1.id },
      { announcementId: ann1.id, userId: user3.id },
    ],
  })

  await prisma.announcement.create({
    data: {
      clubId: club1.id,
      title: "Новый проект: Умный дом",
      content:
        "Начинаем работу над новым проектом - создание системы умного дома. Первое занятие состоится в эту среду.",
      image: "/smart-home-technology.png",
      authorId: user2.id,
      createdAt: new Date("2024-10-15"),
    },
  })
  await prisma.announcement.create({
    data: {
      clubId: club2.id,
      title: "Турнир по дебатам",
      content: "Приглашаем на школьный турнир по дебатам. Тема: 'Искусственный интеллект в образовании'",
      image: "/debate-tournament.jpg",
      authorId: user3.id,
      createdAt: new Date("2024-10-18"),
    },
  })

  await prisma.achievement.createMany({
    data: [
      { clubId: club1.id, title: "1 место на региональной олимпиаде", description: "Наша команда заняла первое место на региональной олимпиаде по робототехнике", date: "2024-09-15", image: "/robotics-competition.png", icon: "🏆" },
      { clubId: club1.id, title: "Грант на развитие проекта", description: "Получили грант в размере 500,000 тенге на развитие проекта 'Умный дом'", date: "2024-08-20", icon: "💰" },
      { clubId: club2.id, title: "Победа в национальном турнире", description: "Команда дебатного клуба победила в национальном турнире среди школ НИШ", date: "2024-09-10", image: "/debate-tournament.jpg", icon: "🥇" },
      { clubId: club3.id, title: "Выставка в городском музее", description: "Работы наших учеников были представлены на выставке в городском музее искусств", date: "2024-10-01", image: "/art-exhibition.png", icon: "🎨" },
    ],
  })

  await prisma.clubRequest.create({
    data: {
      applicantId: user3.id,
      clubName: "Клуб шахмат",
      description: "Клуб для любителей шахмат всех уровней",
      goals: "Развитие логического мышления и участие в турнирах",
      schedule: JSON.stringify([
        { day: "Понедельник", time: "15:00-17:00", room: "Каб. 301" },
        { day: "Пятница", time: "15:00-17:00", room: "Каб. 301" },
      ]),
      curator: "Иванов И.И.",
      contacts: "+7 777 999 8888",
      status: "pending",
      createdAt: new Date("2024-10-25"),
    },
  })

  await prisma.community.createMany({
    data: [
      { name: "Kyzylorda Hub Community", description: "Сообщество в Кызылорде, где выкладывают мероприятия, собираются люди с идеями для стартапов и общаются ради новых знакомств и совместных проектов. Здесь вы найдете единомышленников для реализации своих идей!", link: "https://chat.whatsapp.com/F84l7qcGFbWKDoQMTjY9zw", icon: "🚀", platform: "WhatsApp", memberCount: 458 },
      { name: "Kyzylorda Hub Community", description: "Telegram-канал сообщества Kyzylorda Hub. Обсуждаем стартапы, делимся идеями и находим команду для совместных проектов.", link: "https://t.me/kyzylordahub", icon: "🚀", platform: "Telegram", memberCount: 462 },
      { name: "NIS Общее сообщество", description: "Главный канал школы для всех учеников", link: "https://t.me/niscommunity", icon: "🏫", platform: "Telegram", memberCount: 320 },
      { name: "NIS Спорт", description: "Спортивные мероприятия и новости", link: "https://t.me/nissport", icon: "⚽", platform: "Telegram", memberCount: 185 },
      { name: "NIS Наука", description: "Научные проекты и олимпиады", link: "https://t.me/nisscience", icon: "🔬", platform: "Telegram", memberCount: 210 },
    ],
  })

  console.log("Seed completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
