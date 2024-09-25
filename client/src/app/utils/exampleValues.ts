export const EXAMPLE_USER_QUERY =
  'Ile sztuk listwy startowej wentylacyjnej D-MATT 9005 sprzedano w roku 2024?';

export const EXAMPLE_FORMATTED_ANSWER =
  'W roku 2024 sprzedano 4281 sztuk listwy startowej wentylacyjnej D-MATT 9005.';

export const EXAMPLE_SQL_STATEMENT =
  "SELECT SUM(ilosc) FROM zyskownosc WHERE opis_towaru LIKE '%listwa startowa wentylacyjna D-MATT 9005%' AND rok = 2024;";

export const EXAMPLE_ROW_DATA = [
  {
    'SUM(ilosc)': '45989.00000',
  },
];
