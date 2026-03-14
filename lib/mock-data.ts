import type { User, Club, Announcement, ClubRequest, Community, Achievement } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Айдар Нурланов",
    email: "aidar@nis.edu.kz",
    role: "admin",
    grade: "11A",
    phone: "+7 777 123 4567",
    bio: "Администратор платформы NIS CLUBS",
    clubMemberships: ["1", "2"],
    ownedClubs: [],
  },
  {
    id: "2",
    name: "Алина Сериккызы",
    email: "alina@nis.edu.kz",
    role: "owner",
    grade: "10B",
    phone: "+7 777 234 5678",
    bio: "Основатель клуба робототехники",
    clubMemberships: ["1", "3"],
    ownedClubs: ["1"],
  },
  {
    id: "3",
    name: "Данияр Асанов",
    email: "daniyar@nis.edu.kz",
    role: "student",
    grade: "9C",
    phone: "+7 777 345 6789",
    clubMemberships: ["2", "3"],
    ownedClubs: [],
  },
]

export const mockClubs: Club[] = [
  {
    id: "1",
    name: "Клуб робототехники",
    description:
      "Изучаем основы робототехники, программирования и инженерии. Участвуем в соревнованиях и создаем собственные проекты. Подходит для всех уровней подготовки.",
    shortDescription: "Робототехника, программирование и участие в соревнованиях",
    coverImage: "/robotics-club-students-working.jpg",
    photos: ["/robotics-competition.png", "/students-building-robots.jpg", "/robot-programming.jpg"],
    schedule: [
      { day: "Понедельник", time: "15:00-17:00", room: "Каб. 205" },
      { day: "Среда", time: "15:00-17:00", room: "Каб. 205" },
      { day: "Пятница", time: "16:00-18:00", room: "Каб. 205" },
    ],
    links: {
      telegram: "https://t.me/nisrobotics",
      whatsapp: "https://wa.me/77771234567",
    },
    ownerIds: ["2"],
    memberCount: 24,
    categories: ["Технологии", "STEM"],
    city: "Кызылорда",
    createdAt: "2024-09-01",
  },
  {
    id: "2",
    name: "Дебатный клуб",
    description:
      "Развиваем навыки публичных выступлений, критического мышления и аргументации. Участвуем в турнирах по дебатам на казахском, русском и английском языках.",
    shortDescription: "Публичные выступления и участие в турнирах",
    coverImage: "/debate-club-students-speaking.jpg",
    photos: ["/debate-tournament.jpg", "/students-debating.jpg"],
    schedule: [
      { day: "Вторник", time: "16:00-18:00", room: "Актовый зал" },
      { day: "Четверг", time: "16:00-18:00", room: "Актовый зал" },
    ],
    links: {
      telegram: "https://t.me/nisdebate",
    },
    ownerIds: ["3"],
    memberCount: 18,
    categories: ["Образование", "Коммуникация"],
    city: "Астана",
    createdAt: "2024-09-05",
  },
  {
    id: "3",
    name: "Художественная студия",
    description:
      "Занимаемся живописью, графикой, скульптурой и другими видами изобразительного искусства. Организуем выставки и участвуем в конкурсах.",
    shortDescription: "Живопись, графика и участие в выставках",
    coverImage: "/art-studio-students-painting.jpg",
    photos: ["/art-exhibition.png", "/students-painting.jpg", "/vibrant-art-gallery.png"],
    schedule: [
      { day: "Среда", time: "14:00-16:00", room: "Каб. 101" },
      { day: "Суббота", time: "10:00-13:00", room: "Каб. 101" },
    ],
    links: {
      telegram: "https://t.me/nisart",
      website: "https://nisart.example.com",
    },
    ownerIds: ["2"],
    memberCount: 15,
    categories: ["Искусство", "Творчество"],
    city: "Алматы",
    createdAt: "2024-09-10",
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    clubId: "1",
    title: "Соревнования по робототехнике",
    content:
      "Приглашаем всех участников клуба на региональные соревнования по робототехнике, которые пройдут 15 ноября. Регистрация до 1 ноября!",
    image: "/robotics-competition-poster.jpg",
    authorId: "2",
    createdAt: "2024-10-20",
    likes: ["1", "3"],
    comments: [
      {
        id: "1",
        userId: "1",
        userName: "Айдар Нурланов",
        content: "Отличная новость! Обязательно участвуем!",
        createdAt: "2024-10-21",
      },
    ],
  },
  {
    id: "2",
    clubId: "1",
    title: "Новый проект: Умный дом",
    content: "Начинаем работу над новым проектом - создание системы умного дома. Первое занятие состоится в эту среду.",
    image: "/smart-home-technology.png",
    authorId: "2",
    createdAt: "2024-10-15",
    likes: ["1", "2", "3"],
    comments: [],
  },
  {
    id: "3",
    clubId: "2",
    title: "Турнир по дебатам",
    content: "Приглашаем на школьный турнир по дебатам. Тема: 'Искусственный интеллект в образовании'",
    image: "/debate-tournament.jpg",
    authorId: "3",
    createdAt: "2024-10-18",
    likes: ["2"],
    comments: [],
  },
]

