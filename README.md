# WAVC
Web Application for Video Conferences

Po sklonowaniu repozytorium należy zmienić ConnectionStrings w pliku appsettings.json tak, by odpowiadały parametrom bazy danych, z którą aplikacja ma się połączyć. Obecnie kod jest przystosowany, by działać z bazą MSSQL.
Następnie albo za pomocą Visual Studio Command Prompt albo po wejściu do solucji klikając Tools -> NuGet Package Manager -> Package Manager Console: należy wpisać komendę "Update-Database".
Po pomyślnym ustawieniu będzie można połączyć się z bazą danych i tworzyć konta użytkowników (obecnie konto takie jest jedynie wykorzystywane do wypisania nazwy użytkownika, z którym się łączymy, na konsolę (wypisywanie tylko po stronie osoby inicjującej rozmowę))

Po włączeniu projektu w przeglądarce należy przejść do zakładki Call (pozostałe Home, About, Contact zostały wygenerowane automatycznie na razie nic w nich nie zmienialiśmy).
Za pierwszym użyciem aplikacja zapyta o pozwolenie na użycie kamery oraz mikrofonu.
Domyślnie wyświetlony będzie obraz z pierwszej kamery i brak audio (co na chwilę obecną nie odpowiada zaznaczonym urządzeniom na liście urządzeń)
Można tam wybrać które urządzenie audio lub video użyć (planujemy wypisać nazwy tych urządzeń, ale obecnie są tylko ponumerowane)
Następnie należy wcisnąć guzik Update, by zaktualizować wybrane ustawienia (w aplikacji docelowej bedzię to zrobione automatycznie)
By zatrzymać korzystanie z urządzeń można wybrać "off" dla poszczególnego urządzenia, lub wcisnąć przycisk stop, który zatrzyma wszystkie
Poniżej wyświetlany jest podgląd obrazu z kamery (oraz dźwięk będzie grany na głośnikach, co trzeba będzie zmienić)
Gdy włączymy aplikację w nowej karcie (lub z innego urządzenia, lecz możliwe, że trzeba będzie ustawić reverse proxy, by móc połączyć się spoza localhosta) aplikacja automatycznie połączy się z drugą kartą (może wystąpić problem gdy połączenie wystąpi wcześniej niż ustawienie strumienia z kamery. Odświeżenie strony powinno pomóc)
Po połączeniu zostaje przesyłany zarówno obraz jak i dzwięk z obu urządzeń (jeśli tak ustawiono) i na dole strony pokazany zostanie obraz drugiej osoby.
Na chwilę obecną po ustaleniu połączenia z drugą kartą zmiana urządzenia audio lub video spowoduje przerwanie połączenia (będziemy musieli wznowić je po takim zdarzeniu)
