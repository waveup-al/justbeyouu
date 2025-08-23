'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.projects': 'Dự án',
    'nav.contact': 'Liên hệ',
    'nav.main': 'Điều hướng chính',
    'nav.interests': 'Sở thích (Guitar · Travel · Beer)',
    
    // Hero Section
    'hero.greeting': 'Xin chào! Tôi là',
    'hero.name': 'Nguyễn Công Hiếu',
    'hero.title': 'AI Agent & Automation Developer',
    'hero.subtitle': 'Một người thích <strong style="color: #f59e0b; font-weight: 700;">học mỗi ngày</strong> — AI Agent · Automation · Data',
    'hero.description': 'Chuyên gia phát triển <span class="text-neon-cyan neon-text">AI Agent</span>, <span class="text-neon-purple neon-text">Automation</span> và <span class="text-warm-amber neon-text">Data Analytics</span>',
    'hero.scroll': 'Cuộn xuống để khám phá',
    'hero.cta.contact': 'Liên hệ với tôi',
    'hero.cta.projects': 'Xem dự án',
    
    // About Section
    'about.title': 'Giới thiệu',
     'about.subtitle': 'Tìm hiểu thêm về hành trình và đam mê của tôi',
     'about.bio.title': 'Giới thiệu',
    'about.intro.title': 'Giới thiệu',
    'about.intro.p1': 'Xin chào! Tôi là <strong style="color: #3b82f6; font-weight: 700;">Nguyễn Công Hiếu</strong>, một developer đam mê công nghệ AI và automation. Tôi đang không ngừng học hỏi và phát triển để tạo ra các giải pháp thông minh giúp tự động hóa quy trình kinh doanh.',
    'about.intro.p2': 'Tôi tin rằng <strong style="color: #f59e0b; font-weight: 700;">"Học mỗi ngày"</strong> là chìa khóa để theo kịp với sự phát triển nhanh chóng của công nghệ. Từ việc xây dựng AI Agent thu thập dữ liệu từ Google Maps đến phát triển hệ thống trading tự động, tôi luôn tìm cách ứng dụng công nghệ mới nhất để giải quyết các vấn đề thực tế.',
    'about.intro.p3': 'Ngoài công việc, tôi thích chơi guitar, khám phá những địa điểm du lịch mới và thưởng thức những ly bia thủ công cùng bạn bè. Những sở thích này giúp tôi cân bằng cuộc sống và tìm thêm cảm hứng cho công việc.',
    'about.location': 'Đà Nẵng, Việt Nam',
    'about.experience': 'Đang học hỏi mỗi ngày',
    'about.skills.title': 'Kỹ năng chuyên môn',
    'about.interests.title': 'Sở thích',
    'about.interests.guitar.label': 'Guitar',
    'about.interests.guitar.description': 'Chơi guitar acoustic và fingerstyle',
    'about.interests.travel.label': 'Du lịch',
    'about.interests.travel.description': 'Khám phá văn hóa và ẩm thực địa phương',
    'about.interests.beer.label': 'Bia',
    'about.interests.beer.description': 'Thưởng thức craft beer và bia thủ công',
    'about.download.cv': 'Tải CV',
    
    // Projects Section
    'projects.title': 'Dự án',
    'projects.subtitle': 'Các dự án AI Agent, Automation và Data Analytics đã triển khai',
    'projects.loading': 'Đang tải projects',
    'projects.loading.demo': 'Đang tải demo',
    'projects.status.completed': 'Hoàn thành',
    'projects.status.in-progress': 'Đang phát triển',
    'projects.status.planned': 'Lên kế hoạch',
    'projects.status.unknown': 'Không xác định',
    'projects.demo': 'Xem Demo',
    'projects.code': 'Mã nguồn',
    'projects.details': 'Chi tiết',
    'projects.close': 'Đóng',
    'projects.technologies': 'Công nghệ sử dụng',
    
    // Contact Section
    'contact.title': 'Liên hệ',
    'contact.subtitle': 'Hãy kết nối và cùng nhau tạo ra những điều tuyệt vời!',
    'contact.form.name': 'Họ tên',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Chủ đề',
    'contact.form.message': 'Tin nhắn',
    'contact.form.send': 'Gửi tin nhắn',
    'contact.form.sending': 'Đang gửi',
    'contact.form.success': 'Tin nhắn đã được gửi thành công! Tôi sẽ phản hồi sớm nhất có thể.',
    'contact.form.error': 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.',

    'contact.info.title': 'Thông tin liên hệ',
    'contact.info.email': 'alwaveup@gmail.com',
    'contact.info.phone.value': '0888846467',
    'contact.info.address': 'Đà Nẵng, Việt Nam',
    'contact.info.phone.label': 'Điện thoại',
    'contact.info.address.label': 'Địa chỉ',

    'contact.social.title': 'Kết nối với tôi',
    
    // Easter Egg
    'easter.title': 'Easter Egg!',
    'easter.close': 'Đóng panel',
    'easter.funfacts': 'Fun Facts về Hiếu:',
    'easter.congratulations': 'Chúc mừng bạn đã tìm ra Easter Egg!',
    'easter.console': 'console.log("Thanks for exploring! 🚀")',
    'easter.play': 'Play Sound',
    'easter.copy': 'Copy Secret',
    'easter.quotes.0': '🎸 Coding is like playing guitar - practice makes perfect!',
    'easter.quotes.1': '🍺 Best debugging happens over a cold beer',
    'easter.quotes.2': '✈️ Travel broadens the mind, code broadens possibilities',
    'easter.quotes.3': '🤖 AI Agents are the future, but beer is eternal',
    'easter.quotes.4': '📊 Data tells stories, automation writes them',
    'easter.quotes.5': '🎵 Life is better with music and clean code',
    'easter.quotes.coding': '🎸 Coding giống như chơi guitar - luyện tập tạo nên hoàn hảo!',
    'easter.quotes.debugging': '🍺 Debug tốt nhất là khi có bia lạnh',
    'easter.quotes.travel': '✈️ Du lịch mở rộng tâm trí, code mở rộng khả năng',
    'easter.quotes.ai': '🤖 AI Agents là tương lai, nhưng bia là vĩnh cửu',
    'easter.quotes.data': '📊 Data kể chuyện, automation viết chúng',
    'easter.quotes.music': '🎵 Cuộc sống tốt hơn với âm nhạc và code sạch',
    'easter.facts.0': 'Đã viết hơn 50,000 dòng code năm nay',
    'easter.facts.1': 'Uống trung bình 4 cốc cà phê/ngày',
    'easter.facts.2': 'Biết chơi 15 bài guitar',
    'easter.facts.3': 'Đã đi qua 12 tỉnh thành Việt Nam',
    'easter.facts.4': 'Yêu thích bia Saigon Special',
    'easter.facts.code': 'Đã viết hơn 50,000 dòng code năm nay',
    'easter.facts.coffee': 'Uống trung bình 4 cốc cà phê/ngày',
    'easter.facts.guitar': 'Biết chơi 15 bài guitar',
    'easter.facts.travel': 'Đã đi qua 12 tỉnh thành Việt Nam',
    'easter.facts.beer': 'Yêu thích bia Saigon Special',
    'easter.sound': '🎵 Play Sound',
    
    // Avatar
     'avatar.drag': 'Kéo thả tôi đi! 🎸',

     // Common
     'common.loading': 'Đang tải...',
    'common.error': 'Có lỗi xảy ra',
    'common.close': 'Đóng',
    
    // Music Widget
    'music.play': 'Phát nhạc',
    'music.pause': 'Tạm dừng',
    'music.loop.on': 'Bật vòng lặp',
    'music.loop.off': 'Tắt vòng lặp',
    'music.mute': 'Tắt âm thanh',
    'music.unmute': 'Bật âm thanh',
    
    // Fox Mascot
    'fox.tooltip': 'Click để mở Easter Egg!',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.main': 'Main Navigation',
    'nav.interests': 'Interests (Guitar · Travel · Beer)',
    
    // Hero Section
    'hero.greeting': 'Hello! I am',
    'hero.name': 'Nguyen Cong Hieu',
    'hero.title': 'AI Agent & Automation Developer',
    'hero.subtitle': 'A person who loves <strong style="color: #f59e0b; font-weight: 700;">learning every day</strong> — AI Agent · Automation · Data',
    'hero.description': 'Specialist in <span class="text-neon-cyan neon-text">AI Agent</span>, <span class="text-neon-purple neon-text">Automation</span> and <span class="text-warm-amber neon-text">Data Analytics</span>',
    'hero.scroll': 'Scroll down to explore',
    'hero.cta.contact': 'Contact me',
    'hero.cta.projects': 'View projects',
    
    // About Section
    'about.title': 'About',
     'about.subtitle': 'Learn more about my journey and passion',
     'about.bio.title': 'Introduction',
    'about.intro.title': 'Introduction',
    'about.intro.p1': 'Hello! I am <strong style="color: #3b82f6; font-weight: 700;">Nguyen Cong Hieu</strong>, a developer passionate about AI technology and automation. I am constantly learning and growing to create intelligent solutions that help automate business processes.',
    'about.intro.p2': 'I believe that <strong style="color: #f59e0b; font-weight: 700;">"Learning every day"</strong> is the key to keeping up with the rapid development of technology. From building AI Agents that collect data from Google Maps to developing automated trading systems, I always look for ways to apply the latest technology to solve real-world problems.',
    'about.intro.p3': 'Outside of work, I enjoy playing guitar, exploring new travel destinations, and enjoying craft beers with friends. These hobbies help me balance my life and find more inspiration for work.',
    'about.location': 'Da Nang, Vietnam',
    'about.experience': 'Learning every day',
    'about.skills.title': 'Professional Skills',
    'about.interests.title': 'Interests',
    'about.interests.guitar.label': 'Guitar',
    'about.interests.guitar.description': 'Playing acoustic guitar and fingerstyle',
    'about.interests.travel.label': 'Travel',
    'about.interests.travel.description': 'Exploring local culture and cuisine',
    'about.interests.beer.label': 'Beer',
    'about.interests.beer.description': 'Enjoying craft beer and artisanal brews',
    'about.download.cv': 'Download CV',
    
    // Projects Section
    'projects.title': 'Projects',
    'projects.subtitle': 'AI Agent, Automation and Data Analytics projects deployed',
    'projects.loading': 'Loading projects',
    'projects.loading.demo': 'Loading demo',
    'projects.status.completed': 'Completed',
    'projects.status.in-progress': 'In Progress',
    'projects.status.planned': 'Planned',
    'projects.status.unknown': 'Unknown',
    'projects.demo': 'View Demo',
    'projects.code': 'Source Code',
    'projects.details': 'Details',
    'projects.close': 'Close',
    'projects.technologies': 'Technologies Used',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s connect and create amazing things together!',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending',
    'contact.form.success': 'Message sent successfully! I will respond as soon as possible.',
    'contact.form.error': 'An error occurred while sending the message. Please try again or contact directly via email.',
    'contact.form.demo.title': 'Demo Mode',
    'contact.form.demo.description': 'This form is currently in demo mode. Messages will be simulated successfully.',
    'contact.info.title': 'Contact Information',
    'contact.info.email': 'alwaveup@gmail.com',
    'contact.info.phone.value': '0888846467',
    'contact.info.address': 'Da Nang, Vietnam',
    'contact.info.phone.label': 'Phone',
    'contact.info.address.label': 'Address',
    'contact.tip': '💡 <strong>Tip:</strong> Fastest response via email or LinkedIn',
    'contact.social.title': 'Connect with me',
    
    // Easter Egg
    'easter.title': 'Easter Egg!',
    'easter.close': 'Close panel',
    'easter.funfacts': 'Fun Facts about Hieu:',
    'easter.congratulations': 'Congratulations on finding the Easter Egg!',
    'easter.console': 'console.log("Thanks for exploring! 🚀")',
    'easter.play': 'Play Sound',
    'easter.copy': 'Copy Secret',
    'easter.quotes.0': '🎸 Coding is like playing guitar - practice makes perfect!',
    'easter.quotes.1': '🍺 Best debugging happens over a cold beer',
    'easter.quotes.2': '✈️ Travel broadens the mind, code broadens possibilities',
    'easter.quotes.3': '🤖 AI Agents are the future, but beer is eternal',
    'easter.quotes.4': '📊 Data tells stories, automation writes them',
    'easter.quotes.5': '🎵 Life is better with music and clean code',
    'easter.quotes.coding': '🎸 Coding is like playing guitar - practice makes perfect!',
    'easter.quotes.debugging': '🍺 Best debugging happens over a cold beer',
    'easter.quotes.travel': '✈️ Travel broadens the mind, code broadens possibilities',
    'easter.quotes.ai': '🤖 AI Agents are the future, but beer is eternal',
    'easter.quotes.data': '📊 Data tells stories, automation writes them',
    'easter.quotes.music': '🎵 Life is better with music and clean code',
    'easter.facts.0': 'Wrote over 50,000 lines of code this year',
    'easter.facts.1': 'Drink an average of 4 cups of coffee per day',
    'easter.facts.2': 'Know how to play 15 guitar songs',
    'easter.facts.3': 'Traveled through 12 provinces in Vietnam',
    'easter.facts.4': 'Love Saigon Special beer',
    'easter.facts.code': 'Wrote over 50,000 lines of code this year',
    'easter.facts.coffee': 'Drink an average of 4 cups of coffee per day',
    'easter.facts.guitar': 'Know how to play 15 guitar songs',
    'easter.facts.travel': 'Have visited 12 provinces in Vietnam',
    'easter.facts.beer': 'Love Saigon Special beer',
    'easter.sound': '🎵 Play Sound',
    
    // Avatar
     'avatar.drag': 'Drag me around! 🎸',

     // Common
     'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.close': 'Close',
    
    // Music Widget
    'music.play': 'Play music',
    'music.pause': 'Pause',
    'music.loop.on': 'Enable loop',
    'music.loop.off': 'Disable loop',
    'music.mute': 'Mute',
    'music.unmute': 'Unmute',
    
    // Fox Mascot
    'fox.tooltip': 'Click to open Easter Egg!',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (isClient) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}