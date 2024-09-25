export const EXAMPLE_USER_QUERY =
  'Ile sztuk listwy startowej wentylacyjnej D-MATT 9005 sprzedano w roku 2024?';

export const EXAMPLE_FORMATTED_ANSWER =
  'W roku 2024 sprzedano 4281 sztuk listwy startowej wentylacyjnej D-MATT 9005.';

export const EXAMPLE_SQL_STATEMENT =
  "SELECT SUM(ilosc) FROM zyskownosc WHERE opis_towaru LIKE '%listwa startowa wentylacyjna D-MATT 9005%' AND rok = 2024;";

export const EXAMPLE_ROW_DATA_SINGLE = [
  {
    'SUM(ilosc)': '45989.00000',
  },
];

export const EXAMPLE_ROW_DATA_ARRAY = [
  {
    handlowiec: 'Grzybowski Grzegorz (GGG2)',
    total_profit: '642201.9240700',
  },
  {
    handlowiec: 'Hawliczek Roman (HRR1)',
    total_profit: '551854.8967300',
  },
  {
    handlowiec: 'Wojciechowski Piotr (WPM11)',
    total_profit: '480345.9563100',
  },
];
