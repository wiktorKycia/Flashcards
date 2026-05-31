# Dokumentacja Testów Backendu

Dokument opisuje strategię testowania i automatyczne zestawy testów dla backendowego
REST API. Testy mają na celu weryfikację poprawnego działania endpointów aplikacji,
integracji z bazą danych oraz obsługi błędów.

## Stos Technologiczny
- **Test Runner:** [Vitest](https://vitest.dev/)
- **Asercje HTTP:** [Supertest](https://github.com/ladjs/supertest)
- **Baza Danych:** Wewnętrzne powiązania Prisma z izolowanymi konfiguracjami testowymi

## Zestawy Testów

### 1. Uwierzytelnianie i Użytkownicy (`auth.test.ts`)
Weryfikuje rejestrację użytkowników, procesy logowania oraz pobieranie profili.
- **`POST /api/auth/register`**
  - ✅ Poprawnie tworzy nowego użytkownika przy podaniu prawidłowych danych.
  - ✅ Zwraca `400 Bad Request`, jeśli w żądaniu brakuje hasła.
- **`POST /api/auth/login`**
  - ✅ Zwraca token uwierzytelniający dla prawidłowych danych logowania.
  - ✅ Zwraca `400 Bad Request` dla nieprawidłowych lub nieistniejących danych logowania.
- **`GET /api/users/:id`**
  - ✅ Pobiera dane profilu użytkownika dla prawidłowych identyfikatorów.
  - ✅ Zwraca `404 Not Found`, gdy użytkownik nie istnieje.

### 2. Ogólne / Sprawdzenie Stanu Serwera (`health.test.ts`)
Zapewnia, że aplikacja serwerowa uruchamia się poprawnie i wykrywa błędy konfiguracji.
- **`GET /`**
  - ✅ Zwraca podstawową odpowiedź `200 OK` potwierdzającą działanie serwera.
- **Nieznane Ścieżki**
  - ✅ Zwraca odpowiedź `404 Not Found` dla wszystkich nieobsługiwanych endpointów.

### 3. Quizy (`quizzes.test.ts`)
Sprawdza podstawowe przepływy pobierania danych dla głównych funkcji quizów w aplikacji.
- **`GET /api/quizzes`**
  - ✅ Zwraca tablicę istniejących quizów.
- **`GET /api/quizzes/:id`**
  - ✅ Poprawnie zwraca `404 Not Found`, jeśli żądane ID quizu nie istnieje w bazie danych.

## Czyszczenie po Testach (`helpers.ts`)
Aby zapewnić izolację między uruchomieniami, helpery bazodanowe Prisma
(`deleteTestUsers`, `uniqueTestUser`) są wywoływane przed i po każdym zestawie testów
w celu usunięcia losowo wygenerowanych obiektów testowych oraz bezpiecznego
rozłączenia klienta Prisma.