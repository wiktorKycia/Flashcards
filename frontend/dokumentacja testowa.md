# Dokumentacja testów frontendu

Dokument opisuje strategię testowania frontendowej aplikacji React. Testy obejmują **wszystkie komponenty** z katalogu `src/components/`. Weryfikują poprawne renderowanie UI, podstawowe interakcje użytkownika oraz — tam, gdzie to konieczne — zachowanie przy zamockowanych hookach (routing, autoryzacja, React Query).

## Uruchamianie testów

```bash
cd frontend
npm ci
npm test
```

Tryb podglądu (watch):

```bash
npm run test:watch
```

## Stos technologiczny

| Narzędzie | Rola |
|-----------|------|
| [Vitest](https://vitest.dev/) | Uruchamianie testów, asercje |
| [React Testing Library](https://testing-library.com/react) | Renderowanie komponentów, zapytania z perspektywy użytkownika |
| `@testing-library/user-event` | Symulacja kliknięć, wpisywania tekstu |
| `@testing-library/jest-dom` | Asercje DOM (`toBeInTheDocument`, `toHaveClass` itd.) |
| `jsdom` | Środowisko przeglądarki w Node.js |
| `vitest.config.ts` | Konfiguracja (alias `@/`, plik `src/test/setup.ts`) |

## Struktura plików testowych

- Każdy komponent ma plik testowy obok implementacji: `NazwaKomponentu.test.tsx`.
- Wspólne narzędzia: `src/test/setup.ts` (jest-dom, mocki zasobów graficznych), `src/test/test-utils.tsx` (`renderWithProviders` z `MemoryRouter` i `QueryClientProvider`).

## Zasady pisania testów

1. **Zapytania jak użytkownik** — preferowane są `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText` zamiast selektorów CSS.
2. **Widoczność komponentu** — większość plików zawiera test `displays …` / `wyświetla …`, potwierdzający obecność kluczowych elementów w DOM.
3. **Mocki zależności** — hooki API (`useSavedQuizzes`, `useAuth`, `useQuizLikes` itd.) są mockowane w Vitest, aby testy komponentów nie wymagały działającego backendu.
4. **Router** — komponenty używające `Link` / `useNavigate` testowane są w `MemoryRouter` (bezpośrednio lub przez `renderWithProviders`).

---

## Zestawy testów komponentów

Poniżej lista wszystkich komponentów z folderu `components` i zakres ich testów.

### `AvatarUpload` (`AvatarUpload.test.tsx`)
- Wyświetlanie nagłówka „Zdjęcie profilowe”, podglądu avatara i przycisku „Wybierz plik”.
- Mocki: `useUploadAvatar`, `useUserProfilePicture`.

### `AttachedFlashcardsMode` (`AttachedFlashcardsMode.test.tsx`)
- Wyświetlanie treści fiszki i licznika `1 / n` przy danych wejściowych.
- Komunikat „Ten quiz jeszcze nie ma fiszek” przy pustej liście.
- Mocki: `useAuth`, `useUpdateFlashcardKnowledge`, `useResetQuizProgress`.

### `BigFlashcard` (`BigFlashcard.test.tsx`)
- Wyświetlanie tekstu przodu i tyłu fiszki.

### `ButtonAdd` (`ButtonAdd.test.tsx`)
- Wyświetlanie przycisku „+” i podpowiedzi „Stwórz quiz”.
- Przekierowanie na `/login` po kliknięciu bez zalogowanego użytkownika.
- Mocki: `useAuth`, `useCreateQuiz`, `useNavigate`.

### `ButtonToggle` (`ButtonToggle.test.tsx`)
- Wyświetlanie etykiety przycisku (`content`).
- Wywołanie `setIsOn` po kliknięciu.

### `ButtonTop` (`ButtonTop.test.tsx`)
- Wyświetlanie przycisku z `aria-label="Scroll to top"`.
- Wywołanie `window.scrollTo` po kliknięciu.

### `Container` (`Container.test.tsx`)
- Wyświetlanie zagnieżdżonej zawartości `children`.
- Stosowanie opcjonalnej klasy `cssClassName`.

### `CreatedQuizzesList` (`CreatedQuizzesList.test.tsx`)
- Nagłówek „Utworzone zestawy” i lista quizów po załadowaniu danych.
- Komunikat pustej listy.
- Mocki: `useAuth`, `useCreatedQuizzes`.

### `FieldGroup` (`FieldGroup.test.tsx`)
- Powiązanie `<label>` z `<input>` (`getByLabelText`), wartość początkowa.
- Wywołanie `onInputChange` przy wpisywaniu.

### `FlashcardsFilter` (`FlashcardsFilter.test.tsx`)
- Wyświetlanie tekstu przycisku filtra.
- Wywołanie `toggleFn` po kliknięciu.

### `GapTask` (`GapTask.test.tsx`)
- Wyświetlanie pola tekstowego do uzupełnienia luki.

### `HamburgerButton` (`HamburgerButton.test.tsx`)
- Renderowanie placeholdera przycisku menu.

### `Header` (`Header.test.tsx`)
- Wyświetlanie elementu `<header>`, logo i paska wyszukiwania.
- Mocki: `useTheme`, `useCheckIfLoggedIn`, `useAuth`, `useUserProfilePicture`, `useCreateQuiz`.

### `KnowledgeTestSetup` (`KnowledgeTestSetup.test.tsx`)
- Wyświetlanie formularza konfiguracji testu i przycisku „Rozpocznij”.
- Przekazanie domyślnych ustawień do `onSubmitSettings` po wysłaniu formularza.

### `KnowledgeTestView` (`KnowledgeTestView.test.tsx`)
- Wyświetlanie sekcji zadań i przycisku „Sprawdź” dla przykładowych danych testowych.

### `LikedQuizzesList` (`LikedQuizzesList.test.tsx`)
- Lista polubionych quizów oraz stan pusty.
- Mock: `useUserLikedQuizzes`.

### `ListableFlashcard` (`ListableFlashcard.test.tsx`)
- Wyświetlanie `front` i `back`.

### `ListableQuiz` (`ListableQuiz.test.tsx`)
- Wyświetlanie nazwy i opisu quizu.
- Link do `/quiz/:id`.

### `ListedFlashcards` (`ListedFlashcards.test.tsx`)
- Nagłówek „Fiszki” i lista przekazanych fiszek.

### `LoadingSpinner` (`LoadingSpinner.test.tsx`)
- Obecność struktury spinnera w DOM (bez pustego kontenera).

### `Logo` (`Logo.test.tsx`)
- Wyświetlanie linku do strony głównej i obrazu z `alt="logo"`.

### `MatchCard` (`MatchCard.test.tsx`)
- Wyświetlanie treści karty.
- Wywołanie `onClick` dla statusu `idle`.

### `Person` (`Person.test.tsx`)
- Wyświetlanie imienia (link), tytułu i zdjęcia profilowego.
- Mock: `useUserProfilePicture`.

### `ProfilePicture` (`ProfilePicture.test.tsx`)
- Wyświetlanie obrazu z `alt="profile picture"`.
- Mock: `useUserProfilePicture`.

### `QuizLikeButtons` (`QuizLikeButtons.test.tsx`)
- Wyświetlanie dwóch przycisków głosowania i liczników polubień.
- Mocki: `useAuth`, hooki z `useQuizLikes`.

### `QuizPreview` (`QuizPreview.test.tsx`)
- Wyświetlanie nazwy, opisu, przycisku „Otwórz zestaw” oraz liczb głosów.
- Mocki: `useCheckIfLoggedIn`, `useAuth`, `useUserQuizLike`.

### `SavedQuizzesList` (`SavedQuizzesList.test.tsx`)
- Lista zapisanych quizów oraz komunikat pustej listy.
- Mock: `useSavedQuizzes`.

### `SearchBar` (`SearchBar.test.tsx`)
- Wyświetlanie pola wyszukiwania i placeholdera.
- Nawigacja do `/?search=…` po wysłaniu formularza (mock `useNavigate`).

### `SingleChoiceTask` (`SingleChoiceTask.test.tsx`)
- Wyświetlanie trzech opcji odpowiedzi (radio).

### `ThemeToggler` (`ThemeToggler.test.tsx`)
- Wyświetlanie przycisku przełącznika motywu.
- Wywołanie `toggleFn` po kliknięciu.

### `ToolBar` (`ToolBar.test.tsx`)
- Wyświetlanie linku „Strona główna”, sekcji bocznego paska i przykładowych pozycji.

---

## Podsumowanie pokrycia

| Liczba komponentów w `src/components` | 31 |
| Liczba plików `*.test.tsx` | 31 |
| Wymaganie projektu (test na komponent) | Spełnione |

Testy nie zastępują testów E2E ani testów integracyjnych z backendem — izolują warstwę prezentacji React i umożliwiają szybką regresję UI w ramach prac projektowych.
