# Dokumentacja Testów Frontendu

Dokument opisuje strategię testowania frontendowej aplikacji React. Testy skupiają się
na weryfikacji poprawnego renderowania komponentów UI, ich reakcji na interakcje
użytkownika oraz właściwej obsługi mockowanego routingu.

## Stos Technologiczny
- **Test Runner:** [Vitest](https://vitest.dev/)
- **Zestaw do Testów UI:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Interakcje Użytkownika:** `@testing-library/user-event`
- **Mock Routingu:** `react-router` stubs

## Zestawy Testów Komponentów

### 1. `SearchBar` (`SearchBar.test.tsx`)
Testy globalnego formularza wyszukiwania w aplikacji.
- **Renderowanie:** Sprawdza, czy pole wyszukiwania oraz jego placeholder są widoczne w widoku.
- **Interakcje:** Symuluje wpisanie przez użytkownika frazy wyszukiwania („animals") i naciśnięcie `Enter`. Używa Vitest do mockowania hooka `useNavigate` z React Router, aby upewnić się, że komponent poprawnie wywołuje przekierowanie do `/?search=animals`.

### 2. `ButtonToggle` (`ButtonToggle.test.tsx`)
Testy współdzielonych przycisków przełączających stany boolean w interfejsie.
- **Renderowanie:** Sprawdza, czy przycisk poprawnie wyświetla tekst przekazany przez prop `content`.
- **Interakcje:** Używa symulacji kliknięcia przez `userEvent`, aby potwierdzić, że callback `setIsOn` jest wywoływany za każdym razem, gdy użytkownik kliknie przycisk.

### 3. `Container` (`Container.test.tsx`)
Testy wielokrotnego użytku ogólnego wrappera layoutu.
- **Renderowanie:** Sprawdza, czy zagnieżdżona zawartość `<children>` poprawnie montuje się wewnątrz komponentu.
- **Stylowanie:** Weryfikuje, czy opcjonalne własne klasy CSS (prop `cssClassName`) są prawidłowo dodawane do nadrzędnego elementu semantycznego.

### 4. `FieldGroup` (`FieldGroup.test.tsx`)
Testy niestandardowych grup kontrolek formularza (łączących etykiety i inputy).
- **Renderowanie:** Sprawdza powiązanie między tekstowym elementem `<label>` a odpowiadającym mu `<input>` zgodnie ze standardami ARIA (`getByLabelText`). Weryfikuje, czy pole poprawnie ładuje swoją początkową wartość `inputValue`.
- **Interakcje:** Potwierdza, że wpisywanie tekstu w polu input poprawnie wyzwala prop `onInputChange` w komponencie `<FieldGroup>`.

### 5. `LoadingSpinner` (`LoadingSpinner.test.tsx`)
Testy wizualnego wskaźnika ładowania.
- **Renderowanie:** Sprawdza, czy spinner poprawnie montuje się w drzewie DOM, bez pustych ani uszkodzonych struktur znaczników.
