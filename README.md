# Chess_with_random_piece (tạo hoàn toàn phần code cơ bản bởi AI, đây chỉ là một dự án giải trí của tôi)
# 🎯 Cờ Vua Ngẫu Nhiên (Random Chess)

Một phiên bản cờ vua với yếu tố ngẫu nhiên, được xây dựng bằng **Next.js 15**, **TypeScript**, và **Tailwind CSS**.

![Random Chess Demo](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Random+Chess+Game)

## ✨ Tính năng nổi bật

### 🎲 Gameplay độc đáo
- **Hệ thống quay ngẫu nhiên**: Mỗi lượt quay 3 loại quân cờ để di chuyển
- **Reroll thông minh**: 2 lượt reroll mỗi người, có thể dùng khi bị chiếu
- **Triple Bonus**: Quay 3 quân giống nhau = +1 reroll miễn phí
- **Logic chiếu hết cải tiến**: Chỉ thua khi bị chiếu + không có nước đi + hết reroll

### 🎮 Nhiều chế độ chơi
- **🏆 Cờ Vua Ngẫu Nhiên**: Chế độ cơ bản, không giới hạn thời gian
- **⚡ Chế độ Chớp Nhoáng**: 30 giây mỗi lượt, tốc độ cao
- **🤖 Đấu với Máy**: Thách thức AI (Coming soon)
- **🎪 Chế độ Hỗn Loạn**: Quay 4 quân, sử dụng tối đa 3 nước

### 🎨 Giao diện & Trải nghiệm
- **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị
- **Hiệu ứng âm thanh**: Âm thanh sống động cho mọi hành động
- **Animations mượt mà**: Hiệu ứng chuyển động đẹp mắt
- **Dark/Light Theme**: Tùy chỉnh giao diện theo sở thích

### 🧠 Tính năng thông minh
- **Gợi ý AI**: Hệ thống gợi ý nước đi tốt nhất
- **Thống kê chi tiết**: Theo dõi tỷ lệ thắng/thua, thời gian chơi
- **Auto-save**: Tự động lưu tiến trình game
- **Move History**: Lịch sử nước đi được nhóm theo lượt

## 🚀 Demo trực tuyến

