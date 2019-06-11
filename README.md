### WAVC

#Tablica Wirtualna

Przy próbie statycznego otwarcia strony, może wystąpić błąd spowodowany przez politykę bezpieczeństwa CORS.
Należy wtedy
1. włączyć przeglądarkę w niebezpiecznym trybie. Wskazówki można znaleźć w linku poniżej
  https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome
lub
2. uruchomić dowolny lokalny serwer http
  Najprościej za pomocą narzędzia http-server
  1. należy pobrać node.js
  2. npm install http-server -g
  3. http-server "<ścieżka do katalogu"
