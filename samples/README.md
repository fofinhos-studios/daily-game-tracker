# ミニゲーム (Minigēmu) - Samples

This folder contains sample files for various daily games. Each file represents a different game with its format and examples.

## How to Read These Files

Each file in this folder contains multiple examples of game results. Examples are separated by `---` lines. When parsing:

1. Split the file content by `---` to get individual examples
2. Each example represents one game session/result
3. Games are identified by their unique format patterns

## Supported Games

### 1. Conexo
- **File**: [`conexo.txt`](conexo.txt)
- **Description**: A logic puzzle game where you must find connections between items
- **Format**:
  ```
  Joguei conexo.ws [DATE] e consegui em [N] tentativas[ e M dicas].
  [GRID_ROWS]
  ```
- **Patterns**:
  - Date format: DD/MM/YYYY
  - Grid contains colored squares (🟩=correct, 🟥=wrong, 🟦=blue, 🟧=orange, 🟪=purple, ❌=wrong, 💡=hint)
  - May include hints indicator "e M dicas"

### 2. Framed
- **File**: [`framed.txt`](framed.txt)
- **Description**: A movie guessing game where you identify films from frames
- **Format**:
  ```
  Framed #[NUMBER]

  🎥 [RESULT]

  https://framed.wtf
  ```
- **Patterns**:
  - Header starts with `Framed #`
  - Emoji grid with 🎥 followed by 🟩 (correct), 🟥 (wrong), ⬜ (not attempted)

### 3. Gamedle
- **File**: [`gamedle.txt`](gamedle.txt)
- **Description**: A game to guess video games based on cover, artwork, characters, or keywords
- **Format**:
  ```
  Gamedle
  🕹️ (Capa) #[NUMBER]:
  [RESULT]

  🎨 (Artwork) #[NUMBER]:
  [RESULT]

  👤 (Personagem) #[NUMBER]:
  [RESULT]

  🔑 (Palavras-chave) #[NUMBER]:
  [RESULT]
  ```
- **Patterns**:
  - Multiple categories: Capa (Cover), Artwork, Personagem (Character), Palavras-chave (Keywords)
  - Each category has a game number #
  - 🟩 = correct, 🟥 = wrong, 🟨 = misplaced/hint, ⬜ = not attempted

### 4. Gamedle (Single Format)
- **File**: [`gamedle.txt`](gamedle.txt)
- **Alternative Format**:
  ```
  🕹️ Gamedle: [DATE] [RESULT] > https://gamedle.wtf/[MODE]
  🕹️🎨 Gamedle (Artwork mode): [DATE] [RESULT] > https://gamedle.wtf/artwork
  🕹️👤 Gamedle (characters): [DATE] [RESULT] > https://gamedle.wtf/characters
  🕹️🔑 Gamedle (keywords mode): [DATE] [RESULT] > https://gamedle.wtf/keywords
  🕹️🔍 Gamedle (Guess mode): [DATE] [RESULT] > https://gamedle.wtf/guess
  ```

### 5. GuessTheGame
- **File**: [`guessthegame.txt`](guessthegame.txt)
- **Description**: A game to guess video games based on images
- **Format**:
  ```
  #GuessTheGame #[NUMBER]

  🎮 [RESULT]

  #GameNavigator
  https://GuessThe.Game/p/[NUMBER]
  ```
- **Patterns**:
  - Header starts with `#GuessTheGame #`
  - Emoji grid with 🟩 (correct), 🟥 (wrong), ⬜ (not attempted)

### 6. Letroso
- **File**: [`letroso.txt`](letroso.txt)
- **Description**: A word-finding game similar to Wordle
- **Format**:
  ```
  Joguei letroso.com [DATE] e consegui em [N] tentativas.

  [GRID_ROWS]
  ✅
  ```
- **Patterns**:
  - Date format: DD/MM/YYYY
  - Grid rows with 🟩 (correct), ⬛ (wrong), 🟨 (misplaced), 🟢 (found bonus)
  - Ends with ✅

### 7. Termo
- **File**: [`termo.txt`](termo.txt)
- **Description**: Portuguese Wordle clone (also called term.ooo)
- **Format**:
  ```
  joguei term.ooo #[NUMBER] [DATE] 🔥 [STREAK]

  [GRID_ROWS]

  term.ooo/[MODE] #[NUMBER] 🔥 [STREAK]

  [EMOJI_HINTS]

  [GRID_ROWS]
  ```
- **Patterns**:
  - Header format: `joguei term.ooo #[NUMBER] DD/MM 🔥 [STREAK]`
  - Or: `term.ooo/[MODE] #[NUMBER] 🔥 [STREAK]`
  - Emoji hints: `4️⃣6️⃣` or `5️⃣7️⃣6️⃣4️⃣`
  - Grid rows with 🟩 (correct), ⬛ (wrong), 🟨 (misplaced)

### 8. Expresso
- **File**: [`expresso.txt`](expresso.txt)
- **Description**: Find a popular expression using Letroso-style clues
- **Format**:
  ```
  Joguei expresso.ac [DATE] e consegui em [N] tentativas.

  [GRID_ROWS]
  ```
- **Patterns**:
  - Date format: DD/MM/YYYY
  - Spaces separate words in each grid row
  - 🟩 = correct, 🟨 = right word, 🟪 = wrong word, ⬛ = absent

---

## Adding New Games

If you detect a new game in the source files (mensagem.txt, mensagem2.txt, etc.):

### Step 1: Identify the Game
- Look for unique patterns (headers, emojis, keywords)
- Determine the game format and mechanics

### Step 2: Create or Update File
1. If a similar game file exists (e.g., another word game), add examples to it
2. If no similar file exists, create a new file named `[gamename].txt`

### Step 3: Update This README
Add a new section following this template:

```markdown
### [GAME NAME]
- **File**: `[filename.txt](filename.txt)`
- **Description**: Brief description of the game
- **Format**:
  ```
  [Example format]
  ```
- **Patterns**:
  - Key identifying patterns
```

### Step 4: Test Parsing
Ensure the new game format can be correctly parsed by checking:
- Header/identifier patterns
- Date formats
- Grid/result patterns
- Success/failure indicators

---

## File Naming Convention

- Use lowercase names
- Use only alphanumeric characters and hyphens
- Match the game's common name (e.g., "conexo", "gamedle", "letroso")
