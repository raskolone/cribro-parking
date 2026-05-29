# Cribro Parking — Podsumowanie Projektu

## 📋 Cel Projektu

**Cribro Parking** to portal rezerwacji miejsc parkingowych przy lotniskach, stworzony w celu ułatwienia podróżnikom znalezienia i zarezerwowania bezpiecznego parkingu blisko terminali lotniczych. Projekt łączy klientów szukających miejsc parkingowych z właścicielami prywatnych parkingów, którzy chcą powiększyć swoją bazę klientów.

### Główne Cele Biznesowe:
- Zarabianie na prowizji procentowej od każdej rezerwacji
- Budowanie przewagi konkurencyjnej dzięki dedykowanym pulom miejsc parkingowych w niższych cenach
- Digitalizacja parkingowców, którzy dotychczas działali offline
- Stworzenie dwustronnej platformy (B2C dla klientów, B2B dla właścicieli parkingów)

---

## 🎯 Funkcjonalności

### Dla Klientów (B2C)

#### 1. **Wyszukiwanie Parkingów**
- Wybór lotniska (Katowice-Pyrzowice / Kraków-Balice)
- Podanie dat i godzin przyjazdu/wyjazdu
- Wyświetlenie dostępnych parkingów z:
  - Ceną za dzień
  - Odległością od terminala
  - Czasem dojazdu transferem
  - Oceną i liczbą opinii
  - Opisem usług (CCTV, ogrodzenie, transfer, zadaszenie itp.)

#### 2. **Autentykacja**
- Rejestracja i logowanie przez email + hasło
- Logowanie przez Google OAuth (z pobieraniem avatara użytkownika)
- Opcjonalne konto — możliwość rezerwacji bez rejestracji

#### 3. **Rezerwacja Parkingu**
- Trzyetapowy workflow:
  1. **Wybór parkingu** — przeglądanie szczegółów, ceny, opinii
  2. **Podanie danych** — imię, nazwisko, numer telefonu, rejestracja auta, numer lotu
  3. **Podsumowanie i potwierdzenie** — przegląd rezerwacji, wygenerowany kod potwierdzenia (format: CP-XXXXXX)
- Automatyczne generowanie unikalnego kodu potwierdzenia dla każdej rezerwacji
- Placeholder powiadomienia email po rezerwacji (wysyłanie maili do implementacji w przyszłości)

#### 4. **Panel Użytkownika (Dashboard)**
- Przegląd profilu z miniaturką Google (jeśli zalogowany przez Google)
- Historia rezerwacji (nadchodzące i przeszłe)
- Możliwość anulowania rezerwacji
- Możliwość powtórzenia rezerwacji dla kolejnego wylotu
- Link do panelu właściciela (dla użytkowników z rolą "owner" lub "admin")

### Dla Właścicieli Parkingów (B2B)

#### 1. **Panel Właściciela (Owner Dashboard)**
- Dostęp ograniczony do użytkowników z rolą "owner" lub "admin"
- **Statystyki:**
  - Liczba rezerwacji w tym miesiącu
  - Przychód z rezerwacji
  - Liczba dostępnych miejsc
- **Tabela rezerwacji:**
  - Filtrowanie po statusie (nadchodzące, przeszłe, wszystkie)
  - Wyszukiwanie po nazwie klienta lub rejestracji auta
  - Kolumny: imię klienta, telefon, rejestracja auta, nr lotu, daty, status
  - Przyciski do zarządzania statusami rezerwacji (potwierdź, anuluj, zakończ)
- **Powiadomienia:**
  - Placeholder dla powiadomień email do właściciela o nowych rezerwacjach

#### 2. **Zarządzanie Rezerwacjami**
- Widok wszystkich rezerwacji przypisanych do parkingów właściciela
- Zmiana statusu rezerwacji (pending → confirmed → completed / cancelled)
- Dostęp do danych kontaktowych klienta (imię, telefon)

---

## 🏗️ Architektura Techniczna

### Frontend
- **Framework:** React 19 + TypeScript
- **Routing:** Wouter (client-side routing)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Komponenty:** Karty, formularze, tabele, modalne okna
- **Dwujęzyczność:** Polski (PL) i Angielski (EN) z przełącznikiem w nawigacji

### Backend & Baza Danych
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Autentykacja:** Supabase Auth (email+hasło, Google OAuth)
- **Baza danych:**
  - `parking_lots` — lista parkingów z cenami, oceną, opisem
  - `profiles` — profile użytkowników z rolami (client, owner, admin)
  - `reservations` — rezerwacje z automatycznie generowanymi kodami potwierdzenia
  - `parking_lot_owners` — przypisanie parkingów do właścicieli
  - `notifications_log` — placeholder dla systemu powiadomień

### Bezpieczeństwo
- **Row Level Security (RLS)** w Supabase:
  - Klienci widzą tylko swoje rezerwacje
  - Właściciele widzą rezerwacje swoich parkingów
  - Admini mają dostęp do wszystkich danych

### Hosting
- **Domena:** cribropark-stqjxm4u.manus.space
- **Hosting:** Manus (wbudowany hosting)
- **Baza danych:** Supabase Cloud

---

## 📊 Model Biznesowy

