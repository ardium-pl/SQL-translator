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
    handlowiec: 'Nowak Mciej (563)',
    total_profit: '125443.9240700',
  },
  {
    handlowiec: 'Roman Kot (456)',
    total_profit: '5523441854.8967300',
  },
  {
    handlowiec: 'Kowalski Piotr (453)',
    total_profit: '480234345.9563100',
  },
];
