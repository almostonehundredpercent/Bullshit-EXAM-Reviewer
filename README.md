# BSIT Phase 2 Proficiency Exam Reviewer

An interactive quiz web app for reviewing the **2026 BSIT Proficiency Exam (Phase 2)** material from the Polytechnic Institute of Tabaco. Covers Data Structures & Algorithms, OOP, Web Systems, Information Management (Databases), Computer Graphics, Integrative Programming (PHP), and Computer Networking.

Built with plain HTML, CSS, and JavaScript — no frameworks, no build step. Works offline once loaded.

## Features

- **130+ multiple choice questions** across 7 topics, each with an explanation
- **Quiz mode** — go through questions at your own pace with instant feedback
- **Timed challenge** — 60-second sprint, answer as many as you can
- **Flashcards** — flip cards to memorize key concepts
- **Sequential or shuffled** question order
- **Review missed questions** after finishing a quiz
- **High scores** saved locally per topic and mode (localStorage)
- **Dark mode** toggle (also respects system preference)
- Fully responsive — works great on phones

## Live demo

Once deployed to GitHub Pages, your reviewer will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

## How to publish to GitHub Pages

1. Create a new repository on GitHub (e.g. `bsit-phase2-reviewer`).
2. Upload all the files in this folder (`index.html`, `style.css`, `app.js`, `questions.js`, `flashcards.js`) to the repository root.
3. Go to your repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`.
5. Choose the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait a minute or two — GitHub will give you a live URL. Share that link with your classmates!

## Adding more questions

All questions live in `questions.js` and flashcards live in `flashcards.js`. Each question follows this format:

```js
{
  t: 'dsa',                  // topic id: dsa, oop, web, db, gfx, php, net
  q: 'Question text here?',
  c: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
  a: 2,                       // index of correct answer (0-based)
  e: 'Explanation shown after answering.'
}
```

For questions that show a code snippet, add `code: true` and put the code on new lines after the first line of `q` (separated by `\n`).

## File structure

```
bsit-reviewer/
├── index.html       Main page structure
├── style.css        Styling (light + dark mode)
├── app.js           App logic — quiz, timer, flashcards, scoring
├── questions.js     Question bank (130+ questions, 7 topics)
└── flashcards.js    Flashcard data
```

## License

Free to use and modify for study purposes. Good luck on your exam!
