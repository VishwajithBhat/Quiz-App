# ⚡ QuizMaster - Modern Vanilla JS Quiz App

A production-quality, responsive Quiz Application built with clean HTML5, CSS3, and Vanilla JavaScript.
Features a dynamic question engine, dark mode, high score tracking, and smooth animations.

![Quiz App Preview](https://via.placeholder.com/800x400?text=Quiz+App+Preview) 
*(Replace with actual screenshot after deployment)*

## 🚀 Features

- **Dynamic Quiz Engine**: Questions loaded from external JSON.
- **Timer & Scoring**: Interactive count-down timer with visual ring.
- **Persistent Dark Mode**: Saves your theme preference.
- **High Scores**: Tracks top 5 scores using LocalStorage.
- **Responsive Design**: Mobile-first approach using Flexbox and Grid.
- **Accessibility**: Keyboard navigable and semantic HTML.

## 🛠️ Technologies

- **HTML5**: Semantic structure.
- **CSS3**: Variables, Flex/Grid, Animations, Glassmorphism.
- **JavaScript (ES6+)**: Async/Await, DOM Manipulation, LocalStorage API.

## 📂 Folder Structure

```
Quiz App/
├── index.html       # Main application structure
├── styles.css       # All styles and themes
├── script.js        # App logic (State content, UI handling)
├── questions.json   # Data source for questions
└── README.md        # Documentation
```

## ⚙️ Setup & Usage

To run this application locally:

> [!IMPORTANT]  
> Because this app uses `fetch()` to load the JSON file, you **cannot** simply double-click `index.html` due to browser CORS policies. You must run it on a local server.

### Option 1: VS Code (Recommended)
1. Install the "Live Server" extension.
2. Right-click `index.html` and select "Open with Live Server".

### Option 2: Python
If you have Python installed, run this within the folder:
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Node.js
If you have Node installed:
```bash
npx serve .
```

## 🌐 Deployment

This project is ready for **GitHub Pages**:
1. Upload these files to a GitHub repository.
2. Go to Settings > Pages.
3. Select `main` branch and `/root` folder.
4. Save and your site will be live!

## 🤝 Customization

- **Add Questions**: Edit `questions.json` following the existing format.
- **Change Theme**: Update CSS variables in `:root` and `[data-theme="dark"]` in `styles.css`.
- **Adjust Timer**: Change `const TIME_PER_QUESTION` in `script.js`.

---
*Built for educational purposes and portfolio showcase.*