export const mockRequests: ClubRequest[] = [
  {
    id: "1",
    applicantId: "3",
    clubName: "Клуб шахмат",
    description: "Клуб для любителей шахмат всех уровней",
    goals: "Развитие логического мышления и участие в турнирах",
    schedule: [
      { day: "Понедельник", time: "15:00-17:00", room: "Каб. 301" },
      { day: "Пятница", time: "15:00-17:00", room: "Каб. 301" },
    ],
    curator: "Иванов И.И.",
    contacts: "+7 777 999 8888",
    status: "pending",
    createdAt: "2024-10-25",
  },
]

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    clubId: "1",
    title: "1 место на региональной олимпиаде",
    description: "Наша команда заняла первое место на региональной олимпиаде по робототехнике",
    date: "2024-09-15",
    image: "/robotics-competition.png",
    icon: "🏆",
  },
  {
    id: "2",
    clubId: "1",
    title: "Грант на развитие проекта",
    description: "Получили грант в размере 500,000 тенге на развитие проекта 'Умный дом'",
    date: "2024-08-20",
    icon: "💰",
  },
  {
    id: "3",
    clubId: "2",
    title: "Победа в национальном турнире",
    description: "Команда дебатного клуба победила в национальном турнире среди школ НИШ",
    date: "2024-09-10",
    image: "/debate-tournament.jpg",
    icon: "🥇",
  },
  {
    id: "4",
    clubId: "3",
    title: "Выставка в городском музее",
    description: "Работы наших учеников были представлены на выставке в городском музее искусств",
    date: "2024-10-01",
    image: "/art-exhibition.png",
    icon: "🎨",
  },
]

export const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Kyzylorda Hub Community",
    description:
      "Сообщество в Кызылорде, где выкладывают мероприятия, собираются люди с идеями для стартапов и общаются ради новых знакомств и совместных проектов. Здесь вы найдете единомышленников для реализации своих идей!",
    link: "https://chat.whatsapp.com/F84l7qcGFbWKDoQMTjY9zw",
    icon: "🚀",
    platform: "WhatsApp",
    memberCount: 458,
  },
  {
    id: "2",
    name: "Kyzylorda Hub Community",
    description:
      "Telegram-канал сообщества Kyzylorda Hub. Обсуждаем стартапы, делимся идеями и находим команду для совместных проектов.",
    link: "https://t.me/kyzylordahub",
    icon: "🚀",
    platform: "Telegram",
    memberCount: 462,
  },
  {
    id: "3",
    name: "NIS Общее сообщество",
    description: "Главный канал школы для всех учеников",
    link: "https://t.me/niscommunity",
    icon: "🏫",
    platform: "Telegram",
    memberCount: 320,
  },
  {
    id: "4",
    name: "NIS Спорт",
    description: "Спортивные мероприятия и новости",
    link: "https://t.me/nissport",
    icon: "⚽",
    platform: "Telegram",
    memberCount: 185,
  },
  {
    id: "5",
    name: "NIS Наука",
    description: "Научные проекты и олимпиады",
    link: "https://t.me/nisscience",
    icon: "🔬",
    platform: "Telegram",
    memberCount: 210,
  },
]