### Przychody
- **Prowizja procentowa** od każdej rezerwacji (procent ustalony w umowie z właścicielem parkingu)
- Przychód obliczany automatycznie na podstawie ceny parkingu i liczby dni rezerwacji

### Strategie Konkurencyjne
1. **Dedykowana pula miejsc** — właściciele parkingów oddają pulę miejsc wyłącznie dla Cribro w niższych cenach
2. **Niższe ceny** — dzięki prowizji od Cribro, klienci płacą mniej niż na konkurencyjnych portalach
3. **Łatwa rezerwacja** — prosty, intuicyjny interfejs (3 kroki)
4. **Automatyzacja** — system automatycznie generuje kody potwierdzenia, zarządza dostępnością

---

## 🔄 Workflow Rezerwacji

### Dla Klienta:
1. Wejście na stronę główną
2. Wybór lotniska, dat i godzin
3. Przeglądanie dostępnych parkingów
4. Kliknięcie "Zarezerwuj"
5. Podanie danych osobowych
6. Potwierdzenie rezerwacji
7. Otrzymanie kodu potwierdzenia (CP-XXXXXX)
8. Kod pokazywany na parkingu jako dowód rezerwacji

### Dla Właściciela:
1. Zalogowanie do panelu właściciela
2. Przegląd nadchodzących rezerwacji
3. Potwierdzenie rezerwacji (zmiana statusu na "confirmed")
4. Przygotowanie miejsca parkingowego
5. Po przyjeździe klienta — zmiana statusu na "completed"

---

## 📱 Dane Testowe

### Parkingi (Seed Data)
- **4 parkingi przy Katowice-Pyrzowice (KTW):**
  - KatoPark Standard — 15 PLN/dzień, 4.5★
  - KatoPark Premium — 28 PLN/dzień, 4.8★
  - KatoExpress — 12 PLN/dzień, 4.2★
  - KatoPark VIP — 45 PLN/dzień, 4.9★

- **4 parkingi przy Kraków-Balice (KRK):**
  - KrakPark Economy — 18 PLN/dzień, 4.3★
  - KrakPark Express — 27 PLN/dzień, 4.5★
  - Airport Parking Kraków VIP — 45 PLN/dzień, 4.9★
  - BudgetPark Balice — 18 PLN/dzień, 4.2★

### Konta Testowe
- Każdy nowy użytkownik rejestruje się jako "client"
- Aby przetestować panel właściciela, zmień rolę w Supabase:
  ```sql
  UPDATE profiles SET role = 'owner' WHERE email = 'twoj@email.com';
  ```

---

## 🚀 Funkcjonalności Zaimplementowane

✅ Landing page z hero section i formularzem wyszukiwania  
✅ Wyszukiwanie parkingów z filtrowaniem po lotniskach i datach  
✅ Autentykacja (email+hasło + Google OAuth)  
✅ Miniaturka Google avatar w profilu użytkownika  
✅ Trzyetapowy workflow rezerwacji  
✅ Automatyczne generowanie kodów potwierdzenia (CP-XXXXXX)  
✅ Panel użytkownika (Dashboard) z historią rezerwacji  
✅ Panel właściciela (Owner Dashboard) z tabelą rezerwacji  
✅ System ról (client, owner, admin)  
✅ Dwujęzyczność (PL/EN)  
✅ Row Level Security w Supabase  
✅ Placeholder powiadomień email  
✅ Responsywny design (desktop + mobile)  

---

## 📋 Funkcjonalności do Implementacji

- [ ] Integracja prawdziwych maili (Resend/SendGrid)
- [ ] Placeholder płatności (symulacja procesu płatności)
- [ ] System ocen i opinii od klientów
- [ ] Zarządzanie dostępnością miejsc parkingowych (real-time)
- [ ] Raport przychodu dla właścicieli
- [ ] Integracja z systemem CRM
- [ ] Aplikacja mobilna (iOS + Android)
- [ ] API dla integracji z zewnętrznymi serwisami
- [ ] System promocji i kodów rabatowych

---

## 🎨 Design

- **Styl:** Minimalistyczny, nowoczesny (Aerial Calm — Skandynawski Minimalizm Lotniczy)
- **Kolory:** Ciepła biel, głęboki grafit, spokojny niebieski
- **Typografia:** Sora (nagłówki) + Inter (body)
- **Komponenty:** shadcn/ui + Tailwind CSS
- **Animacje:** Delikatne przejścia, unoszące się karty

---

## 📞 Kontakt & Wsparcie

- **Projekt:** Cribro Parking
- **Marka:** Cribro
- **Domena:** cribropark-stqjxm4u.manus.space
- **Baza danych:** Supabase (projekt: CarParks)

---

## 📝 Notatki Dla Wspólnika

Ten dokument stanowi pełne podsumowanie aktualnego stanu projektu Cribro Parking. System jest gotowy do prezentacji inwestorom i potencjalnym partnerom (właścicielom parkingów). Wszystkie kluczowe funkcjonalności działają — od wyszukiwania parkingów, przez rezerwację, aż po panel zarządzania dla właścicieli.

**Następne kroki:**
1. Testowanie pełnego workflow rezerwacji
2. Dodanie placeholder płatności
3. Przypisanie roli "owner" do testowych kont
4. Prezentacja wspólnikowi i potencjalnym partnerom