👉 **[Chơi ngay tại đây](https://your-demo-link.vercel.app)**

## 📱 Screenshots

<details>
<summary>Xem ảnh chụp màn hình</summary>

### Menu chính
![Main Menu](https://via.placeholder.com/600x400/3b82f6/ffffff?text=Main+Menu)

### Gameplay
![Gameplay](https://via.placeholder.com/600x400/10b981/ffffff?text=Gameplay)

### Chế độ Chớp Nhoáng
![Blitz Mode](https://via.placeholder.com/600x400/f59e0b/ffffff?text=Blitz+Mode)

### Thống kê
![Statistics](https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Statistics)

</details>

## 🛠️ Công nghệ sử dụng

- **Framework**: [Next.js 15](https://nextjs.org/) với App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🎯 Cài đặt và chạy local

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone repository
\`\`\`bash
git clone https://github.com/AshReginald/Chess_with_random_piece.git
cd Chess_with_random_piece
\`\`\`

### Bước 2: Cài đặt dependencies
\`\`\`bash
Cài đặt Node.js
Sau đó:

npm install
# hoặc
yarn install
\`\`\`

### Bước 3: Chạy development server
\`\`\`bash
npm run dev
# hoặc
yarn dev
\`\`\`

### Bước 4: Mở trình duyệt
Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📖 Luật chơi

### Luật cơ bản
1. **Quay ngẫu nhiên**: Mỗi lượt hệ thống quay 3 loại quân cờ
2. **Di chuyển**: Chỉ được di chuyển các loại quân đã quay
3. **Giới hạn nước đi**: Tối đa 3 nước mỗi lượt (mỗi loại quân 1 nước)
4. **Chuyển lượt**: Nếu thực hiện nước chiếu, lượt chuyển ngay cho đối thủ
5. **Luật cờ vua**: Các luật cờ vua cơ bản vẫn được áp dụng

### Hệ thống Reroll
- Mỗi người chơi có **2 lượt reroll** mỗi ván
- Chỉ có thể reroll khi **chưa di chuyển quân nào** trong lượt
- Khi bị chiếu, có thể dùng reroll để tìm quân phù hợp

### Triple Bonus 🎁
- Khi quay được **3 quân cùng loại** → Nhận **+1 reroll** miễn phí
- Ví dụ: Quay được 3 Mã → Được thêm 1 reroll
- Bonus này có thể xảy ra nhiều lần trong một ván

### Chế độ Hỗn Loạn 🎪
- Quay **4 quân cờ** thay vì 3
- Có thể sử dụng **bất kỳ quân nào** trong số 4 quân đã quay
- Tối đa **3 nước đi** mỗi lượt
- Linh hoạt hơn trong chiến thuật

## 🏗️ Cấu trúc project

\`\`\`
random-chess/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── chess-board.tsx    # Bàn cờ chính
│   ├── game-timer.tsx     # Bộ đếm thời gian
│   ├── piece-selector.tsx # Selector quân cờ
│   ├── move-history.tsx   # Lịch sử nước đi
│   └── ...
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── chess-logic.ts     # Logic cờ vua
│   ├── hint-system.ts     # Hệ thống gợi ý
│   └── ...
├── public/                # Static assets
└── README.md
\`\`\`

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! 


### Ý tưởng đóng góp:
- 🤖 Cải thiện AI cho chế độ đấu với máy
- 🎵 Thêm nhạc nền và hiệu ứng âm thanh
- 🌐 Multiplayer online
- 📊 Thêm các chỉ số thống kê mới
- 🎨 Themes và customization
- 🏆 Hệ thống achievement/trophy

## 🐛 Báo lỗi

Nếu bạn phát hiện lỗi, vui lòng báo cáo với thông tin:
- Mô tả lỗi chi tiết
- Các bước để tái hiện lỗi
- Screenshots (nếu có)
- Thông tin môi trường (browser, OS)

## 📝 Roadmap

### Version 2.0 (Coming Soon)
- [ ] 🤖 AI opponent với nhiều mức độ khó
- [ ] 🌐 Multiplayer online
- [ ] 🏆 Hệ thống ranking và leaderboard
- [ ] 📱 Mobile app (React Native)

### Version 2.1
- [ ] 🎵 Nhạc nền và sound effects nâng cao
- [ ] 🎨 Thêm themes và board customization
- [ ] 📊 Advanced analytics và insights
- [ ] 🔄 Replay system

### Version 3.0
- [ ] 🏆 Tournament mode
- [ ] 👥 Team battles
- [ ] 🎮 Mini-games và challenges
- [ ] 🌍 Internationalization (i18n)

## 📄 License

Dự án này được phân phối dưới **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Your Name**
- GitHub: [@AshReginald](https://github.com/AshReginald)
- Email: duongcogcn@gmail.com

## 🙏 Lời cảm ơn

- [Next.js](https://nextjs.org/) - Framework tuyệt vời
- [shadcn/ui](https://ui.shadcn.com/) - UI components đẹp
- [Lucide](https://lucide.dev/) - Icon set tuyệt vời
- [Vercel](https://vercel.com/) - Platform deployment tốt nhất, phần cơ bản của chương trình này tạo hoàn toàn bởi AI

## ⭐ Ủng hộ dự án

Nếu bạn thích dự án này, hãy cho chúng tôi một ⭐ trên GitHub!

---

<div align="center">

**🎯 Cờ Vua Ngẫu Nhiên - Trải nghiệm cờ vua hoàn toàn mới! 🎯**

Made with ❤️ in Vietnam

</div>
\`\`\`
